using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ARKODesktop
{
    class EncryptDecrypt
    {
        // Constant 16-byte key and IV for AES-128
        private static readonly byte[] Key = Encoding.UTF8.GetBytes("gtSZlG2ljzJjB5pu");  // 16 bytes for AES-128
        private static readonly byte[] IV = Encoding.UTF8.GetBytes("gtSZlG2ljzJjB5pu");  // 16 bytes IV (fixed)

        // Method to encrypt a password
        public static string EncryptPassword(string password)
        {
            // Ensure the Key and IV are 16 bytes
            if (Key.Length != 16 || IV.Length != 16)
            {
                throw new ArgumentException("Key and IV must be 16 bytes for AES-128.");
            }

            using (Aes aes = Aes.Create())
            {
                aes.Key = Key;  // Set the encryption key
                aes.IV = IV;    // Set the initialization vector (IV)
                aes.Mode = CipherMode.CBC;   // CBC mode
                aes.Padding = PaddingMode.PKCS7;  // Padding scheme

                using (var encryptor = aes.CreateEncryptor(aes.Key, aes.IV))
                {
                    using (var ms = new MemoryStream())
                    {
                        // Create a CryptoStream to perform the encryption
                        using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                        {
                            using (var sw = new StreamWriter(cs))
                            {
                                sw.Write(password);  // Write the password to encrypt
                            }
                        }

                        // Return the Base64-encoded encrypted string (with IV prepended)
                        return Convert.ToBase64String(ms.ToArray());
                    }
                }
            }
        }

        // Method to decrypt a password
        public static string DecryptPassword(string encryptedPassword)
        {
            byte[] fullCipher = Convert.FromBase64String(encryptedPassword);

            // Ensure the encrypted string is not empty
            if (fullCipher.Length < 16)  // Check for IV length
            {
                throw new ArgumentException("Ciphertext too short to contain IV and encrypted data.");
            }

            using (Aes aes = Aes.Create())
            {
                aes.Key = Key;  // Set the same key used for encryption
                aes.IV = IV;    // Set the same IV used for encryption

                using (var decryptor = aes.CreateDecryptor(aes.Key, aes.IV))
                {
                    using (var ms = new MemoryStream(fullCipher))
                    {
                        using (var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                        {
                            using (var sr = new StreamReader(cs))
                            {
                                return sr.ReadToEnd();  // Return the decrypted password
                            }
                        }
                    }
                }
            }
        }
    }
}
