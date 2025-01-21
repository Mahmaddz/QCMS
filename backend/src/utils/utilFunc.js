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

module.exports = {
  generateRandomString,
  isObjectEmpty,
  detectLanguage,
};
