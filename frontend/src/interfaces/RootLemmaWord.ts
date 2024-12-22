export interface RootLemmaWords {
    root: string;
    lemmas: { [lemma: string]: {word: string; count: string | number}[] }
}