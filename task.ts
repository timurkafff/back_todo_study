export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: Date;
    dueDate?: Date;
    deleted: boolean;
    order: number;
}
