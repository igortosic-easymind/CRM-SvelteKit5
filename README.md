# Easymindstudio CRM Demo - SvelteKit

A modern CRM system built with SvelteKit 5, featuring client management, task tracking, and calendar scheduling.

## Features

- 👥 Client Management
- ✅ Task Tracking
- 📅 Calendar Integration
- 🔐 User Authentication
- 📱 Responsive Design
- 🎨 Modern UI with Tailwind CSS

## Documentation

Project documentation is available in the [/docs](/docs) directory:

### Architecture

- [State Management](/docs/architecture/state-management.md)
- [Types System](/docs/architecture/types.md)
- [API Integration](/docs/architecture/api-integration.md)
- [Component Structure](/docs/architecture/component-structure.md)

### Development Guides

- [Development Setup](/docs/guides/development-setup.md)
- [Coding Standards](/docs/guides/coding-standards.md)
- [Deployment Guide](/docs/guides/deployment.md)

### Features

- [Authentication](/docs/features/authentication.md)
- [Client Management](/docs/features/client-management.md)
- [Calendar](/docs/features/calendar.md)

## Tech Stack

- **Framework:** SvelteKit 5
- **Styling:** Tailwind CSS, shadcn-svelte
- **State Management:** Svelte Stores
- **Authentication:** JWT
- **Database:** PostgreSQL
- **UI Components:** Svelte, bits-ui
- **Charts:** Chart.js (or similar)
- **Icons:** Lucide Svelte
- **Package Manager:** pnpm

## Demo

Try out CRM: [Live Demo](https://crm-demo-easymind-svelte.vercel.app)

Demo credentials:
- Username: `testuser`
- Password: `demo1234`

### Note
The backend project is hosted on a free instance web service on Render. As a result, it may be idle sometimes, causing the initial load to be slow. However, once the application is loaded, it should work normally.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/igortosic-easymind/CRM-SvelteKit5.git
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:
```env
API_URL="https://crm-demo-aufh.onrender.com/api"
```

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Project Structure

```
project-root/
├── src/
│   ├── routes/          # SvelteKit routes (pages)
│   ├── lib/
│   │   ├── components/  # Svelte components
│   │   ├── store/       # Svelte stores for state management
│   │   ├── types/       # TypeScript types
│   │   ├── server/      # Server-side utilities
│   │   └── hooks/       # Custom hooks
│   ├── app.html         # App template
│   └── app.css          # Global styles
├── docs/                # Documentation
├── static/              # Static files
├── tests/               # Test files
└── e2e/                 # End-to-end tests
```

## Development

This project uses SvelteKit 5 with the latest features and follows modern development practices:

- **File-based routing** with SvelteKit's app router
- **Server-side rendering** and **static site generation**
- **Type-safe** development with TypeScript
- **Component-based architecture** with Svelte 5
- **Reactive state management** with Svelte stores

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm dev --open       # Start dev server and open browser

# Building
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint and Prettier
pnpm format           # Format code with Prettier
pnpm check            # Type check with svelte-check

# Testing
pnpm test             # Run all tests
pnpm test:unit        # Run unit tests
pnpm test:e2e         # Run end-to-end tests
```

### Learn More

To learn more about the technologies used:

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte 5 Documentation](https://svelte.dev/docs/svelte/overview)
- [Svelte Stores Documentation](https://svelte.dev/docs/svelte/svelte-store)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn-svelte Documentation](https://www.shadcn-svelte.com)
- [bits-ui Documentation](https://bits-ui.com)

## Deployment

The project can be deployed on various platforms. For deployment instructions, check out:

- [Deployment Guide](/docs/guides/deployment.md)
- [SvelteKit Deployment Documentation](https://kit.svelte.dev/docs/adapters)

### Deployment Platforms

- **Vercel** (recommended)
- **Netlify**
- **Cloudflare Pages**
- **Node.js servers**

## Contributing

Please read our [Contributing Guide](/docs/guides/contributing.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

Last Updated: January 27, 2025
