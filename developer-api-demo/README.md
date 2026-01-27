# Developer API Demo

A Next.js application demonstrating a Developer API credentials management interface using MyOperator UI components.

## Features

- **Multi-channel API Management**: Support for Calling API and WhatsApp API
- **Secure Credentials Display**: Password masking with show/hide toggle
- **Copy to Clipboard**: One-click copy functionality for all credentials
- **Regenerate Credentials**: Modal confirmation for regenerating API keys
- **Revoke Access**: Safety modal for revoking API access
- **Toast Notifications**: User feedback for all actions
- **Responsive Design**: Mobile-friendly layout

## Components Used

This project uses the following components from the MyOperator UI library:

- **Button**: With variants (primary, outline, ghost, destructive)
- **Input**: For credential display
- **Badge**: For status indicators
- **Card**: For the main container
- **Dialog**: For modals (regenerate & revoke confirmations)
- **Toast**: For notifications

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
developer-api-demo/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with Toaster
│   │   ├── page.tsx         # Main Developer API page
│   │   └── globals.css      # Global styles & CSS variables
│   ├── components/
│   │   └── ui/              # UI components from MyOperator library
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── badge.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── toast.tsx
│   └── lib/
│       └── utils.ts         # Utility functions (cn)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Key Features Implemented

### 1. API Activation
- Click "Activate" button to generate credentials
- Smooth loading state with spinner
- Success toast notification

### 2. Credentials Management
- Collapsible credentials section with "Manage" button
- Masked sensitive fields (API Token, Secret Key)
- Show/hide toggle for password fields
- Copy to clipboard for all fields

### 3. Regenerate Credentials
- Warning modal with confirmation
- Updates timestamp after regeneration
- Toast notification on success

### 4. Revoke Access
- Destructive action modal with clear warnings
- Resets API to inactive state
- Success notification

### 5. Responsive Design
- Mobile-friendly stacked layout
- Tablet and desktop optimized grid layouts
- Touch-friendly buttons and interactions

## Design System

The application uses a consistent design system with:

- **Colors**: Teal primary (#14b8a6), neutral grays
- **Typography**: Inter font family
- **Spacing**: Consistent padding and margins
- **Border Radius**: Rounded corners for modern look
- **Shadows**: Subtle shadows for depth

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React hooks (useState)

## License

MIT
