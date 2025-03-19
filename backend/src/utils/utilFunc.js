const generateRandomString = (length = 13) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const isObjectEmpty = (object) => Object.keys(object).length === 0;

const detectLanguage = (text) => {
  if (/[a-zA-Z]/.test(text)) {
    return 'English';
  }
  if (/[\u0600-\u06FF]/.test(text)) {
    return 'Arabic';
  }
  return 'Unknown';
};

/**
 * [U+064A, U+06CC, etc] → U+0649
 * EXAMPLE => [موسی,موسي] to موسى
 */
const fixLastYaa = (text) =>
  text
    .split(' ')
    .map((word) => word.replace(/(.*)[يیىﻯﻰ]/, '$1ى'))
    .join(' ');

/**
 * "آ" with "ا"
 * U+0622 → U+0627
 * EXAMPLE => "الآفلين" and "الافلين"
 */
const fixAlif = (text) =>
  text
    .split(' ')
    .map((word) => word.replace(/آ/g, 'ا'))
    .join(' ');

/**
 * "ی" (U+06CC) → "ي" (U+064A)
 * EXAMPLE => "اسماعیل" and "اسماعيل"
 */
const fixInnerYaas = (text) =>
  text
    .split(' ')
    .map((word) => word.replace(/ی/g, 'ي'))
    .join(' ');

// ی
const fixInnerYaaz = (text) =>
  text
    .split(' ')
    .map((word) => word.replace(/ی/g, 'ي'))
    .join(' ');

// إأٱآ => ا
const fixAllALifVariants = (text) =>
  text
    .split(' ')
    .map((word) =>
      word
        .normalize('NFC')
        .replace(/[\u064B-\u0652]/g, '')
        .replace(/[إأٱآ]/g, 'ا')
    )
    .join(' ');

const getUnicodeValues = (str) => {
  return [...str].map((char) => `U+${char.codePointAt(0).toString(16).toUpperCase()}`).join(' ');
};

module.exports = {
  generateRandomString,
  isObjectEmpty,
  detectLanguage,
  fixLastYaa,
  fixAlif,
  fixInnerYaas,
  getUnicodeValues,
  fixInnerYaaz,
  fixAllALifVariants,
};
