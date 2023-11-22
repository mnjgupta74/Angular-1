import { Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';
import * as forge from 'node-forge';
// const CryptoJS = require('crypto-js');
const STORE_KEY:any = '1234567890123456';
// const keys = '1234567891234567';
@Injectable({
  providedIn: "root"
})
export class AESEncDecService {
  private secretKey = 'YU787Y6T5R4EYU8CYU787Y6T5R4EYU8C';
  constructor() {}
  // The get method is use for Encrypt the value.
    EncryptData(value: any) {
        var key = CryptoJS.enc.Utf8.parse(STORE_KEY);
        var iv = CryptoJS.enc.Utf8.parse(STORE_KEY);
        var encrypted = CryptoJS.AES.encrypt(
          CryptoJS.enc.Utf8.parse(value.toString()),
          key,
          {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          }
        );
    
        return encrypted.toString();
      }
    
      //The get method is use for Decrypt the value.
      DecryptData(value: any) {
        var key = CryptoJS.enc.Utf8.parse(STORE_KEY);
        var iv = CryptoJS.enc.Utf8.parse(STORE_KEY);
        var decrypted = CryptoJS.AES.decrypt(value, key, {
          keySize: 128 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });
    
        return decrypted.toString(CryptoJS.enc.Utf8);
      }



      private ivSize = 16; // Initialization Vector (IV) size in bytes (128 bits for AES)

      encryptAES256GCM(messageToEncrypt: string): string {
        const key = this.secretKey; // Ensure your secret key is hex-encoded
        const nonce = forge.random.getBytesSync(12); // Generate a 12-byte nonce for GCM
    
        const cipher = forge.cipher.createCipher('AES-GCM', forge.util.hexToBytes(key));
        cipher.start({ iv: nonce });
        cipher.update(forge.util.createBuffer(messageToEncrypt, 'utf8'));
        cipher.finish();
    
        const encryptedBytes = cipher.output.getBytes();
        const cipherText = forge.util.encode64(encryptedBytes);
        const nonceHex = forge.util.bytesToHex(nonce);
    
        return nonceHex + cipherText;
      }
      decryptAES256GCM(encryptedMessage: string): string {
        const key = this.secretKey; // Ensure your secret key is hex-encoded
    
        // Extract the nonce and ciphertext from the combined message
        const nonceHex = encryptedMessage.substr(0, 24); // 12 bytes nonce in 24 characters
        const cipherTextBase64 = encryptedMessage.substr(24);
    
        const nonce = forge.util.hexToBytes(nonceHex);
        const cipherText = forge.util.decode64(cipherTextBase64);
    
        const decipher = forge.cipher.createDecipher('AES-GCM', forge.util.hexToBytes(key));
        decipher.start({ iv: nonce });
        decipher.update(forge.util.createBuffer(cipherText, 'raw'));
        decipher.finish();
    
        const decryptedText = decipher.output.toString();
    
        return decryptedText;
      }
    
}