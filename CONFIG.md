# Environment Configuration Guide

## Setup Instructions

### 1. Backend API Configuration

Create or update `.env.local` file in the project root:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Environment
NEXT_PUBLIC_ENV=development
```

### 2. Backend Requirements

Ensure your backend API is running and provides these endpoints:

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

#### File Upload
- `POST /upload/video` - Upload video file
- `POST /upload/image` - Upload image file

#### Skills
- `GET /skills/:userId` - Get extracted skills
- `POST /skills/extract` - Extract skills from content

#### Jobs
- `GET /jobs/matches/:userId` - Get job matches for worker
- `GET /jobs/:jobId` - Get job details

#### Employer Features
- `GET /employer/candidates/:employerId` - Get candidates
- `GET /employer/candidate/:candidateId` - Get candidate profile
- `GET /employer/jobs/:employerId` - Get employer's jobs
- `POST /employer/jobs/:employerId` - Post new job

#### User Profile
- `GET /users/:userId` - Get user profile
- `PUT /users/:userId` - Update user profile

### 3. Expected Response Format

All endpoints should return responses in this format:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

### 4. Authentication Response

Login/Signup should return:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "worker|employer"
    },
    "token": "jwt_token_here"
  }
}
```

### 5. Skills Extraction Response

```json
{
  "success": true,
  "data": {
    "skills": [
      {
        "name": "JavaScript",
        "confidence": 0.95
      }
    ]
  }
}
```

### 6. Job Matches Response

```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "id": "job_id",
        "title": "Senior Developer",
        "company": "Company Name",
        "description": "Job description...",
        "requiredSkills": ["JavaScript", "React"],
        "matchPercentage": 85
      }
    ]
  }
}
```

## Development Server

### Start Frontend
```bash
npm run dev
# Frontend: http://localhost:3000
```

### Backend Service Expected
- Backend API should be running on: `http://localhost:5000/api`
- Or configure the correct URL in `.env.local`

## CORS Configuration

Frontend communicates with backend, ensure CORS is enabled:

```javascript
// Backend example (Node.js/Express)
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## File Upload Configuration

### Maximum File Sizes
- Videos: 50MB
- Images: 50MB

Configure on backend accordingly.

### Supported Formats
- **Videos**: MP4, WebM, MOV
- **Images**: PNG, JPG, GIF

## Authentication Tokens

Tokens are stored in `localStorage` as:
- Key: `authToken`
- Value: JWT token from backend

## Error Handling

The frontend expects error responses in format:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Debugging

### Check API Connection
```javascript
// Open browser console
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
```

### Monitor Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform actions and check API requests
4. Check response status and data

## Production Configuration

For production deployment:

1. **Update .env.local to .env.production.local**:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_ENV=production
```

2. **Update API URL** to match your backend domain

3. **Enable HTTPS** on backend for secure communication

4. **Configure CORS** for production domain

## Troubleshooting

### API Not Responding
- [ ] Backend service is running
- [ ] Correct API URL in `.env.local`
- [ ] Firewall allows connection
- [ ] CORS is enabled on backend

### Authentication Failed
- [ ] User exists in database
- [ ] Password is correct
- [ ] Backend returns token in response

### File Upload Fails
- [ ] File size is under limit
- [ ] File format is supported
- [ ] Backend file upload endpoint works

### Skills Not Extracting
- [ ] Backend skill extraction service is available
- [ ] Content is valid (video/image)
- [ ] Backend returns correct response format

## Testing Credentials

For local development, create test accounts:

**Worker Account**
- Email: `worker@test.com`
- Password: `password123`

**Employer Account**
- Email: `employer@test.com`
- Password: `password123`

## API Rate Limiting

If implementing rate limiting on backend:
- Configure reasonable limits
- Return `429 Too Many Requests`
- Frontend will display error to user

## Security Considerations

- ✅ Use HTTPS in production
- ✅ Validate all inputs on backend
- ✅ Sanitize user uploads
- ✅ Use JWT with expiration
- ✅ Implement refresh tokens
- ✅ Use secure cookies if possible
- ✅ Implement rate limiting
- ✅ Log security events

## Performance Optimization

- Use image compression for uploads
- Implement pagination for large lists
- Cache frequently accessed data
- Use CDN for static assets
- Enable gzip compression on backend

## Monitoring

Implement logging to track:
- API errors and failures
- User authentication events
- File upload success/failure
- Skill extraction results
- API response times

## Contact & Support

For issues or questions:
1. Check DEVELOPMENT.md
2. Review error messages
3. Check browser console
4. Check backend logs
5. Submit issue with details
