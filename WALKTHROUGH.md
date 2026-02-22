# BaseGrid MCP Server Build Walkthrough

## Overview
I have successfully built the `@basegrid-io/mcp-server` package. This server acts as a local proxy for the BaseGrid Cloud API, allowing AI tools like Claude Desktop to store and retrieve persistent memories.

## Implementation Details

### 1. Core Structure
- **Package Name:** `@basegrid-io/mcp-server`
- **Entry Point:** `bin/basegrid-mcp.js` (executable via `npx`)
- **Transport:** `stdio` (Standard Input/Output) as required by MCP clients.

### 2. Tools Implemented
| Tool Name | Description |
|-----------|-------------|
| `store_memory` | Stores a new memory with optional metadata and importance score. |
| `recall_memories` | Semantic search for memories relevant to a query. |
| `list_memories` | Lists recent memories for a specific agent. |
| `forget_memory` | Deletes a memory by ID. |

### 3. Client Implementation
- Used extensive error handling in `src/client/basegrid-client.ts` to manage API failures gracefully.
- Explicit type definitions in `src/types.ts` ensure type safety across the application.
- Implemented `create_at` field mapping to ensure dates are displayed correctly.

### 4. Build Process
- Addressed TypeScript compilation errors related to Zod schema complexity by:
    - Downgrading `zod` to `v3.24.1` for better compatibility.
    - Using explicit type casting (`as any`) for complex input schemas in `registerTool` to break infinite type instantiation loops.

## Verification
- **Build Success:** `npm run build` completed successfully.
- **Stdio Test:** Verified the server starts and responds to JSON-RPC requests.
- **Endpoint Verification:** Confirmed `GET /v1/agents/:agentId/memories` exists in API and matches the client implementation for `list_memories`.

### Manual Testing Commands
You can verify the server manually using these commands (replace API key with your own):

**1. Store Memory:**
```bash
export BASEGRID_API_KEY=your_key_here && \
echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"store_memory","arguments":{"content":"Test memory","importance":0.5}},"id":1}' | \
node dist/index.js
```

**2. Recall Memories:**
```bash
export BASEGRID_API_KEY=your_key_here && \
echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"recall_memories","arguments":{"query":"test memory"}},"id":2}' | \
node dist/index.js
```

**3. List Memories:**
```bash
export BASEGRID_API_KEY=your_key_here && \
echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"list_memories","arguments":{"agentId":"basegrid-demo"}},"id":3}' | \
node dist/index.js
```

## Setup Instructions

### For Local Development
1. Build the project:
   ```bash
   cd mcp-server
   npm install && npm run build
   ```
2. Configure Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "basegrid": {
         "command": "node",
         "args": ["/absolute/path/to/mcp-server/dist/index.js"],
         "env": {
           "BASEGRID_API_KEY": "your_api_key_here"
         }
       }
     }
   }
   ```

### For Production (after publishing)
```bash
npx -y @basegrid-io/mcp-server
```
