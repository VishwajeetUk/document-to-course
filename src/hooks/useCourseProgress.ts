import { useState, useEffect, useCallback } from 'react';
import { Course, CourseProgress, QuizResult } from '../types';

export interface CourseProgressStats {
  totalLessons: number;
  completedLessons: number;
  percentComplete: number;
  allLessonsCompleted: boolean;
  totalQuizzes: number;
  passedQuizzes: number;
  allQuizzesPassed: boolean;
  isEligibleForCertificate: boolean;
}

const STORAGE_KEY_PROGRESS = 'courseforge_progress_v1';
const STORAGE_KEY_LEARNER = 'courseforge_learner_name_v1';

export function useCourseProgress(courses: Course[]) {
  const [userProgress, setUserProgress] = useState<Record<string, CourseProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {};
  });

  const [learnerName, setLearnerNameState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEARNER);
      if (saved && saved.trim()) return saved;
    } catch {
      // ignore
    }
    return 'Alex Morgan';
  });

  // Persist userProgress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(userProgress));
    } catch {
      // ignore
    }
  }, [userProgress]);

  // Persist learnerName to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LEARNER, learnerName);
    } catch {
      // ignore
    }
  }, [learnerName]);

  const setLearnerName = useCallback((name: string) => {
    setLearnerNameState(name);
  }, []);

  const toggleLessonComplete = useCallback((courseId: string, lessonId: string) => {
    setUserProgress(prev => {
      const existing = prev[courseId] || {
        courseId,
        completedLessonIds: [],
        quizResults: {},
        enrolledAt: new Date().toISOString()
      };

      const completed = new Set(existing.completedLessonIds);
      if (completed.has(lessonId)) {
        completed.delete(lessonId);
      } else {
        completed.add(lessonId);
      }

      return {
        ...prev,
        [courseId]: {
          ...existing,
          completedLessonIds: Array.from(completed)
        }
      };
    });
  }, []);

  const markLessonComplete = useCallback((courseId: string, lessonId: string) => {
    setUserProgress(prev => {
      const existing = prev[courseId] || {
        courseId,
        completedLessonIds: [],
        quizResults: {},
        enrolledAt: new Date().toISOString()
      };

      if (existing.completedLessonIds.includes(lessonId)) {
        return prev;
      }

      return {
        ...prev,
        [courseId]: {
          ...existing,
          completedLessonIds: [...existing.completedLessonIds, lessonId]
        }
      };
    });
  }, []);

  const saveQuizResult = useCallback((
    courseId: string,
    quizId: string,
    score: number,
    correctCount: number,
    total: number
  ) => {
    setUserProgress(prev => {
      const existing = prev[courseId] || {
        courseId,
        completedLessonIds: [],
        quizResults: {},
        enrolledAt: new Date().toISOString()
      };

      const quizResult: QuizResult = {
        quizId,
        score,
        correctCount,
        totalQuestions: total,
        passed: score >= 70,
        attemptedAt: new Date().toISOString()
      };

      return {
        ...prev,
        [courseId]: {
          ...existing,
          quizResults: {
            ...existing.quizResults,
            [quizId]: quizResult
          }
        }
      };
    });
  }, []);

  const resetCourseProgress = useCallback((courseId: string) => {
    setUserProgress(prev => {
      const updated = { ...prev };
      delete updated[courseId];
      return updated;
    });
  }, []);

  const unlockAllForDemo = useCallback((courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const allLessonIds: string[] = [];
    const simulatedQuizResults: Record<string, QuizResult> = {};

    course.modules.forEach(mod => {
      mod.lessons.forEach(l => allLessonIds.push(l.id));
      if (mod.quiz) {
        simulatedQuizResults[mod.quiz.id] = {
          quizId: mod.quiz.id,
          score: 100,
          correctCount: mod.quiz.questions.length,
          totalQuestions: mod.quiz.questions.length,
          passed: true,
          attemptedAt: new Date().toISOString()
        };
      }
    });

    setUserProgress(prev => ({
      ...prev,
      [courseId]: {
        courseId,
        completedLessonIds: allLessonIds,
        quizResults: simulatedQuizResults,
        enrolledAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      }
    }));
  }, [courses]);

  const getCourseProgressStats = useCallback((courseId: string): CourseProgressStats => {
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      return {
        totalLessons: 0,
        completedLessons: 0,
        percentComplete: 0,
        allLessonsCompleted: false,
        totalQuizzes: 0,
        passedQuizzes: 0,
        allQuizzesPassed: false,
        isEligibleForCertificate: false
      };
    }

    let totalLessons = 0;
    const allLessonIds: string[] = [];
    const allQuizIds: string[] = [];

    course.modules.forEach(mod => {
      totalLessons += mod.lessons.length;
      mod.lessons.forEach(l => allLessonIds.push(l.id));
      if (mod.quiz) {
        allQuizIds.push(mod.quiz.id);
      }
    });

    const progress = userProgress[courseId];
    const completedLessonIds = progress?.completedLessonIds || [];
    const completedLessons = completedLessonIds.filter(id => allLessonIds.includes(id)).length;

    let passedQuizzes = 0;
    allQuizIds.forEach(qId => {
      if (progress?.quizResults?.[qId]?.passed) {
        passedQuizzes++;
      }
    });

    const totalMilestones = totalLessons + allQuizIds.length;
    const currentMilestones = completedLessons + passedQuizzes;
    const percentComplete = totalMilestones > 0 
      ? Math.round((currentMilestones / totalMilestones) * 100) 
      : 0;

    const allLessonsCompleted = totalLessons > 0 && completedLessons >= totalLessons;
    const allQuizzesPassed = allQuizIds.length === 0 || passedQuizzes >= allQuizIds.length;
    const isEligibleForCertificate = allLessonsCompleted && allQuizzesPassed;

    return {
      totalLessons,
      completedLessons,
      percentComplete,
      allLessonsCompleted,
      totalQuizzes: allQuizIds.length,
      passedQuizzes,
      allQuizzesPassed,
      isEligibleForCertificate
    };
  }, [courses, userProgress]);

  return {
    userProgress,
    learnerName,
    setLearnerName,
    toggleLessonComplete,
    markLessonComplete,
    saveQuizResult,
    resetCourseProgress,
    unlockAllForDemo,
    getCourseProgressStats
  };
}
