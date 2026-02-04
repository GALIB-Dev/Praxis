# SkillsMatcher Frontend - Setup & Deployment Guide

## 📦 Project Overview

**SkillsMatcher** is a modern, responsive Next.js frontend application that enables:
- Workers to upload videos/images and get AI-powered skill extraction
- Employers to discover candidates and post jobs
- Intelligent skill-to-job matching using AI analysis

## ✅ What's Included

### Pages
- ✅ Home page with hero section and role-based CTAs
- ✅ Worker signup/login
- ✅ Employer signup/login
- ✅ Worker upload interface (video/image)
- ✅ Worker dashboard (extracted skills + job matches)
- ✅ Employer candidates discovery
- ✅ Employer job management (post/edit/view)

### Components
- ✅ Reusable UI components (Button, Card, Input, Alert, FileUpload, Spinner)
- ✅ Header with responsive navigation
- ✅ Footer with links
- ✅ Form validation and error handling

### Features
- ✅ React Context for state management
- ✅ Axios API integration with interceptors
- ✅ TypeScript support
- ✅ Tailwind CSS styling
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Authentication flow
- ✅ Error handling and user feedback
- ✅ Loading states

### Configuration
- ✅ ESLint for code quality
- ✅ TypeScript configuration
- ✅ Environment variables support
- ✅ Middleware for route protection

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17 or later
- npm or yarn

### Installation

1. **Navigate to project directory**:
```bash
cd "c:\Users\moham\Downloads\Praxis\Praxis"
```

2. **Install dependencies** (already done):
```bash
npm install
```

3. **Configure environment**:
   - `.env.local` already created
   - Update `NEXT_PUBLIC_API_BASE_URL` if backend runs on different URL

4. **Start development server**:
```bash
npm run dev
```

5. **Open in browser**:
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - You should see the home page with CTAs

## 📁 Project Structure

```
praxis/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Home page
│   │   ├── layout.tsx         # Root layout + AppProvider
│   │   ├── globals.css        # Global styles
│   │   ├── signup/            # Signup page
│   │   ├── login/             # Login page
│   │   ├── upload/            # Worker upload
│   │   ├── dashboard/         # Worker dashboard
│   │   └── employer/          # Employer pages
│   │       ├── candidates/
│   │       └── jobs/
│   ├── components/            # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ui/               # UI components
│   ├── context/              # State management
│   │   └── AppContext.tsx
│   ├── services/             # API service
│   │   └── api.ts
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   ├── constants/            # App constants
│   │   └── index.ts
│   ├── utils/                # Helper functions
│   │   └── helpers.ts
│   └── middleware.ts         # Route protection
├── public/                   # Static assets
├── .env.local               # Environment variables
├── .eslintrc.json          # ESLint config
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # Tailwind config
├── package.json            # Dependencies
├── next.config.ts          # Next.js config
├── README.md               # Project README
├── DEVELOPMENT.md          # Development guide
└── CONFIG.md              # Configuration guide
```

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000

# Production
npm run build           # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint --fix      # Auto-fix linting issues
```

## 🎨 UI/UX Highlights

### Design System
- **Colors**: Primary (Blue), Secondary (Green), Accent (Orange)
- **Spacing**: Consistent use of Tailwind spacing scale
- **Typography**: Clear hierarchy with responsive sizing
- **Components**: Modular, reusable, with consistent styling

### User Experience
- Clean, intuitive interface
- Mobile-first responsive design
- Clear call-to-action buttons
- Helpful error messages
- Loading indicators for async operations
- Form validation with feedback
- Smooth transitions and interactions

## 🔐 Authentication

### Flow
1. User visits home page
2. Clicks "Sign Up" (Worker or Employer)
3. Enters credentials and selects role
4. Backend validates and returns JWT token
5. Token stored in localStorage
6. Automatically included in API requests
7. Redirects to appropriate dashboard

### Protected Routes
- `/dashboard` - Workers only
- `/upload` - Workers only
- `/employer/candidates` - Employers only
- `/employer/jobs` - Employers only

## 📤 File Upload

### Supported
- **Videos**: MP4, WebM, MOV (max 50MB)
- **Images**: PNG, JPG, GIF (max 50MB)

### Process
1. User selects file
2. Frontend validates size and type
3. File uploaded with user ID
4. Backend processes and extracts skills
5. Results shown on worker dashboard

## 🌐 API Integration

### Base URL
- Development: `http://localhost:5000/api`
- Production: Configure in `.env.local`

### Key Endpoints
- Authentication: `/auth/login`, `/auth/signup`
- Upload: `/upload/video`, `/upload/image`
- Skills: `/skills/:userId`, `/skills/extract`
- Jobs: `/jobs/matches/:userId`
- Employer: `/employer/candidates`, `/employer/jobs`

### Error Handling
- Network errors display user-friendly messages
- 401 errors redirect to login
- Form validation shows field-specific errors
- Alert components for notifications

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Features
- Hamburger menu navigation
- Touch-friendly button sizes
- Stacked layouts
- Optimized font sizes

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on push
# Set environment variables in Vercel dashboard
```

### Traditional Hosting
```bash
# Build
npm run build

# Start
npm start

# Or use process manager
pm2 start npm --name "praxis" -- start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_ENV=production
```

## 🛠️ Development Workflow

### Creating New Features

1. **Create a new page**:
```bash
mkdir -p src/app/new-feature
touch src/app/new-feature/page.tsx
```

2. **Create components**:
```bash
touch src/components/NewComponent.tsx
```

3. **Update types if needed**:
```typescript
// Add types to src/types/index.ts
```

4. **Add API calls**:
```typescript
// Add to src/services/api.ts
```

5. **Test and deploy**:
```bash
npm run lint
npm run build
npm run dev
```

## 📚 Documentation

- **README.md** - Project overview and tech stack
- **DEVELOPMENT.md** - Development guide and examples
- **CONFIG.md** - Configuration and environment setup
- Code comments throughout for clarity

## 🐛 Troubleshooting

### Common Issues

**API connection failed**
- Check backend is running on correct port
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Check CORS configuration on backend

**Page not loading**
- Check network tab in DevTools
- Look for TypeScript errors
- Clear Next.js cache: `rm -rf .next`

**Styles not applying**
- Ensure Tailwind CSS is imported
- Check class names are correct
- Rebuild: `npm run build`

**Authentication not working**
- Clear localStorage: `localStorage.clear()`
- Check backend returns token
- Verify token is included in API requests

## 💡 Best Practices

- ✅ Always use TypeScript types
- ✅ Keep components small and focused
- ✅ Use React Context for shared state
- ✅ Implement proper error handling
- ✅ Validate user input
- ✅ Use semantic HTML
- ✅ Optimize images and files
- ✅ Test on multiple devices
- ✅ Use meaningful variable names
- ✅ Comment complex logic

## 🔒 Security

- JWT tokens for authentication
- HTTP-only cookie support (if configured)
- Input validation on frontend
- CORS protection
- XSS prevention with React
- CSRF tokens (if backend implements)

## 📊 Performance

- Next.js server-side rendering
- Code splitting and lazy loading
- Image optimization
- CSS optimization with Tailwind
- Minimal bundle size
- Fast page loads

## 👥 Team Collaboration

- TypeScript for type safety
- ESLint for code quality
- Consistent file structure
- Clear naming conventions
- Comprehensive documentation
- Reusable components

## 📞 Support

For issues:
1. Check documentation (README, DEVELOPMENT.md, CONFIG.md)
2. Review error messages
3. Check browser console (F12)
4. Check Network tab for API errors
5. Review backend logs

## 🎯 Next Steps

1. **Start development server**: `npm run dev`
2. **Test homepage**: Visit http://localhost:3000
3. **Test signup**: Create test accounts
4. **Test upload**: Upload sample video/image
5. **Customize colors/branding** in `tailwind.config.ts`
6. **Deploy** when ready

## 📖 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios](https://axios-http.com)
- [TypeScript](https://www.typescriptlang.org)

---

**Project Status**: ✅ Ready for development

**Last Updated**: February 4, 2026

**Tech Stack**: Next.js 15 | React 18 | TypeScript | Tailwind CSS | Axios
