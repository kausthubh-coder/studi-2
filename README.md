# Studi - AI-Powered Canvas LMS Assistant

Studi is an AI-powered chat application that helps students interact with their Canvas Learning Management System (LMS) data. It provides a conversational interface to access course information, assignments, announcements, and more.

## Features

- **AI Chat Interface**: Conversational UI powered by OpenAI's GPT models
- **Canvas LMS Integration**: Connect your Canvas account to access your educational data
- **Function Calling**: AI can retrieve specific Canvas data when needed
- **Responsive Design**: Works on desktop and mobile devices
- **User Authentication**: Secure login with Clerk authentication
- **Structured Logging**: Comprehensive logging system for debugging and monitoring

### Canvas API Features

Studi integrates extensively with the Canvas LMS API to provide access to:

- Courses, modules, and content
- Files and resources
- Assignments and grades
- Discussions and announcements
- User information and enrollments
- Calendar events and deadlines
- Quizzes and surveys

All these features are accessible through natural language conversations with the AI assistant.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Convex for database and serverless functions
- **Authentication**: Clerk
- **AI**: OpenAI API with function calling
- **Canvas Integration**: Canvas LMS REST API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Convex account
- Clerk account
- OpenAI API key
- Canvas LMS account (for full functionality)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/studi.git
   cd studi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Initialize Convex:
   ```bash
   npx convex dev
   ```

### Canvas Integration Setup

1. Go to your Canvas LMS account
2. Generate a new API token in your profile settings
3. In the Studi application, navigate to Settings
4. Enter your Canvas URL and API token
5. Enable Canvas integration

## Project Structure

```
studi/
├── src/                  # Source code
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript types
├── convex/               # Convex backend
│   ├── schema.ts         # Database schema
│   ├── users.ts          # User-related functions
│   ├── messages.ts       # Message-related functions
│   ├── canvas.ts         # Canvas API integration
│   └── openai.ts         # OpenAI integration
├── public/               # Static assets
└── docs/                 # Documentation
    ├── architecture.md   # Architecture overview
    ├── logger.md         # Logger documentation
    └── canvas-api.md     # Canvas API documentation
```

## Documentation

For more detailed documentation, see the `docs` directory:

- [Architecture Overview](docs/architecture.md)
- [Logger Documentation](docs/logger.md)
- [Canvas API Documentation](docs/canvas-api.md)

## Canvas API Integration

The Canvas API integration is one of the core features of Studi. It allows the chatbot to:

1. **Retrieve Course Information**: Access course syllabi, modules, and materials
2. **Track Assignments**: View upcoming assignments, due dates, and submission status
3. **Access Grades**: Check grades for assignments and overall course performance
4. **View Announcements**: Read course announcements and updates
5. **Participate in Discussions**: Access discussion forums and threads
6. **Manage Files**: Browse and download course files and resources
7. **Check Calendar Events**: View upcoming events and deadlines

For developers, the Canvas API functions are organized in `convex/canvas.ts` and follow a consistent pattern with standardized error handling and response formatting.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for their powerful language models
- Canvas LMS for their API
- Convex for their real-time backend platform
- Clerk for authentication services
