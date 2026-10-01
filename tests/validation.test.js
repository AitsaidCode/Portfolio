/**
 * Unit & Integration Test Suite for Form Validation, Guard Clauses, Bridge Encoding & Server Security
 */
const assert = require('assert');
const path = require('path');

// 1. Production implementations under test
const { isValidEmail, sanitizeInput, buildWhatsAppText } = require('../main.js');
const { resolveSafePath } = require('../server.js');

// Mirrors the submit handler: sanitize, guard, then encode
function buildWhatsAppPayload(name, email, phone, type, message) {
  const fields = {
    name: sanitizeInput(name),
    email: sanitizeInput(email),
    phone: sanitizeInput(phone),
    type: sanitizeInput(type),
    message: sanitizeInput(message)
  };

  if (fields.name.length < 2) throw new Error('Invalid name');
  if (!isValidEmail(fields.email)) throw new Error('Invalid email');
  if (fields.message.length < 10) throw new Error('Invalid message');

  return encodeURIComponent(buildWhatsAppText(fields));
}

// 2. Test Execution
console.log('--- Running Guard Clause, Validation & Security Tests ---');

// Test Case 1: String Sanitization & XSS Guards
assert.strictEqual(sanitizeInput('<b>Test</b>'), 'bTest/b', 'HTML tag removal test failed');
assert.strictEqual(sanitizeInput('<script>alert("xss")</script>'), 'scriptalert("xss")/script', 'Script tag neutralization failed');
assert.strictEqual(sanitizeInput('   Clean Text   '), 'Clean Text', 'Trimming test failed');
assert.strictEqual(sanitizeInput(null), '', 'Null input handling failed');
assert.strictEqual(sanitizeInput(undefined), '', 'Undefined input handling failed');
assert.strictEqual(sanitizeInput(123), '', 'Non-string input handling failed');
console.log('✓ String sanitization & XSS neutralization tests passed.');

// Test Case 2: Email Guard Clause
assert.strictEqual(isValidEmail('contact@devsurmesure.com'), true, 'Valid domain email test failed');
assert.strictEqual(isValidEmail('john.doe+filter@sorbonne-universite.fr'), true, 'Complex valid email test failed');
assert.strictEqual(isValidEmail('plainaddress'), false, 'Missing domain test failed');
assert.strictEqual(isValidEmail('@missingusername.com'), false, 'Missing local part test failed');
assert.strictEqual(isValidEmail('user@.com'), false, 'Malformed domain test failed');
assert.strictEqual(isValidEmail(''), false, 'Empty string test failed');
assert.strictEqual(isValidEmail(null), false, 'Null email test failed');
console.log('✓ Email validation tests passed.');

// Test Case 3: WhatsApp Payload Generation & Guard Enforcements
const validPayload = buildWhatsAppPayload(
  'Dr. Laurent',
  'dr.laurent@clinique.fr',
  '0612345678',
  'Plateforme Santé',
  'Projet de mise en place d\'un portail patient DICOM.'
);
assert.ok(validPayload.length > 50, 'WhatsApp payload generated with insufficient length');
assert.ok(validPayload.includes(encodeURIComponent('Dr. Laurent')), 'Payload missing encoded name');
assert.ok(validPayload.includes(encodeURIComponent('dr.laurent@clinique.fr')), 'Payload missing encoded email');
console.log('✓ WhatsApp payload encoding tests passed.');

// Test Case 4: Guard Clause Error Throws
assert.throws(() => {
  buildWhatsAppPayload('A', 'valid@email.com', '', 'Type', 'Valid description long enough');
}, /Invalid name/, 'Short name failed to trigger guard error');

assert.throws(() => {
  buildWhatsAppPayload('Valid Name', 'not-an-email', '', 'Type', 'Valid description long enough');
}, /Invalid email/, 'Invalid email failed to trigger guard error');

assert.throws(() => {
  buildWhatsAppPayload('Valid Name', 'valid@email.com', '', 'Type', 'Short');
}, /Invalid message/, 'Short message failed to trigger guard error');
console.log('✓ Guard clause rejection tests passed.');

// Test Case 5: Path Traversal Defenses
const mockRootDir = '/var/www/devsurmesure';
assert.strictEqual(resolveSafePath('/', mockRootDir), path.join(mockRootDir, 'index.html'), 'Root should map to index.html');
assert.strictEqual(resolveSafePath('/assets/hicham.jpg', mockRootDir), path.join(mockRootDir, 'assets/hicham.jpg'), 'Subdirectory asset allowed');
assert.strictEqual(resolveSafePath('/../../../etc/passwd', mockRootDir), path.join(mockRootDir, 'etc/passwd'), 'Traversal must stay within root');
assert.strictEqual(resolveSafePath('/%2e%2e/%2e%2e/etc/passwd', mockRootDir).startsWith(mockRootDir + path.sep), true, 'Encoded traversal must stay within root');
assert.strictEqual(resolveSafePath('/%E0%A4%A', mockRootDir), null, 'Malformed URI must be rejected, not throw');
assert.strictEqual(resolveSafePath('/index.html%00.png', mockRootDir), null, 'Null byte must be rejected');
assert.strictEqual(resolveSafePath(undefined, mockRootDir), null, 'Non-string path must be rejected');
console.log('✓ Path traversal prevention tests passed.');

// Test Case 6: WhatsApp phone fallback
assert.ok(buildWhatsAppText({ name: 'Ana', email: 'a@b.fr', phone: '', type: 'Site', message: 'Bonjour test' }).includes('Non renseigné'), 'Empty phone fallback missing');
console.log('✓ WhatsApp message builder tests passed.');

console.log('====================================================');
console.log('ALL EXTENDED SECURITY & VALIDATION TESTS PASSED (100%).');
console.log('====================================================');

