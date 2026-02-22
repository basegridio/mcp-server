import { Memory, SearchResult, StoreMemoryInput, RecallMemoriesInput, ListMemoriesInput } from '../types.js';

export class BaseGridClient {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string, baseUrl: string = 'https://api.basegrid.io') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'X-BaseGrid-Source': 'mcp-server/1.1.0',
            ...options.headers,
        };

        try {
            const response = await fetch(url, { ...options, headers });

            if (!response.ok) {
                let errorMessage = `Request failed: ${response.status} ${response.statusText}`;
                try {
                    const errorBody = await response.json();
                    if (errorBody.error) {
                        errorMessage = errorBody.error;
                    }
                } catch (e) {
                    // Ignore JSON parse error
                }
                throw new Error(errorMessage);
            }

            // Handle 204 No Content
            if (response.status === 204) {
                return {} as T;
            }

            return await response.json() as T;
        } catch (error: any) {
            // Enhance error message if it's a fetch error (e.g. network issue)
            if (error.cause) {
                throw new Error(`BaseGrid API connection failed: ${error.message}`);
            }
            throw error;
        }
    }

    private mapMemory(apiMemory: any): Memory {
        return {
            id: apiMemory.id,
            agentId: apiMemory.agent_id,
            content: apiMemory.content,
            metadata: apiMemory.metadata || {},
            importance: apiMemory.importance,
            createdAt: apiMemory.created_at,
            accessedAt: apiMemory.accessed_at
        };
    }

    private mapSearchResult(apiResult: any): SearchResult {
        return {
            ...this.mapMemory(apiResult),
            similarity: apiResult.similarity,
            keyword_score: apiResult.keyword_score,
            combined_score: apiResult.combined_score
        };
    }

    async storeMemory(input: StoreMemoryInput): Promise<Memory> {
        const { content, agentId = 'personal', metadata = {}, importance } = input;

        const response = await this.request<{ data: any }>('/v1/memories', {
            method: 'POST',
            body: JSON.stringify({
                agentId,
                content,
                metadata,
                importance
            })
        });

        return this.mapMemory(response.data);
    }

    async recallMemories(input: RecallMemoriesInput): Promise<SearchResult[]> {
        const { query, agentId = 'personal', limit = 5 } = input;

        const response = await this.request<{ results: any[] }>('/v1/memories/search', {
            method: 'POST',
            body: JSON.stringify({
                agentId,
                query,
                limit
            })
        });

        return response.results.map(r => this.mapSearchResult(r));
    }

    async forgetMemory(memoryId: string): Promise<{ deleted: boolean; id: string }> {
        return this.request<{ deleted: boolean; id: string }>(`/v1/memories/${memoryId}`, {
            method: 'DELETE'
        });
    }

    async listMemories(input: ListMemoriesInput): Promise<Memory[]> {
        const { agentId = 'personal', limit = 10 } = input;

        // Using the endpoint found in SDK: /v1/agents/:agentId/memories
        const params = new URLSearchParams();
        params.set('limit', limit.toString());

        const response = await this.request<{ memories: any[] }>(`/v1/agents/${agentId}/memories?${params.toString()}`);
        return response.memories.map(m => this.mapMemory(m));
    }
}
