# Contributing to BaseGrid MCP Server

Thank you for your interest in contributing!

## How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run `npm run build` — it must pass
5. Submit a pull request with a clear description

## Development Setup

```bash
git clone https://github.com/basegrid-io/mcp-server.git
cd mcp-server
npm install
cp .env.example .env  # Add your BASEGRID_API_KEY
npm run dev
```

## What We Welcome

- Bug fixes
- Improved error messages
- New MCP client compatibility (new AI tools)
- Documentation improvements
- Performance improvements

## What We Don't Accept

- Changes to the core API communication logic without discussion
- New dependencies without prior issue discussion
- Breaking changes to existing tool signatures

## Questions?

Open an issue or email hello@basegrid.io
