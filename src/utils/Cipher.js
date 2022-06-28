import bcrypt from 'bcrypt';

class Cipher {

    constructor (saltRounds) {
        this.saltRounds = saltRounds;
    }

    async hash (plainText) {
        return await bcrypt.hash(plainText, this.saltRounds);
    }

    async compareHashes (plainText, hash) {
        return await bcrypt.compare(plainText, hash);
    }
}

export default new Cipher(10);