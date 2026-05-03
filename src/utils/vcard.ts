import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { UserProfile } from '../types';

/**
 * Fold a single vCard property line to 75-octet segments as required by RFC 2426.
 * Each continuation segment is prefixed with CRLF + single space.
 */
function foldVCardLine(line: string): string {
  const CRLF = '\r\n';
  const MAX_FIRST = 75;
  const MAX_CONT  = 74; // 75 minus the leading space
  if (line.length <= MAX_FIRST) return line;
  let result = line.slice(0, MAX_FIRST);
  let pos = MAX_FIRST;
  while (pos < line.length) {
    result += CRLF + ' ' + line.slice(pos, pos + MAX_CONT);
    pos += MAX_CONT;
  }
  return result;
}

export function buildVCard(p: UserProfile): string {
  const CRLF = '\r\n';
  const contactEmail = p.networkingEmail?.trim() || p.ticketEmail;

  // Extract type + raw base64 from the stored data URI (e.g. "data:image/jpeg;base64,/9j/...")
  let photoLine = '';
  if (p.photo) {
    const match = p.photo.match(/^data:(image\/(\w+));base64,(.+)$/s);
    if (match) {
      const imgType = match[2].toUpperCase(); // 'JPEG' or 'PNG'
      const b64     = match[3].replace(/\s/g, ''); // strip any whitespace
      photoLine = foldVCardLine(`PHOTO;ENCODING=b;TYPE=${imgType}:${b64}`);
    }
  }

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    foldVCardLine(`FN:${p.firstName} ${p.lastName}`),
    foldVCardLine(`N:${p.lastName};${p.firstName};;;`),
    p.businessName ? foldVCardLine(`ORG:${p.businessName}`)              : '',
    p.jobTitle     ? foldVCardLine(`TITLE:${p.jobTitle}`)                : '',
    contactEmail   ? foldVCardLine(`EMAIL:${contactEmail}`)              : '',
    p.phone        ? foldVCardLine(`TEL;TYPE=CELL:${p.phone}`)           : '',
    p.website      ? foldVCardLine(`URL:${p.website}`)                   : '',
    p.instagram    ? foldVCardLine(`X-SOCIALPROFILE;type=instagram:${p.instagram.replace('@', '')}`) : '',
    photoLine,
    'END:VCARD',
  ].filter(Boolean);

  return lines.join(CRLF);
}

export async function shareVCard(p: UserProfile) {
  const vcf      = buildVCard(p);
  const fileName = `${p.firstName}_${p.lastName}_WOWCamp.vcf`.replace(/\s+/g, '_');
  const path     = `${FileSystem.cacheDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(path, vcf, { encoding: FileSystem.EncodingType.UTF8 });
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(path, { mimeType: 'text/vcard', UTI: 'public.vcard' });
  } else {
    Alert.alert('Sharing not available', 'Your device does not support the share sheet.');
  }
}
