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
}