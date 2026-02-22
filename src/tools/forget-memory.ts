import { BaseGridClient } from '../client/basegrid-client.js';

export async function handleForgetMemory(client: BaseGridClient, args: any) {
    const memoryId = args.memoryId;

    try {
        await client.forgetMemory(memoryId);
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Memory ${memoryId} deleted.`
                }
            ]
        };
    } catch (error: any) {
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Failed to delete memory ${memoryId}: ${error.message}`
                }
            ],
            isError: true
        };
    }
}
