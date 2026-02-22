export interface Memory {
    id: string;
    agentId: string;
    content: string;
    metadata: Record<string, any>;
    importance: number;
    createdAt: string;
    accessedAt?: string;
}

export interface SearchResult extends Memory {
    similarity?: number;
    keyword_score?: number;
    combined_score?: number;
}

export interface StoreMemoryInput {
    content: string;
    agentId?: string;
    metadata?: Record<string, any>;
    importance?: number;
}

export interface RecallMemoriesInput {
    query: string;
    agentId?: string;
    limit?: number;
}

export interface ForgetMemoryInput {
    memoryId: string;
}

export interface ListMemoriesInput {
    agentId?: string;
    limit?: number;
}
