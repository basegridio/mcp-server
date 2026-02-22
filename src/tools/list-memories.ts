import { BaseGridClient } from '../client/basegrid-client.js';
import { ListMemoriesInput } from '../types.js';

export async function handleListMemories(client: BaseGridClient, args: any) {
    try {
        const input: ListMemoriesInput = {
            agentId: args.agentId,
            limit: args.limit
        };

        const memories = await client.listMemories(input);

        if (!memories || memories.length === 0) {
            return {
                content: [
                    {
                        type: "text" as const,
                        text: `No memories found for agent "${input.agentId || 'personal'}".`
                    }
                ]
            };
        }

        const formattedMemories = memories.map((m) => {
            const date = new Date(m.createdAt).toLocaleDateString();
            return `- "${m.content.substring(0, 100)}${m.content.length > 100 ? '...' : ''}" (ID: ${m.id}, ${date})`;
        }).join('\n');

        return {
            content: [
                {
                    type: "text" as const,
                    text: `${memories.length} recent memories:\n\n${formattedMemories}`
                }
            ]
        };
    } catch (error: any) {
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Failed to list memories: ${error.message}`
                }
            ],
            isError: true
        };
    }
}
