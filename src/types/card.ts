export enum CardTitle {
    Icebox = "Icebox",
    Backlog = "Backlog",
    OnGoing = "On going",
    WaitingForReview = "Waiting for review",
    Done = "Done",
}
export interface Card {
    id: string;
    boardId: string;
    title: CardTitle;
    createdAt: string;
}
