# Praxis MVP - Production-Ready Skill Verification Platform

**Tagline:** Video → AI Skill Verification → Job Matching

A mobile-first web application for informal workers in Bangladesh to demonstrate skills via video and receive job recommendations.

---

## 🚀 Quick Start

### Frontend Setup

```bash
# Install dependencies
npm install

# Set environment variables
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF

# Run development server
npm run dev

# Open http://localhost:3000
```

### Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# API will be available at http://localhost:8000
# Docs: http://localhost:8000/docs
```

---

## 📱 Pages & Routes

### 1. `/login`
**Phone number entry screen**
- Clean, minimal design
- Phone input with +880 default
- One button: "এগিয়ে যান" (Continue)
- No OTP/password in MVP
- Stores userId in localStorage

### 2. `/start`
**Welcome & CTA**
- Tagline & subtitle in Bangla
- Video emoji
- Help text
- One CTA: "ভিডিও রেকর্ড করুন"
- Info cards with icons
- No scrolling required

### 3. `/record`
**Video recording interface**
- Live camera preview (portrait mode)
- Start/Stop/Retake buttons
- Max 30 seconds with visual timer
- Video preview before submit
- Compress before upload
- Submit → Processing page

**Features:**
- MediaRecorder API for browser capture
- Auto-stop at 30 seconds
- Video blob validation
- Error handling (camera access, network)

### 4. `/processing`
**AI processing simulation**
- Loading spinner
- Step-by-step progress:
  1. "📹 ভিডিও দেখা হচ্ছে"
  2. "🔍 দক্ষতা খুঁজা হচ্ছে"
  3. "💼 চাকরি মিলানো হচ্ছে"
- Polls backend every 2 seconds
- Auto-redirects to /skills when done
- Error handling for failures

### 5. `/skills`
**Verified skills display**
- User greeting ("Guest User" or name)
- "আপনার দক্ষতা" heading
- Skill cards:
  - Skill name
  - Level (শিখছি / মাঝারি / দক্ষ)
  - "✓ যাচাইকৃত" badge
  - Progress bar (visual confidence)
- "আপনার জন্য চাকরি" CTA button

### 6. `/jobs`
**Matched job listings**
- Job title
- Match percentage (%)
- Salary range (optional)
- "কেন এই চাকরি?" expandable explanation
- "আবেদন করুন" button (demo only)
- Empty state message

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (no header/footer in MVP)
│   ├── page.tsx            # Home redirect to /login
│   ├── globals.css         # Tailwind + custom styles
│   ├── login/
│   │   └── page.tsx        # Phone login form
│   ├── start/
│   │   └── page.tsx        # Welcome screen
│   ├── record/
│   │   └── page.tsx        # Video recording interface
│   ├── processing/
│   │   └── page.tsx        # Processing status page
│   ├── skills/
│   │   └── page.tsx        # Verified skills display
│   └── jobs/
│       └── page.tsx        # Job matches
├── components/
│   └── ui/
│       ├── Button.tsx      # Reusable button component
│       ├── Card.tsx        # Card component
│       ├── Input.tsx       # Input field component
│       ├── Alert.tsx       # Alert/error messages
│       └── LoadingSpinner.tsx
├── constants/
│   └── bangla.ts           # All Bangla text
├── services/
│   └── api.ts              # API service layer
├── types/
│   └── api.ts              # TypeScript interfaces
└── utils/
    └── video.ts            # Video compression & validation

backend/
├── main.py                 # FastAPI application
└── requirements.txt        # Python dependencies
```

---

## 🔌 API Contract

All APIs return JSON. Base URL: `http://localhost:8000`

### POST `/upload-video`
Upload video for skill extraction.

**Request:**
```
Content-Type: multipart/form-data

video: File
user_id: string
```

**Response:**
```json
{
  "processing_id": "uuid-here"
}
```

### GET `/processing-status?id=xxx`
Check processing status.

**Response:**
```json
{
  "status": "processing | done | failed"
}
```

### GET `/skills?id=xxx`
Get verified skills.

**Response:**
```json
{
  "user": "Guest User",
  "skills": [
    {
      "name": "ইট বসানো",
      "level": 3,
      "verified": true
    }
  ]
}
```

### GET `/jobs?id=xxx`
Get matched jobs.

**Response:**
```json
{
  "jobs": [
    {
      "title": "সাইট ফোরম্যান",
      "match": 85,
      "salary": "৳25,000–30,000",
      "reason": "ভিডিওতে সঠিক ইট বসানোর প্রমাণ পাওয়া গেছে"
    }
  ]
}
```

---

## 🎨 Design Principles

### Mobile-First
- One-hand usability
- Large touch targets (min 48px)
- Portrait-only layout
- Works on low-end Android devices
- Fast load times

### Low-Literacy Friendly
- Minimal text
- Large, clear buttons
- Icons + labels
- Short sentences in simple Bangla
- No technical jargon

### Bangla-First
- All UI text in Bangla
- No English labels
- Bengali phone numbers (+880)
- Bengali currency (৳)

### Accessibility
- High contrast colors
- Clear error messages
- No blame ("Try again" not "You failed")
- Descriptive button labels

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form (optional, currently using controlled inputs)
- Browser MediaRecorder API
- Fetch API (no axios)

**Backend:**
- FastAPI (Python)
- CORS middleware
- Async endpoints
- Mock ML processing (ready for real implementation)

**State Management:**
- localStorage (simple, no external deps)
- Could add Zustand for complex state

**Deployment:**
- Frontend: Vercel (automatic from GitHub)
- Backend: Cloud Run or Railway
- Environment variables via .env.local and secrets

---

## 📹 Video Processing

### Frontend Flow
1. User records video (max 30 seconds)
2. Client-side validation:
   - Size check (max 50MB)
   - Duration check
   - Blob validation
3. Optional compression (currently basic)
4. Upload as multipart/form-data
5. Store processing_id in localStorage

### Backend Flow
1. Receive video file
2. Save to temporary storage (or S3)
3. Queue for ML processing
4. Simulate 2-3 second processing
5. Extract skills (mock or real ML)
6. Match jobs (mock or real matching)
7. Return results via API

---

## 🔒 Security & Privacy

- No raw video storage in frontend
- No metadata in requests (strip before upload)
- No console logs in production
- CORS restricted to known origins
- Environment variables for API URLs
- No sensitive data in localStorage (only IDs)

---

## ✅ Testing Checklist

- [ ] Phone login on mobile
- [ ] Camera access permission flow
- [ ] Video recording (start, stop, retake)
- [ ] 30-second hard stop
- [ ] Video preview before submit
- [ ] Processing status polling
- [ ] Skills page display
- [ ] Jobs page display
- [ ] Error messages are friendly
- [ ] Works on low-end Android (4GB RAM)
- [ ] Bangla text renders correctly
- [ ] One-hand navigation possible

---

## 🚀 Deployment

### Vercel (Frontend)
```bash
git push origin main
# Auto-deploys from GitHub

# Set environment variables in Vercel dashboard:
NEXT_PUBLIC_API_URL=https://api.praxis.example.com
```

### Cloud Run (Backend)
```bash
cd backend

gcloud run deploy praxis-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Environment Setup
Create `.env.local` in project root:
```
NEXT_PUBLIC_API_URL=https://api.praxis.example.com
```

---

## 📝 Bangla Text References

All Bangla text is centralized in `src/constants/bangla.ts`:

```typescript
export const BANGLA_TEXT = {
  LOGIN_TITLE: "প্রাক্সিস",
  LOGIN_SUBTITLE: "আপনার দক্ষতা দেখান, চাকরি পান",
  // ... etc
}
```

Import in any component:
```typescript
import { BANGLA_TEXT } from "@/constants/bangla";
```

---

## 🤖 Future Enhancements

- Real ML model integration (Gemini, custom CNN)
- WhatsApp login (WhatsApp Business API)
- SMS notifications
- Employer dashboard
- Job application tracking
- Payment integration
- Offline recording (Service Worker)
- Video archiving & re-verification

---

## 📚 References

- [Next.js 14 Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Tailwind CSS](https://tailwindcss.com)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [CORS with FastAPI](https://fastapi.tiangolo.com/tutorial/cors/)

---

## 📄 License

MIT - Use freely for personal and commercial projects.

---

## 🙋 Support

For issues, questions, or contributions:
1. Check existing pages for similar solutions
2. Review API contract and responses
3. Test in mobile browser (Chrome DevTools)
4. Check Bangla text in constants file

---

**Built with ❤️ for Bangladesh's informal workforce.**
