// @ts-ignore
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// @ts-ignore
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { BaseGridClient } from "./client/basegrid-client.js";
import { handleStoreMemory } from "./tools/store-memory.js";
import { handleRecallMemories } from "./tools/recall-memories.js";
import { handleForgetMemory } from "./tools/forget-memory.js";
import { handleListMemories } from "./tools/list-memories.js";

// Initialize BaseGrid Client
const apiKey = process.env.BASEGRID_API_KEY || '';
const baseUrl = process.env.BASEGRID_API_URL;

if (!apiKey) {
    console.error("Warning: BASEGRID_API_KEY environment variable is not set.");
}

const client = new BaseGridClient(apiKey, baseUrl);

// Create MCP Server
const server = new McpServer({
    name: "@basegrid-io/mcp-server",
    version: "1.0.0",
});

// Register Tool: store_memory
server.registerTool(
    "store_memory",
    {
        description: "Store a new memory in BaseGrid",
        inputSchema: {
            content: z.string().describe("The memory content to store"),
            agentId: z.string().optional().describe("Agent/namespace identifier (default: 'personal')"),
            metadata: z.record(z.string(), z.any()).optional().describe("Optional metadata key-value pairs"),
            importance: z.number().min(0).max(1).optional().describe("Importance score 0-1 (default: 0.5)")
        } as any
    },
    async (args: any) => handleStoreMemory(client, args)
);

// Register Tool: recall_memories
server.registerTool(
    "recall_memories",
    {
        description: "Search and retrieve relevant memories",
        inputSchema: {
            query: z.string().describe("What to search for in memories"),
            agentId: z.string().optional().describe("Agent/namespace to search (default: 'personal')"),
            limit: z.number().min(1).max(20).optional().describe("Max results to return (default: 5, max: 20)")
        } as any
    },
    async (args: any) => handleRecallMemories(client, args)
);

// Register Tool: forget_memory
server.registerTool(
    "forget_memory",
    {
        description: "Delete a specific memory by ID",
        inputSchema: {
            memoryId: z.string().describe("The ID of the memory to delete")
        } as any
    },
    async (args: any) => handleForgetMemory(client, args)
);

// Register Tool: list_memories
server.registerTool(
    "list_memories",
    {
        description: "List recent memories for an agent",
        inputSchema: {
            agentId: z.string().optional().describe("Agent/namespace (default: 'personal')"),
            limit: z.number().min(1).max(50).optional().describe("Number of recent memories (default: 10, max: 50)")
        } as any
    },
    async (args: any) => handleListMemories(client, args)
);

// Retrieve the transport from the environment (default to stdio)
const transport = new StdioServerTransport();

async function main() {
    try {
        await server.connect(transport);
        console.error("BaseGrid MCP Server running on stdio");
    } catch (error) {
        console.error("Fatal error running BaseGrid MCP Server:", error);
        process.exit(1);
    }
}

main();
