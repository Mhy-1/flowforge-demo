# FlowForge Demo

A visual workflow automation builder demo. This is a standalone demo version that works without PostgreSQL or BullMQ - all data is stored in localStorage.

![FlowForge Demo](https://placehold.co/800x400/1a1a24/6366f1?text=FlowForge+Demo)

## Features

- **Visual Flow Editor**: Drag-and-drop interface built with React Flow
- **Custom Node Types**: Trigger, Action, Logic, Transform, and Output nodes
- **Node Configuration**: Right sidebar for editing node properties
- **Mock Execution**: Simulated flow execution with real-time logs
- **Import/Export**: Save and load flows as JSON files
- **localStorage Persistence**: All data saved in browser storage

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React Flow** - Visual flow editor
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **localStorage** - Data persistence

## Project Structure

```
flowforge-demo/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── editor/[id]/       # Flow editor
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── flow-editor/       # Editor components
│   │   │   ├── FlowCanvas.tsx
│   │   │   ├── FlowToolbar.tsx
│   │   │   ├── NodePalette.tsx
│   │   │   ├── NodeConfigPanel.tsx
│   │   │   ├── ExecutionPanel.tsx
│   │   │   ├── custom-nodes/  # Node components
│   │   │   └── types.ts
│   │   ├── DemoBadge.tsx
│   │   └── ImportFlowDialog.tsx
│   ├── data/
│   │   ├── mock-flows.ts      # Sample flows
│   │   ├── mock-runs.ts       # Sample execution history
│   │   └── node-definitions.ts
│   ├── lib/
│   │   ├── mock-db.ts         # localStorage CRUD
│   │   ├── mock-executor.ts   # Execution simulation
│   │   └── utils.ts
│   └── types/
│       └── index.ts           # TypeScript definitions
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Available Nodes

### Triggers
- **Manual Trigger** - Start workflow manually
- **Webhook Trigger** - Receive HTTP webhooks
- **Schedule Trigger** - Run on schedule

### Actions
- **HTTP Request** - Make API calls
- **Send Email** - Send emails via SMTP
- **Slack Message** - Send Slack notifications

### Logic
- **If/Else** - Conditional branching
- **Switch** - Multi-way branching
- **Loop** - Iterate over data

### Transform
- **Set Variable** - Set data values
- **JSON Transform** - Transform JSON data
- **Code** - Custom JavaScript

### Output
- **Debug Log** - Log execution data

## Demo Mode

This is a demonstration version with the following characteristics:

- **No Backend Required**: Everything runs client-side
- **localStorage Persistence**: Data persists until browser storage is cleared
- **Mock Execution**: Flow execution is simulated with realistic timing
- **Sample Data**: Pre-loaded with example workflows

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + S` | Save flow |
| `Delete/Backspace` | Delete selected node |
| `Escape` | Deselect all |

## License

MIT
