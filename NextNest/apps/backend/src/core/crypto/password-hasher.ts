import bcrypt from "bcryptjs";

const DEFAULT_SALT_ROUNDS = 12;

export const PasswordHasher = {
  /**
   * Hashes a plaintext password using bcrypt with 12 salt rounds by default.
   */
  async hash(plainText: string, saltRounds = DEFAULT_SALT_ROUNDS): Promise<string> {
    if (!plainText || plainText.length === 0) {
      throw new Error("Password to hash must not be empty");
    }
    return bcrypt.hash(plainText, saltRounds);
  },

  /**
   * Verifies a plaintext password against a stored bcrypt hash.
   */
  async verify(plainText: string, hash: string): Promise<boolean> {
    if (!plainText || !hash) {
      return false;
    }
    return bcrypt.compare(plainText, hash);
  }
} as const;

export type PasswordHasher = typeof PasswordHasher;
