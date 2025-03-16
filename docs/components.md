# Studi Components Documentation

This document provides detailed information about the components used in the Studi frontend application.

## Animation Components

### `<FadeIn>`

A component that animates children by fading them in and sliding them up slightly.

**Props:**
- `children`: ReactNode (required) - The content to be animated
- `delay`: number (default: 0) - Delay before animation starts in seconds
- `duration`: number (default: 0.6) - Duration of animation in seconds
- `className`: string (default: '') - Additional CSS classes

**Usage:**
```tsx
<FadeIn delay={0.2} className="my-4">
  <p>This content will fade in</p>
</FadeIn>
```

### `<FloatingElement>`

A component that creates a floating animation for its children.

**Props:**
- `children`: ReactNode (required) - The content to be animated
- `amount`: number (default: 10) - The distance in pixels the element should float
- `duration`: number (default: 4) - Duration of one animation cycle in seconds
- `className`: string (default: '') - Additional CSS classes

**Usage:**
```tsx
<FloatingElement amount={15} duration={3}>
  <div className="icon">🚀</div>
</FloatingElement>
```

### `<GradientText>`

A component that applies a gradient effect to text.

**Props:**
- `children`: ReactNode (required) - The text content
- `className`: string (default: '') - Additional CSS classes

**Usage:**
```tsx
<GradientText className="text-2xl font-bold">
  Gradient Text
</GradientText>
```

### `<Reveal>`

A component that reveals its children with a directional animation.

**Props:**
- `children`: ReactNode (required) - The content to be revealed
- `direction`: 'left' | 'right' | 'up' | 'down' (default: 'up') - Direction of reveal
- `delay`: number (default: 0) - Delay before animation starts in seconds
- `className`: string (default: '') - Additional CSS classes

**Usage:**
```tsx
<Reveal direction="left" delay={0.3}>
  <div className="card">Content slides in from left</div>
</Reveal>
```

### `<Typewriter>`

A component that animates text character by character like a typewriter.

**Props:**
- `text`: string (required) - The text to be typed
- `delay`: number (default: 0) - Delay before animation starts in seconds
- `className`: string (default: '') - Additional CSS classes

**Usage:**
```tsx
<Typewriter text="Hello, world!" className="font-mono" />
```

## Layout Components

### `<Navigation>`

The main navigation header component with responsive mobile menu.

**Features:**
- Logo and branding
- Desktop and mobile navigation
- Scroll-aware background (transparent to solid)
- Sign up and login buttons

### `<Footer>`

The site footer component with links and information.

**Features:**
- Logo and company description
- Navigation links grouped by category
- Social media links
- Copyright and legal links

### Dashboard Layout

**File**: `frontend/src/app/(dashboard)/layout.tsx`

The main layout for authenticated users, featuring:

- A responsive sidebar with navigation and chat history
- Mobile menu toggle for small screens
- User profile section with Clerk integration
- Main content area with proper spacing and padding
- Animation effects using Framer Motion

```tsx
<motion.aside 
  className="fixed md:relative md:flex md:flex-col border-r border-black w-64 h-screen bg-white z-40"
  initial={{ x: -10, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {/* Sidebar Content */}
</motion.aside>
```

## Section Components

### `<Hero>`

The main hero section that appears at the top of the landing page.

**Features:**
- Main headline with typewriter effect
- Description text
- CTA buttons
- Visual elements and background patterns
- Social proof section

### `<Features>`

Showcases the main features of the product.

**Features:**
- Interactive feature selector
- Visual feature representation
- Custom icons for each feature

### `<Testimonials>`

Displays customer testimonials in a grid layout.

**Features:**
- Quote cards with attribution
- Grid layout optimized for different screen sizes

### `<Pricing>`

Displays pricing plans with feature comparison.

**Features:**
- Toggle between monthly and yearly billing
- Highlighted popular plan
- Feature lists with checkmarks
- CTA buttons for each plan

### `<CTA>`

Call to action section to prompt user sign-up.

**Features:**
- Prominent headline and description
- Primary and secondary CTA buttons
- Visual elements and background

## Dashboard Components

### Dashboard Page

**File**: `frontend/src/app/(dashboard)/dashboard/page.tsx`

The main dashboard page showing:

- Welcome section with user's profile
- Recent chats in a card grid
- Account information card
- Usage statistics
- Staggered animations for a pleasant loading experience

## Chat Components

### Chat Container

**File**: `frontend/src/app/components/chat/ChatContainer.tsx`

Container for the chat interface with:

- Header with chat title and actions
- Message list area
- Message input at the bottom
- Loading states and animations

### Message List

**File**: `frontend/src/app/components/chat/MessageList.tsx`

Displays a scrollable list of messages with:

- Auto-scrolling to the bottom for new messages
- Date separators between messages from different days
- Empty state when there are no messages
- Scroll-to-bottom button when not at the bottom

```tsx
<motion.div 
  variants={container}
  initial="hidden"
  animate="show"
  className="flex flex-col space-y-4 p-4"
>
  {/* Message items */}
</motion.div>
```

### Message Component

**File**: `frontend/src/app/components/chat/Message.tsx`

Individual message component with:

- Different styles for user vs. AI messages
- Avatar display
- Timestamp formatting
- Copy-to-clipboard functionality
- Like/reaction button
- Emoji rendering in message content

```tsx
<div className="flex items-start gap-3 p-5 rounded-lg hover:bg-gray-50 transition-colors">
  {/* Avatar */}
  <div className="message-content">
    {/* Message text */}
    {/* Actions (copy, like) */}
  </div>
  {/* Timestamp */}
</div>
```

### Message Input

**File**: `frontend/src/app/components/chat/MessageInput.tsx`

Input for typing new messages:

- Auto-resizing textarea
- Emoji picker/quick emojis
- Send button with animation
- Focus states and keyboard shortcuts
- Loading state during message sending

```tsx
<form className="border-t border-black p-4 bg-white">
  <div className="relative">
    {/* Textarea */}
    {/* Emoji picker */}
    {/* Send button */}
  </div>
</form>
```

### Chat List

**File**: `frontend/src/app/components/chat/ChatList.tsx`

List of chat conversations:

- New chat button
- List of existing chats
- Delete functionality
- Active state for current chat
- Empty state when no chats exist

## Authentication Components

### Auth Check

**File**: `frontend/src/app/components/auth/auth-check.tsx`

Handles authentication verification:

- Checks if user is signed in
- Creates user in database if they don't exist
- Redirects unauthenticated users

## Utility Components

### `<Logo>` and `<LogoText>`

Components for displaying the Studi logo.

**Props:**
- `size`: number (default: 32) - Size of the logo in pixels
- `className`: string (default: '') - Additional CSS classes

**Usage:**
```tsx
<Logo size={40} className="my-4" />
<LogoText className="text-lg" />
```

### Navigation

**File**: `frontend/src/app/components/navigation.tsx`

Main navigation component:

- Desktop and mobile navigation
- Logo and branding
- Navigation links
- Authentication buttons

## Common Design Patterns

### Button Styles

Buttons follow these common patterns:

1. **Primary Action**:
   ```tsx
   <button className="py-2 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
     Button Text
   </button>
   ```

2. **Secondary Action**:
   ```tsx
   <button className="py-2 px-4 border border-black text-black font-medium rounded-lg hover:bg-gray-50 transition-colors">
     Button Text
   </button>
   ```

3. **Icon Button**:
   ```tsx
   <button className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
     <IconComponent className="h-5 w-5" />
   </button>
   ```

### Card Patterns

Cards use these common patterns:

```tsx
<div className="bg-white shadow-sm border border-black rounded-lg p-6">
  <h2 className="text-xl font-semibold mb-4">Card Title</h2>
  <div className="card-content">
    {/* Content */}
  </div>
</div>
```

### Animation Patterns

Common animation patterns using Framer Motion:

1. **Staggered Children**:
   ```tsx
   const container = {
     hidden: { opacity: 0 },
     show: {
       opacity: 1,
       transition: {
         staggerChildren: 0.1
       }
     }
   };
   
   const item = {
     hidden: { opacity: 0, y: 20 },
     show: { opacity: 1, y: 0 }
   };
   ```

2. **Hover/Tap Effects**:
   ```tsx
   <motion.div
     whileHover={{ scale: 1.02 }}
     whileTap={{ scale: 0.98 }}
   >
     {/* Content */}
   </motion.div>
   ```

## Responsive Behavior

Components follow these responsive patterns:

- Mobile-first design with progressive enhancement
- Sidebar collapses to a mobile menu on smaller screens
- Grid layouts change from single column to multiple columns
- Font sizes and spacing adjust based on screen size
- Touch targets expand on mobile devices

## Accessibility Features

Components include these accessibility features:

- Semantic HTML structure
- Proper ARIA attributes
- Focus management
- Keyboard navigation
- Color contrast compliance
- Screen reader support

## Theme Integration

Components work with the application theme:

- White background with black borders
- Black primary buttons with white text
- Gray secondary and background colors
- Consistent spacing and typography
- Smooth transitions and animations

## Component Customization

Most components support customization through:

1. **Props**: For behavior and content
2. **className**: For styling customization with Tailwind
3. **Children**: For content customization

## Extending Components

To extend existing components:

1. Import the component
2. Wrap it with additional functionality
3. Pass props through to the base component

Example:
```tsx
import { FadeIn } from './animations';

export function EnhancedFadeIn({ children, ...props }) {
  // Add custom logic here
  
  return (
    <FadeIn {...props}>
      {children}
    </FadeIn>
  );
}
```

## Landing Page Components

### `<Hero>`

The main hero section of the landing page that introduces Studi as an AI-powered study assistant for Canvas LMS.

**Features:**
- Animated background with network-like pattern
- Headline with typewriter effect
- Clear value proposition and description
- Call-to-action buttons for early access
- Interactive preview of the AI chat functionality
- Responsive design for all device sizes

**Key Elements:**
- Canvas integration emphasis
- Modern, clean design with blue accent colors
- Animated elements for visual interest

### `<Features>`

Showcases the key features of Studi with visual illustrations.

**Features:**
- Grid layout of feature cards
- Icon illustrations for each feature
- Animated reveal on scroll
- Responsive design that adjusts columns based on screen size

**Key Features Highlighted:**
- Canvas LMS Integration
- AI-Powered Study Assistance
- Smart Assignment Help
- Course Material Organization
- Personalized Study Plans
- Collaborative Learning

### `<Testimonials>`

Displays user testimonials to build trust and showcase real-world benefits.

**Features:**
- Carousel of testimonial cards
- User avatars and names
- Star ratings
- Responsive design
- Subtle animations on hover

**Design Elements:**
- Clean card design with subtle shadows
- Emphasis on student experiences with Canvas integration
- Diverse representation of users

### `<CTA>` (Call to Action)

Encourages visitors to sign up for early access.

**Features:**
- Eye-catching background with gradient
- Clear headline and subheadline
- Email input field
- Submit button
- Privacy policy link
- Responsive design

**Design Elements:**
- Contrasting colors to draw attention
- Simple form with clear instructions
- Focus on early access to create urgency

### `<Footer>`

The footer section containing links, information, and copyright notice.

**Features:**
- Logo and company description
- Organized link sections (Product, Resources, Company, Legal)
- Social media links
- Copyright information
- Responsive grid layout

**Design Elements:**
- Clean organization of links
- Subtle separation between sections
- Consistent with overall design language

### `<Navigation>`

The navigation bar for the landing page.

**Features:**
- Logo and beta badge
- Desktop navigation links
- Authentication buttons (Sign in, Get Early Access)
- Mobile-responsive menu with hamburger icon
- Scroll effect that changes background on scroll
- User button for authenticated users

**Design Elements:**
- Clean, minimal design
- Consistent with overall color scheme
- Smooth animations for mobile menu
- Clear visual hierarchy

``` 