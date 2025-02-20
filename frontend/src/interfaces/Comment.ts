export interface Comment {
    id?: number | string;
    commentText: string;
    updatedAt?: string;
    createdAt?: string;
    username: string;
    userId: number;
    suraNo: number;
    ayaNo: number;
    tagId?: number;
    commentType: CommentType;
}

export enum CommentType {
    SUGGESTION = 'SUGGESTION',
    QUESTION = 'QUESTION',
    OTHER = 'OTHER',
}

export const COMMENT_TYPES = Object.values(CommentType);