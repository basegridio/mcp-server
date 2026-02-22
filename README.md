# BaseGrid MCP Server

[![npm version](https://badge.fury.io/js/%40basegrid-io%2Fmcp-server.svg)](https://www.npmjs.com/package/@basegrid-io/mcp-server)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

Give Claude Desktop, Cursor, Cline, and other MCP-compatible AI tools **persistent memory** powered by [BaseGrid](https://basegrid.io).

Your AI tools forget everything when you close them. BaseGrid MCP Server fixes that.

---

## What This Does

- **store_memory** — Save anything your AI should remember long-term
- **recall_memories** — Semantic search across all stored memories
- **list_memories** — View your recent memories
- **forget_memory** — Delete a specific memory by ID

All memories are stored securely on BaseGrid's infrastructure with sub-200ms retrieval.

---

## Quick Start

### Step 1 — Get your API key
Sign up free at **[basegrid.io/mcp](https://basegrid.io/mcp)** — no credit card required.

### Step 2 — Add to Claude Desktop

Open your Claude Desktop config (`claude_desktop_config.json`) and add:

```json
{
  "mcpServers": {
    "basegrid": {
      "command": "npx",
      "args": ["-y", "@basegrid-io/mcp-server"],
      "env": {
        "BASEGRID_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Config file locations:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

### Step 3 — Restart Claude Desktop

That's it. Claude now has persistent memory.

---

## Cursor Setup

Add to your Cursor MCP settings:

```json
{
  "basegrid": {
    "command": "npx",
    "args": ["-y", "@basegrid-io/mcp-server"],
    "env": {
      "BASEGRID_API_KEY": "your_api_key_here"
    }
  }
}
```

---

## Cline (VS Code) Setup

In Cline settings → MCP Servers → Add Server:

```json
{
  "basegrid": {
    "command": "npx",
    "args": ["-y", "@basegrid-io/mcp-server"],
    "env": {
      "BASEGRID_API_KEY": "your_api_key_here"
    }
  }
}
```

---

## Tools Reference

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `store_memory` | Save a memory | `content` (required), `agentId`, `metadata`, `importance` |
| `recall_memories` | Search memories | `query` (required), `agentId`, `limit` |
| `list_memories` | List recent memories | `agentId`, `limit` |
| `forget_memory` | Delete a memory | `memoryId` (required) |

---

## Pricing

| Plan | Memories | Search | Price |
|------|----------|--------|-------|
| Free Trial | 1,000 | Semantic | Free for 2 months |
| Free | 500 | Keyword | Free forever |
| MCP Pro | Unlimited | Semantic + Hybrid | $10/month |

Get your key at **[basegrid.io/mcp](https://basegrid.io/mcp)**

---

## Requirements

- Node.js 18+
- A BaseGrid API key ([get one free](https://basegrid.io/mcp))

---

## Contributing

We welcome contributions. Please open an issue first to discuss what you'd like to change.

## License

Apache 2.0 — see [LICENSE](LICENSE)

Built by [BaseGrid](https://basegrid.io) · [Docs](https://basegrid.io/docs) · [Discord](https://discord.gg/basegrid)
