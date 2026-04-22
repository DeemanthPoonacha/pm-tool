import crypto from 'crypto';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(inputPassword: string, storedHash: string): { valid: boolean } {
  const [method, salt, hash] = storedHash.split(':');
  if (method !== 'scrypt') return { valid: false };
  const computedHash = crypto.scryptSync(inputPassword, salt, 64).toString('hex');
  return { valid: computedHash === hash };
}
