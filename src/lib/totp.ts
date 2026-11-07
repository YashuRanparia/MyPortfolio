import { generateSecret, generateURI, verifySync } from 'otplib';
import QRCode from 'qrcode';

export const newSecret = () => generateSecret();
export const checkCode = (secret: string, token: string) => verifySync({ secret, token: token.replace(/\s/g, '') }).valid;
export async function qrFor(email: string, secret: string) {
  return QRCode.toDataURL(generateURI({ issuer: 'Constellation', label: email, secret }));
}
