/**
 * IMPORTANT NOTE:
 * If you have existing encrypted tokens in the database stored
 * with the old CBC format, they will fail to decrypt with this
 * new GCM implementation. You will need to clear the
 * encryptedAccessToken and encryptedRefreshToken fields for
 * all existing users and ask them to reconnect Gmail.
 * A migration script is recommended for production use.
 */

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const TAG_LENGTH = 16

// TODO: ENCRYPTION_KEY must be a 32-byte hex string in your .env
// Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

export function encrypt(text) {
  try {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final()
    ])
    const tag = cipher.getAuthTag()
    // Format: ivHex:tagHex:encryptedBase64
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('base64')}`
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Encryption failed')
  }
}

export function decrypt(encryptedText) {
  try {
    const [ivHex, tagHex, encryptedBase64] = encryptedText.split(':')
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
    const iv = Buffer.from(ivHex, 'hex')
    const tag = Buffer.from(tagHex, 'hex')
    const encrypted = Buffer.from(encryptedBase64, 'base64')
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ])
    return decrypted.toString('utf8')
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Decryption failed')
  }
}
