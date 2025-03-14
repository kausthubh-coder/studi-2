# UI Design System & Chat Experience

## Overview

Canvas Manus implements a clean, minimal UI design inspired by Vercel's v0 interface while maintaining a distinct white background with black borders aesthetic. This document outlines the design principles, component styles, and interaction patterns used throughout the application.

## Design Principles

### 1. Visual Hierarchy

- **Primary Actions**: Black buttons with white text for high contrast
- **Secondary Actions**: Bordered buttons with black text
- **Tertiary Actions**: Text links and icon buttons
- **Information Hierarchy**: Clear typographic scale with proper heading levels

### 2. White Space & Rhythm

- Consistent spacing system using Tailwind's spacing scale
- Generous white space between sections to improve readability
- Controlled content density to prevent visual overwhelm

### 3. Typography

- Sans-serif typeface for optimal readability
- Font size scale: 0.75rem (xs) → 2rem (3xl)
- Proper line height: 1.5 for body text, 1.2 for headings
- Limited use of font weights: 400 (normal), 500 (medium), 600 (semibold)

### 4. Color System

- **Primary**: Black (#000000)
- **Background**: White (#FFFFFF)
- **Borders**: Black at different opacity levels (100%, 80%, 60%)
- **Text**: Black for maximum readability
- **Accents**: Grayscale palette for secondary elements
- **Status**: System colors for success, warning, error states

## Chat Experience

### Auto-Naming Chats

The application automatically names chats based on the first message content:

1. User sends first message in a new chat
2. System extracts key topics from message content
3. Chat title is automatically updated to reflect the conversation subject
4. User can manually edit title if desired

### Chat Flow & Interactions

#### 1. Dashboard Entry Points

- Quick "New Chat" button in dashboard header
- Chat creation card in empty state
- Recent chats list with direct links

#### 2. Chat Interface Components

- **Header**: 
  - Simple bar with chat title and emoji
  - Back button to return to dashboard
  - Action buttons for editing and deleting
  
- **Message List**:
  - Clean, alternating message bubbles
  - User messages right-aligned with subtle background
  - AI responses left-aligned with white background and black border
  - Date separators with calendar icon for context
  - Automatic scrolling to latest message

- **Message Actions**:
  - Copy button appears on hover
  - Like button for positive feedback
  - Timestamp display

- **Input Area**:
  - Full-width textarea with auto-resize
  - Send button transforms between states
  - Example prompts for new users
  - Clear visual separation with top border

## Micro-Interactions

### Animations & Transitions

- **Button Animations**: 
  - Scale effect on hover/press using Framer Motion
  - Smooth state transitions for loading indicators

- **Message Appearance**:
  - Staggered fade-in for message groups
  - Subtle slide-in for new messages

- **Page Transitions**:
  - Consistent entrance animations for major views
  - Fade transitions between pages

## Responsive Design

- Mobile-first approach with progressive enhancement
- Breakpoint system:
  - Mobile: 0-639px
  - Tablet: 640px-1023px
  - Desktop: 1024px+
- Adaptive layouts that maintain visual hierarchy across devices
- Touch-friendly targets (minimum 44x44px) for mobile users

## Accessibility Considerations

- Sufficient color contrast (4.5:1 minimum)
- Keyboard navigation support
- Focus indicators for interactive elements
- Screen reader-friendly element structure
- ARIA attributes where appropriate

## Implementation Guidelines

When implementing UI components, developers should:

1. Use the existing Tailwind utility classes
2. Maintain consistent spacing using the scale
3. Follow the established component patterns
4. Test interactions across devices
5. Ensure responsive behavior works as expected

The design system is implemented throughout the codebase with example components like `ChatContainer`, `Message`, and `MessageList` serving as reference implementations. 