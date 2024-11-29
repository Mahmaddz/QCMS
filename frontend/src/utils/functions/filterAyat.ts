import { FilterAyat } from "../../interfaces/FilterAyat.FN";

const normalizeArabic = (text: string) => {
    return text
        // Remove only specific diacritics
        .replace(/[\u064B-\u0652\u0670\u0653-\u065F]/g, '')  

        // Normalize Hamza forms
        .replace(/(إ|أ|ٱ|آ)/g, 'ا')   // Different forms of Alif
        .replace(/(ؤ|ء)/g, 'و')       // Replace Hamza on Waw with Waw
        .replace(/ئ/g, 'ي')           // Replace Hamza on Ya with Ya

        // Additional character normalizations for common variations
        .replace(/ة/g, 'ه')           // Replace Ta Marbuta with Ha
        .replace(/ى/g, 'ي')           // Replace Alif Maqsura with Ya
        .replace(/گ/g, 'ك')           // Normalize Persian Gaf to Arabic Kaf
        .replace(/چ/g, 'ج')           // Normalize Persian Che to Arabic Jeem
        .replace(/پ/g, 'ب')           // Normalize Persian Pe to Arabic Ba

        // Normalize any additional variations of Alif
        .replace(/ٰ/g, 'ا')           // Alif with Wasla or Madd

        // Additional normalization to retain letters
        .replace(/ر/g, 'ر')           // Ensure 'ر' remains unchanged
        .replace(/ب/g, 'ب')           // Ensure 'ب' remains unchanged
        .replace(/رب/g, 'رب')         // Ensure 'رب' remains unchanged

        // Replace Arabic punctuation marks with spaces
        .replace(/[؛،؟]/g, ' ')
        .trim();                      // Trim spaces
};


export const filterAyat: FilterAyat = (ayatWithDiacritics, toFilterAyatWithoutDiacritics) => {
    const ayatWithoutDiacritics = ayatWithDiacritics || normalizeArabic(ayatWithDiacritics);
    const normalizedToFilter = toFilterAyatWithoutDiacritics || normalizeArabic(toFilterAyatWithoutDiacritics);

    const ayatWithDiacriticsArr = ayatWithDiacritics.split(" ");
    const ayatWithoutDiacriticsArr = ayatWithoutDiacritics.split(" ");
    
    // Normalize ayatWithoutDiacriticsArr elements and log
    const normalizedAyatArr = ayatWithoutDiacriticsArr.map(e => normalizeArabic(e));

    const index = normalizedAyatArr.findIndex(e => e === normalizedToFilter);
    
    return index !== -1 ? ayatWithDiacriticsArr[index] : '';
}

// Test the function
// console.log('nofil => ', filterAyat('بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ', 'الرحۡمن'));
