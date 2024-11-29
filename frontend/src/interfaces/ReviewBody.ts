export interface ReviewBodyProps {
    surah: string, 
    aya1: string, 
    aya2: string | undefined, 
    engTrans?: string,
    tags?: ({ en: string; ar: string; type: string } | { label: string })[];
    id?: number,
    role?: number,
    showTags: boolean
}