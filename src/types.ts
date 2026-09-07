export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  passingScore: number; // percentage, e.g. 70
  questions: QuizQuestion[];
}

export interface LessonCallout {
  type: 'tip' | 'warning' | 'takeaway' | 'deep-dive';
  title: string;
  content: string;
}

export interface LessonContentSection {
  heading: string;
  body: string[];
  callout?: LessonCallout;
  codeSnippet?: {
    language: string;
    code: string;
    caption?: string;
  };
  keyPoints?: string[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  durationMinutes: number;
  summary: string;
  sections: LessonContentSection[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  moduleNumber: number;
  title: string;
  description: string;
  estimatedTimeMinutes: number;
  lessons: Lesson[];
  quiz?: Quiz;
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  sourceFileName?: string;
  totalEstimatedMinutes: number;
  modules: CourseModule[];
  createdAt: string;
}

export interface QuizResult {
  quizId: string;
  score: number; // percentage 0-100
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  attemptedAt: string;
}

export interface CourseProgress {
  courseId: string;
  completedLessonIds: string[];
  quizResults: Record<string, QuizResult>; // key is quizId
  enrolledAt: string;
  completedAt?: string;
}

export interface UserProfile {
  learnerName: string;
}

export type ProcessingStep = 
  | 'idle'
  | 'reading_file'
  | 'extracting_text'
  | 'detecting_chapters'
  | 'structuring_modules'
  | 'generating_quizzes'
  | 'ready';
