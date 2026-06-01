export interface Category {
    id: number;
    name: string;
}

export interface Question {
    id: number;
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    estimatedTime: number;
    isActive: boolean;
    categories: Category[];
    solutions: QuestionSolution[];
}

export interface QuestionSolution {
    language: string;
    solutionCode: string;
}