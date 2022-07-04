import Cryptr from 'cryptr';
import bcrypt from 'bcrypt';

class Cipher {

    constructor (saltRounds) {
        this.saltRounds = saltRounds;
        this.crypt = new Cryptr("MySecretKey");
    }

    async hash (plainText) {
        return await bcrypt.hash(plainText, this.saltRounds);
    }

    async compareHashes (plainText, hash) {
        return await bcrypt.compare(plainText, hash);
    }

    // AES cipher functions
    encrypt (plainText) {
        return this.crypt.encrypt(plainText);
    }

    decrypt (hash) {
        return this.crypt.decrypt(hash);
    }
}

export default new Cipher(10);