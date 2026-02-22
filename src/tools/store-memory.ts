import { BaseGridClient } from '../client/basegrid-client.js';
import { StoreMemoryInput } from '../types.js';

export async function handleStoreMemory(client: BaseGridClient, args: any) {
    try {
        const input: StoreMemoryInput = {
            content: args.content,
            agentId: args.agentId,
            metadata: args.metadata,
            importance: args.importance
        };

        const memory = await client.storeMemory(input);

        return {
            content: [
                {
                    type: "text" as const,
                    text: `✓ Stored memory: "${memory.content.substring(0, 80)}${memory.content.length > 80 ? '...' : ''}"\nID: ${memory.id}`
                }
            ]
        };
    } catch (error: any) {
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Failed to store memory: ${error.message}`
                }
            ],
            isError: true
        };
    }
}
