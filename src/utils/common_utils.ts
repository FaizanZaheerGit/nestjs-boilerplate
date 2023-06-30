import config from '../config/config';
import * as bcrypt from 'bcryptjs';
import { createCipheriv,createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const { SECRET, PASSWORD } = process.env;

const common_utils = {
    get_current_epoch_time: (): number => {
        /*
            This function will return the current epoch time
            parameters:
            return current epoch time:
        */
        return Math.trunc(Date.now() / 1000);
    },
    encrypt_password: async (password: string) => {
        /*
            This function will create a salt and encrypted password
            parameters: password
            return: encrypted password and salt
        */
        const salt = await bcrypt.genSalt(config['SALT_WORK_FACTOR']);
        const hashed_password = bcrypt.hashSync(password, salt);
        return [hashed_password, salt];
    },

    compare_password: async (password: string , hashedPassword: string) => {
        /*
            This function will compare hashed password against user's input password
            parameters: password, hashed password
            return: boolean
        */
        const match_pass = await bcrypt.compare(password,hashedPassword);
        return match_pass;
    },
    encrypt_token: async (token: string): Promise<string> => {
        /*
          This function will create a random IV, prepend it to the token, and encrypt the combined value.
          parameters: token
          return: encrypted text with IV
        */
        const iv = randomBytes(16);
        const key = (await promisify(scrypt)(PASSWORD, SECRET, 32)) as Buffer;
        const cipher = createCipheriv('aes-256-cbc', key, iv);

        const encrypted_text = Buffer.concat([
          iv,
          cipher.update(token, 'utf8'),
          cipher.final()
        ]);

        return encrypted_text.toString('base64');
      },

      decrypt_token: async (encryptedText: string): Promise<string> => {
        /*
          This function will extract the IV from the encrypted text, and decrypt the remaining data.
          parameters: encrypted text with IV
          return: decrypted token
        */
        const encryptedBuffer = Buffer.from(encryptedText, 'base64');
        const iv = encryptedBuffer.slice(0, 16);
        const tokenData = encryptedBuffer.slice(16);
        const key = (await promisify(scrypt)(PASSWORD, SECRET, 32)) as Buffer;
        const decipher = createDecipheriv('aes-256-cbc', key, iv);
      
        const decryptedText = Buffer.concat([
          decipher.update(tokenData),
          decipher.final()
        ]);

        return decryptedText.toString('utf8');
      }
}

export default common_utils;
