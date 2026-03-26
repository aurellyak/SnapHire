import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash password menggunakan bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    console.log('[PASSWORD] Hashing password...');
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    console.log('[PASSWORD] Password hashed successfully');
    return hashedPassword;
  } catch (error) {
    console.error('[PASSWORD] Error hashing password:', error);
    throw error;
  }
}

/**
 * Compare plain text password dengan hashed password
 * @param password - Plain text password dari input
 * @param hash - Hashed password dari database
 * @returns true jika cocok, false jika tidak
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    console.log('[PASSWORD] Comparing password...');
    const isMatch = await bcrypt.compare(password, hash);
    if (isMatch) {
      console.log('[PASSWORD] Password match');
    } else {
      console.log('[PASSWORD] Password mismatch');
    }
    return isMatch;
  } catch (error) {
    console.error('[PASSWORD] Error comparing password:', error);
    throw error;
  }
}
