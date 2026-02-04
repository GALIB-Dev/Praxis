# SkillsMatcher Frontend - Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Directory Structure

### `/src/app` - Next.js App Router Pages
- `page.tsx` - Home page with hero section and CTAs
- `layout.tsx` - Root layout with AppProvider wrapper
- `globals.css` - Global styles and Tailwind imports
- `signup/page.tsx` - User registration (Worker/Employer)
- `login/page.tsx` - User login
- `upload/page.tsx` - Worker content upload interface
- `dashboard/page.tsx` - Worker dashboard (skills + job matches)
- `employer/candidates/page.tsx` - Employer candidate discovery
- `employer/jobs/page.tsx` - Employer job management

### `/src/components` - Reusable React Components
- `Header.tsx` - Navigation bar with role-based menu
- `Footer.tsx` - Footer with links and copyright
- `ui/Button.tsx` - Customizable button component
- `ui/Card.tsx` - Card container component
- `ui/Input.tsx` - Form input with validation
- `ui/Alert.tsx` - Notification alerts (success/error/warning/info)
- `ui/FileUpload.tsx` - Drag-and-drop file upload
- `ui/LoadingSpinner.tsx` - Loading indicator

### `/src/context` - State Management
- `AppContext.tsx` - Global React Context for app state
  - User profile and authentication
  - Skills data
  - Job matches
  - Loading states
  - Error handling

### `/src/services` - API Integration
- `api.ts` - Axios instance with interceptors
  - Auth endpoints (login, signup)
  - Upload endpoints (video, image)
  - Skill extraction endpoints
  - Job matching endpoints
  - Employer endpoints
  - User profile endpoints

### `/src/types` - TypeScript Types
- `index.ts` - Type definitions for:
  - API responses
  - User models
  - Skill models
  - Job models
  - Candidate profiles
  - Form data

### `/src/utils` - Helper Functions
- `helpers.ts` - Utility functions:
  - String manipulation
  - File size formatting
  - Email/password validation
  - Date formatting
  - Local storage management
  - Number formatting

### `/src/constants` - Application Constants
- `index.ts` - Configuration constants:
  - API configuration
  - File upload limits
  - Error/success messages
  - Routes
  - Colors
  - Common skills list

## Development Workflow

### 1. Creating a New Page

```tsx
// src/app/new-page/page.tsx
"use client";

import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useApp } from "@/context/AppContext";

export default function NewPage() {
  const { user } = useApp();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page content */}
      </main>
      <Footer />
    </>
  );
}
```

### 2. Using the AppContext

```tsx
import { useApp } from "@/context/AppContext";

export default function MyComponent() {
  const { user, setUser, skills, loading, error, setError } = useApp();

  // Use context state and methods
}
```

### 3. Making API Calls

```tsx
import { apiService } from "@/services/api";
import { useApp } from "@/context/AppContext";

export default function MyComponent() {
  const { setLoading, setError } = useApp();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getJobMatches(userId);
      // Handle response
    } catch (err) {
      setError("Error message");
    } finally {
      setLoading(false);
    }
  };
}
```

### 4. Creating Reusable Components

```tsx
// src/components/MyComponent.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <Card>
      <h2>{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </Card>
  );
}
```

## Styling Guide

### Tailwind CSS Classes

- **Spacing**: `p-4`, `m-2`, `gap-6`, `mb-8`
- **Colors**: `text-primary`, `bg-secondary`, `text-white`
- **Sizing**: `w-full`, `h-screen`, `min-h-96`
- **Flexbox**: `flex`, `justify-between`, `items-center`
- **Grid**: `grid`, `grid-cols-2`, `md:grid-cols-3`
- **Responsive**: `md:`, `lg:`, `sm:` prefixes
- **Borders**: `border-2`, `rounded-lg`, `shadow-md`

### Custom Colors
- Primary (Blue): `text-primary`, `bg-primary`
- Secondary (Green): `text-secondary`, `bg-secondary`
- Accent (Orange): `text-accent`, `bg-accent`
- Dark: `text-dark`, `bg-dark`
- Light: `text-light`, `bg-light`

## Component Props Reference

### Button
```tsx
<Button
  variant="primary" // primary, secondary, outline, danger
  size="lg"         // sm, md, lg
  isLoading={false}
  disabled={false}
  onClick={handler}
>
  Click Me
</Button>
```

### Input
```tsx
<Input
  label="Field Label"
  name="fieldName"
  type="text"
  value={value}
  onChange={handler}
  error={errorMessage}
  placeholder="Placeholder text"
  helperText="Helper text"
/>
```

### FileUpload
```tsx
<FileUpload
  label="Upload File"
  accept="video/*"
  onFileSelect={handler}
  isLoading={false}
  helpText="Supported formats: MP4, WebM"
  maxSize={50} // MB
/>
```

### Alert
```tsx
<Alert
  type="success" // success, error, warning, info
  message="Your message"
  onClose={closeHandler}
/>
```

## Authentication Flow

1. **Signup**: User creates account with email, password, and role
2. **Login**: User credentials validated and token returned
3. **Token Storage**: Auth token stored in localStorage
4. **Auto-Include**: Token automatically added to API requests
5. **Token Expiry**: Unauthorized (401) responses redirect to login

## File Upload Flow

1. **Selection**: User selects video/image file
2. **Validation**: File size and type checked
3. **Upload**: File sent to backend
4. **Processing**: Backend processes and extracts skills
5. **Redirect**: User redirected to dashboard to view results

## Error Handling

```tsx
try {
  const response = await apiService.someCall(data);
  // Handle success
} catch (error: any) {
  const message = error.response?.data?.message || "Generic error";
  setError(message);
}
```

## Performance Tips

1. **Use Image Optimization**: Next.js Image component for images
2. **Code Splitting**: Dynamic imports for large components
3. **Memoization**: Use React.memo for expensive components
4. **Debouncing**: Debounce search/filter inputs
5. **Lazy Loading**: Implement pagination for large lists

## Debugging

### VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Thunder Client or REST Client

### Browser DevTools
- React DevTools for component inspection
- Network tab for API debugging
- Application tab for localStorage inspection

## Environment Variables

Create `.env.local` with:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_ENV=development
```

## Common Issues & Solutions

### 1. API Connection Failed
- Ensure backend is running
- Check `NEXT_PUBLIC_API_BASE_URL`
- Verify CORS configuration on backend

### 2. Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check token expiration
- Verify login response includes token

### 3. Styling Not Applied
- Ensure Tailwind CSS is imported in `globals.css`
- Check class names are correct
- Clear Next.js cache: `rm -rf .next`

### 4. Build Errors
- Check for TypeScript errors
- Verify all imports use correct paths
- Ensure @/* path alias is configured

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: description"

# Push to remote
git push origin feature/feature-name

# Create pull request
```

## Production Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy with `npm run build && npm start`

### Manual Deployment
```bash
npm run build
npm start
```

## Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Support

For questions or issues:
1. Check this guide
2. Search existing issues
3. Create new issue with details
