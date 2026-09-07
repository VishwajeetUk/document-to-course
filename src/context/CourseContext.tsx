import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Course, CourseProgress, ProcessingStep, QuizResult } from '../types';
import { SAMPLE_COURSES } from '../data/sampleCourses';
import { extractTextFromFile, generateCourseFromDocument } from '../utils/documentCourseGenerator';
import { useCourseProgress, CourseProgressStats } from '../hooks/useCourseProgress';

export type { CourseProgressStats };

interface ProcessingStatus {
  isProcessing: boolean;
  step: ProcessingStep;
  stepIndex: number;
  progressPercent: number;
  fileName?: string;
  fileSize?: number;
  error?: string | null;
}

interface CourseContextType {
  courses: Course[];
  activeCourseId: string;
  activeCourse: Course;
  userProgress: Record<string, CourseProgress>;
  learnerName: string;
  processingStatus: ProcessingStatus;
  selectCourse: (courseId: string) => void;
  startDocumentProcessing: (file: File) => Promise<string>;
  cancelProcessing: () => void;
  toggleLessonComplete: (courseId: string, lessonId: string) => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  saveQuizResult: (courseId: string, quizId: string, score: number, correctCount: number, total: number) => void;
  resetCourseProgress: (courseId: string) => void;
  setLearnerName: (name: string) => void;
  unlockAllForDemo: (courseId: string) => void;
  getCourseProgressStats: (courseId: string) => CourseProgressStats;
}

const CourseContext = createContext<CourseContextType | null>(null);

const STORAGE_KEY_COURSES = 'courseforge_custom_courses_v1';
const STORAGE_KEY_ACTIVE_ID = 'courseforge_active_course_v1';

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load custom courses from storage or fallback to samples
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COURSES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge samples with saved custom courses
          const sampleIds = new Set(SAMPLE_COURSES.map(c => c.id));
          const custom = parsed.filter((c: Course) => !sampleIds.has(c.id));
          return [...SAMPLE_COURSES, ...custom];
        }
      }
    } catch {
      // ignore
    }
    return SAMPLE_COURSES;
  });

  const [activeCourseId, setActiveCourseId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return SAMPLE_COURSES[0].id;
  });

  // Consume extracted course progress and learner state logic
  const {
    userProgress,
    learnerName,
    setLearnerName,
    toggleLessonComplete,
    markLessonComplete,
    saveQuizResult,
    resetCourseProgress,
    unlockAllForDemo,
    getCourseProgressStats
  } = useCourseProgress(courses);

  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    step: 'idle',
    stepIndex: 0,
    progressPercent: 0,
    error: null
  });

  // Save courses and active ID to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
    } catch {
      // ignore
    }
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeCourseId);
    } catch {
      // ignore
    }
  }, [activeCourseId]);

  const selectCourse = useCallback((courseId: string) => {
    setActiveCourseId(courseId);
  }, []);

  const activeCourse = useMemo(() => {
    return courses.find(c => c.id === activeCourseId) || courses[0] || SAMPLE_COURSES[0];
  }, [courses, activeCourseId]);

  // Document transformation with staged mock animations
  const startDocumentProcessing = useCallback(async (file: File): Promise<string> => {
    // Validate file type
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => lowerName.endsWith(ext)) ||
      file.type.includes('pdf') ||
      file.type.includes('document') ||
      file.type.includes('text');

    if (!isValid) {
      setProcessingStatus({
        isProcessing: false,
        step: 'idle',
        stepIndex: 0,
        progressPercent: 0,
        fileName: file.name,
        fileSize: file.size,
        error: `Unsupported file type: "${file.name}". Please upload a PDF, DOCX, or TXT document.`
      });
      throw new Error('Invalid file format');
    }

    setProcessingStatus({
      isProcessing: true,
      step: 'reading_file',
      stepIndex: 1,
      progressPercent: 15,
      fileName: file.name,
      fileSize: file.size,
      error: null
    });

    // Stage 1: Extract text
    await new Promise(r => setTimeout(r, 700));
    const extractedText = await extractTextFromFile(file);

    setProcessingStatus(prev => ({
      ...prev,
      step: 'extracting_text',
      stepIndex: 2,
      progressPercent: 40
    }));

    // Stage 2: Detecting chapters & key topics
    await new Promise(r => setTimeout(r, 850));
    setProcessingStatus(prev => ({
      ...prev,
      step: 'detecting_chapters',
      stepIndex: 3,
      progressPercent: 65
    }));

    // Stage 3: Structuring modules & lessons
    await new Promise(r => setTimeout(r, 800));
    setProcessingStatus(prev => ({
      ...prev,
      step: 'structuring_modules',
      stepIndex: 4,
      progressPercent: 85
    }));

    // Stage 4: Generating quizzes & knowledge checks
    await new Promise(r => setTimeout(r, 750));
    setProcessingStatus(prev => ({
      ...prev,
      step: 'generating_quizzes',
      stepIndex: 5,
      progressPercent: 100
    }));

    await new Promise(r => setTimeout(r, 450));

    // Generate course object
    const newCourse = generateCourseFromDocument(file, extractedText);

    setCourses(prev => [newCourse, ...prev]);
    setActiveCourseId(newCourse.id);

    setProcessingStatus({
      isProcessing: false,
      step: 'ready',
      stepIndex: 5,
      progressPercent: 100,
      fileName: file.name,
      fileSize: file.size,
      error: null
    });

    return newCourse.id;
  }, []);

  const cancelProcessing = useCallback(() => {
    setProcessingStatus({
      isProcessing: false,
      step: 'idle',
      stepIndex: 0,
      progressPercent: 0,
      error: null
    });
  }, []);

  const value = {
    courses,
    activeCourseId,
    activeCourse,
    userProgress,
    learnerName,
    processingStatus,
    selectCourse,
    startDocumentProcessing,
    cancelProcessing,
    toggleLessonComplete,
    markLessonComplete,
    saveQuizResult,
    resetCourseProgress,
    setLearnerName,
    unlockAllForDemo,
    getCourseProgressStats
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourse = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
