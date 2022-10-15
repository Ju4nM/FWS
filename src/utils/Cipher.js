import Cryptr from 'cryptr';
import { hash, compare } from 'bcrypt';

class Cipher {

    constructor (saltRounds) {
        this.saltRounds = saltRounds;
        this.crypt = new Cryptr("$2b$08$9GndkNpfMEUZDFq3BCdTyOSziATRmMpk1s/Nmm0rg4IzO0zFKqInm");
    }

    async hash (plainText) {
        return await hash(plainText, this.saltRounds);
    }

    async compareHashes (plainText, hash) {
        return await compare(plainText, hash);
    }

    // AES cipher functions
    encrypt (plainText) {
        return this.crypt.encrypt(plainText);
    }

    decrypt (hash) {

        // if cryptr can't decrypt the hash then throws an error and stops the server
        try {
            return this.crypt.decrypt(hash);
        } catch (error) {
            // console.log(error)
            return {};
        }
    }
}

export default new Cipher(10);
