import { BaseGridClient } from '../client/basegrid-client.js';
import { RecallMemoriesInput } from '../types.js';

export async function handleRecallMemories(client: BaseGridClient, args: any) {
    try {
        const input: RecallMemoriesInput = {
            query: args.query,
            agentId: args.agentId,
            limit: args.limit
        };

        const results = await client.recallMemories(input);

        if (!results || results.length === 0) {
            return {
                content: [
                    {
                        type: "text" as const,
                        text: `No memories found for "${input.query}".`
                    }
                ]
            };
        }

        const formattedResults = results.map((m, i) => {
            const score = m.combined_score || m.similarity || 0;
            const date = new Date(m.createdAt).toLocaleDateString();
            return `${i + 1}. [Score: ${score.toFixed(2)}] "${m.content}" (stored ${date}, ID: ${m.id})`;
        }).join('\n');

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Found ${results.length} memories for "${input.query}":\n\n${formattedResults}`
                }
            ]
        };
    } catch (error: any) {
        if (error.message && error.message.includes('Memory limit exceeded')) {
            return {
                content: [
                    {
                        type: "text" as const,
                        text: `⚠️ MEMORY LIMIT EXCEEDED\n\nYour free tier limit of 500 memories has been reached. Search is paused.\n\nTo resume:\n1. Upgrade to Pro: https://basegrid.io/mcp\n2. Or delete old memories: Use the 'forget_memory' tool.`
                    }
                ],
                isError: true
            };
        }

        return {
            content: [
                {
                    type: "text" as const,
                    text: `Failed to recall memories: ${error.message}`
                }
            ],
            isError: true
        };
    }
}
