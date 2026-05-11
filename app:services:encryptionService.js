const crypto = require('crypto');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key-please-change', 'salt', 32);
  }

  // Homomorphic encryption simulation for aggregated data
  encryptAggregate(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decryptAggregate(encryptedData) {
    const decipher = crypto.createDecipheriv(
      this.algorithm, 
      this.key, 
      Buffer.from(encryptedData.iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }

  // Hash for anonymous IDs (non-reversible)
  hashAnonymousId(data, salt = null) {
    const useSalt = salt || crypto.randomBytes(16).toString('hex');
    return crypto
      .createHash('sha256')
      .update(`${data}:${useSalt}`)
      .digest('hex');
  }

  // Generate session-based encryption key (rotated per session)
  generateSessionKey(sessionId) {
    return crypto
      .createHash('sha256')
      .update(`${sessionId}:${process.env.SESSION_SECRET}`)
      .digest('hex')
      .substring(0, 32);
  }
}

module.exports = new EncryptionService();