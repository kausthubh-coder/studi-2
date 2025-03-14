# Studi - AI Chatbot Application

A powerful AI chatbot application built with Next.js, Tailwind CSS, Convex, OpenAI, and Clerk, featuring a clean, minimal design.

## Features

- 🤖 AI-powered chatbot using OpenAI's GPT models
- 🔒 Secure authentication with Clerk
- 💾 Real-time database with Convex
- 🎨 Beautiful UI with minimal, clean design
- 📱 Responsive design for all devices
- 💬 Multi-chat support with conversation history
- 📊 Usage tracking and token management
- ✨ Micro-interactions and animations using Framer Motion
- 🔄 Automatic chat naming based on conversation content
- 🎯 Direct chat creation from dashboard

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Convex for database and serverless functions
- **Authentication**: Clerk for user management
- **AI**: OpenAI GPT-3.5/GPT-4 for chat completions
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion for micro-interactions
- **State Management**: React hooks and Convex queries

## Design System

Studi features a clean, consistent design system:

- White backgrounds with black accents for a clean, readable interface
- Purposeful animations that enhance user experience
- Semantic use of color and typography
- Accessible components with proper contrast
- Responsive layouts for all device sizes

For detailed design documentation, see [UI Design System](./docs/ui-design.md).

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Convex account
- Clerk account
- OpenAI API key

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_openai_api_key
```

You'll also need to add the OpenAI API key to your Convex dashboard:

1. Navigate to your Convex dashboard
2. Go to "Settings" > "Environment Variables"
3. Add `OPENAI_API_KEY` with your OpenAI key

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/studi.git
cd studi
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Initialize and start Convex

```bash
npx convex dev
```

## Project Structure

- `/src/app` - Next.js application pages
- `/src/app/components` - Reusable UI components
- `/convex` - Convex backend code (schema, queries, mutations)
- `/docs` - Project documentation
- `/public` - Static assets

## Documentation

For more detailed documentation, see:

- [Frontend Architecture](./docs/architecture.md)
- [UI Design System](./docs/ui-design.md)
- [Convex Schema](./docs/convex-schema.md)
- [OpenAI Integration](./docs/openai-integration.md)
- [Authentication Flow](./docs/authentication-flow.md)

## Core Features

### Automatic Chat Naming

The application automatically analyzes the first message in a new chat to generate a relevant title:
- Creates a more organized chat history
- Makes navigation between chats intuitive
- Users can still manually edit titles if desired

### Direct Chat Creation

Users can create new chats directly from:
- The dashboard's header button
- The empty state prompt
- The chat list's "New Chat" button

### Interactive Message Experience

- Copy button for saving responses
- Like button for providing feedback
- Smart emoji detection and rendering
- Clean, readable message formatting

## Deployment

### Frontend Deployment

You can deploy the Next.js frontend to Vercel:

```bash
npm run build
```

Then follow the Vercel deployment process.

### Backend Deployment

Deploy your Convex backend:

```bash
npx convex deploy
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Convex](https://www.convex.dev/)
- [OpenAI](https://openai.com/)
- [Clerk](https://clerk.dev/)
- [Framer Motion](https://www.framer.com/motion/)
