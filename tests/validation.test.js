/**
 * Unit & Integration Test Suite for Form Validation, Guard Clauses & Bridge Encoding
 */
const assert = require('assert');

// 1. Logic implementations under test
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const sanitized = email.trim();
  if (sanitized.length === 0 || sanitized.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(sanitized);
}

function sanitizeInput(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[<>]/g, '');
}

function buildWhatsAppPayload(name, email, phone, type, message) {
  const sName = sanitizeInput(name);
  const sEmail = sanitizeInput(email);
  const sPhone = sanitizeInput(phone);
  const sType = sanitizeInput(type);
  const sMessage = sanitizeInput(message);

  if (sName.length < 2) throw new Error('Invalid name');
  if (!isValidEmail(sEmail)) throw new Error('Invalid email');
  if (sMessage.length < 10) throw new Error('Invalid message');

  const text = 
    `Bonjour Hicham,\n\n` +
    `Je vous contacte depuis votre portfolio :\n` +
    `• Nom : ${sName}\n` +
    `• Email : ${sEmail}\n` +
    `• Téléphone : ${sPhone.length > 0 ? sPhone : 'Non renseigné'}\n` +
    `• Besoin : ${sType}\n\n` +
    `Détails de ma demande :\n${sMessage}`;

  return encodeURIComponent(text);
}

// 2. Test Execution
console.log('--- Running Guard Clause & Validation Tests ---');

// Test Case 1: String Sanitization
assert.strictEqual(sanitizeInput('<b>Test</b>'), 'bTest/b', 'HTML tag removal test failed');
assert.strictEqual(sanitizeInput('   Clean Text   '), 'Clean Text', 'Trimming test failed');
assert.strictEqual(sanitizeInput(null), '', 'Null input handling failed');
assert.strictEqual(sanitizeInput(undefined), '', 'Undefined input handling failed');
assert.strictEqual(sanitizeInput(123), '', 'Non-string input handling failed');
console.log('✓ String sanitization tests passed.');

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

console.log('==============================================');
console.log('ALL TESTS EXECUTED SUCCESSFULLY WITHOUT ERRORS.');
console.log('==============================================');
