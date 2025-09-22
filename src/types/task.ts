export interface Task {
    id: string;
    boardId: string;
    cardId: string;
    title: string;
    description?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}