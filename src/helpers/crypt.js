import bcrypt from 'bcrypt';

class Cipher {

    constructor (saltRound) {
        this.saltRound = saltRound;
    }

    async hash (plainText) {
        return await bcrypt.hash(plainText, this.saltRound);
    }

    async compareHashes (plainText) {
        // Code
    }
}

export default new Cipher(10);