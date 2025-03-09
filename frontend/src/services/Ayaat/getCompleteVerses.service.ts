import { AyaTranslationWithIds } from "../../interfaces/ReviewBody";
import { ErrorResponse } from "../../interfaces/service/error/error";
import { request } from "../../utils/api/Request"

export interface AyahCompleteData {
    suraNo: number;
    ayaNo: number;
    translations: AyaTranslationWithIds[];
    tags: {ar: string; en: string; id: number}[],
    verses: {word: string; PoS_tags: string; Stem_pattern: string; wordUndiacritizedNoHamza: string; id: number}[],
}

export const getCompleteVerses = async (surahAyaList: {suraNo: number; ayaNo: number}[]) => {
    return await request.post({
        url: '/v1/ayat/ayah-list',
        data: { surahAyaList },
        showToast: false,
    }) as ErrorResponse & { result: AyahCompleteData[] }
}