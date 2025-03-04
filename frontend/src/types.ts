export interface Option {
    id: number;
    text: string;
    votes: number;
}

export interface Poll {
    id: number;
    question: string;
    options: Option[];
    createdAt: string;
}