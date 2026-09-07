# CourseForge — Document to Online Course

AI-powered platform that transforms an uploaded document into a structured, 
interactive online course with lessons, quizzes, progress tracking, and a 
certificate of completion.

## 🔗 Live Demo
https://document-to-course.vercel.app

## ✨ Features
- Drag-and-drop document upload (PDF, DOCX, TXT)
- AI-powered course generation with staged processing states
- Course overview with module/lesson list and progress indicators
- Lesson viewer with sidebar navigation, prev/next controls
- Interactive quizzes with instant feedback, scoring, and retry option
- Progress tracking persisted via localStorage
- Certificate of completion with shareable link

## 🛠 Tech Stack
- React + Vite
- TypeScript
- Tailwind CSS
- React Router

## 📁 Folder Structure

\`\`\`
src/
  components/   → Reusable UI pieces (e.g. Header)
  layouts/      → Shared layout wrapper (Header + main content)
  pages/        → Top-level screens (Upload, CourseOverview, LessonViewer, Quiz, Certificate)
  hooks/        → Custom hooks (useCourseProgress, useQuiz)
  context/      → Global course state (CourseContext)
  data/         → Sample course data
  utils/        → Helper functions (document parsing/generation logic)
\`\`\`

## 🚀 Running Locally
```bash
git clone https://github.com/VishwajeetUk/document-to-course.git
cd document-to-course
npm install
```
Add your API key to a `.env` file (see `.env.example`):

Get a free key from Google AI Studio
GEMINI_API_KEY=your_gemini_api_key_here
Then run:
```bash
npm run dev
```

## 💡 What I'd Improve With More Time
- Real document parsing/chunking for larger PDFs
- User accounts to save multiple courses
- More granular analytics on the progress dashboard
