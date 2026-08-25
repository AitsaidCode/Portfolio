/**
 * Pure Node.js PNG & ICO generator for Google Search Favicons & Apple Touch Icons
 * Zero external dependencies. Uses Node.js built-in zlib, fs, and path.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table for PNG chunk checksums
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  CRC_TABLE[i] = c;
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const body = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(body), 0);

  return Buffer.concat([lenBuf, body, crcBuf]);
}

function generateEmblemPNG(size) {
  const width = size;
  const height = size;
  const rawRows = [];

  const center = size / 2;
  const radius = size * 0.46;
  const innerRadius = size * 0.42;

  // Colors
  const darkBg = [23, 24, 33, 255];        // #171821
  const terracotta = [176, 85, 47, 255];    // #B0552F
  const white = [251, 249, 244, 255];       // #FBF9F4
  const transparent = [0, 0, 0, 0];

  for (let y = 0; y < height; y++) {
    const row = [0]; // Filter byte (0 = None)
    for (let x = 0; x < width; x++) {
      const dx = x - center + 0.5;
      const dy = y - center + 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let color = transparent;

      if (dist <= radius) {
        if (dist > innerRadius) {
          // Terracotta border ring
          color = terracotta;
        } else {
          // Dark obsidian background
          color = darkBg;

          // Draw "H" glyph in center
          const nx = (x - center) / innerRadius;
          const ny = (y - center) / innerRadius;

          const inLeftStem = (nx >= -0.42 && nx <= -0.22 && ny >= -0.52 && ny <= 0.52);
          const inRightStem = (nx >= 0.22 && nx <= 0.42 && ny >= -0.52 && ny <= 0.52);
          const inCrossBar = (nx >= -0.42 && nx <= 0.42 && ny >= -0.13 && ny <= 0.13);
          const inDotAccent = (nx >= -0.10 && nx <= 0.10 && ny >= -0.52 && ny <= -0.32);

          if (inLeftStem || inRightStem || inCrossBar) {
            color = white;
          } else if (inDotAccent) {
            color = terracotta;
          }
        }
      }

      row.push(color[0], color[1], color[2], color[3]);
    }
    rawRows.push(Buffer.from(row));
  }

  const rawData = Buffer.concat(rawRows);
  const compressed = zlib.deflateSync(rawData, { level: 9 });

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);  // Bit depth
  ihdr.writeUInt8(6, 9);  // Color type (6 = RGBA)
  ihdr.writeUInt8(0, 10); // Compression method
  ihdr.writeUInt8(0, 11); // Filter method
  ihdr.writeUInt8(0, 12); // Interlace method

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createICO(pngBuffer) {
  // Simple 1-image ICO wrapper for standard 48x48 PNG
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(1, 4); // 1 image

  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(48, 0);  // Width (48)
  dirEntry.writeUInt8(48, 1);  // Height (48)
  dirEntry.writeUInt8(0, 2);   // Color palette (0 = no palette)
  dirEntry.writeUInt8(0, 3);   // Reserved
  dirEntry.writeUInt16LE(1, 4); // Color planes
  dirEntry.writeUInt16LE(32, 6); // Bits per pixel (32)
  dirEntry.writeUInt32LE(pngBuffer.length, 8); // Size of PNG data
  dirEntry.writeUInt32LE(6 + 16, 12); // Offset of data (header + 1 dir entry = 22)

  return Buffer.concat([header, dirEntry, pngBuffer]);
}

// Generate all required formats
const assetsDir = path.join(__dirname, '..', 'assets');
const rootDir = path.join(__dirname, '..');

const p48 = generateEmblemPNG(48);
const p96 = generateEmblemPNG(96);
const p180 = generateEmblemPNG(180);
const p192 = generateEmblemPNG(192);
const p512 = generateEmblemPNG(512);
const ico = createICO(p48);

fs.writeFileSync(path.join(assetsDir, 'favicon-48x48.png'), p48);
fs.writeFileSync(path.join(assetsDir, 'favicon-96x96.png'), p96);
fs.writeFileSync(path.join(assetsDir, 'apple-touch-icon.png'), p180);
fs.writeFileSync(path.join(assetsDir, 'favicon-192x192.png'), p192);
fs.writeFileSync(path.join(assetsDir, 'favicon-512x512.png'), p512);

// Root files for direct Googlebot and browser crawlers
fs.writeFileSync(path.join(rootDir, 'favicon.ico'), ico);
fs.writeFileSync(path.join(rootDir, 'favicon-48x48.png'), p48);
fs.writeFileSync(path.join(rootDir, 'apple-touch-icon.png'), p180);

console.log('✓ Successfully generated all Google-compliant Favicons (48px, 96px, 180px, 192px, 512px, favicon.ico)!');
