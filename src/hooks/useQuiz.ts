import { useState } from 'react';
import { Quiz, QuizQuestion } from '../types';

export interface UseQuizOptions {
  quiz?: Quiz;
  courseId: string;
  onSaveQuizResult?: (
    courseId: string,
    quizId: string,
    score: number,
    correctCount: number,
    total: number
  ) => void;
}

export function useQuiz({ quiz, courseId, onSaveQuizResult }: UseQuizOptions) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const questions: QuizQuestion[] = quiz?.questions || [];
  const currentQuestion: QuizQuestion | undefined = questions[currentQuestionIndex];
  const selectedOptionForCurrent: number | undefined = selectedAnswers[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (hasAnsweredCurrent) return; // locked once answered

    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
    setHasAnsweredCurrent(true);
  };

  const handleNextQuestion = () => {
    if (!quiz) return;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setHasAnsweredCurrent(selectedAnswers[currentQuestionIndex + 1] !== undefined);
    } else {
      // Calculate score and submit
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswerIndex) {
          correct++;
        }
      });
      const score = Math.round((correct / questions.length) * 100);
      if (onSaveQuizResult) {
        onSaveQuizResult(courseId, quiz.id, score, correct, questions.length);
      }
      setIsQuizSubmitted(true);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setHasAnsweredCurrent(false);
    setIsQuizSubmitted(false);
  };

  // Calculate statistics
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctAnswerIndex) {
      correctCount++;
    }
  });
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const isPassed = quiz ? scorePercent >= quiz.passingScore : false;

  return {
    currentQuestionIndex,
    selectedAnswers,
    hasAnsweredCurrent,
    isQuizSubmitted,
    questions,
    currentQuestion,
    selectedOptionForCurrent,
    correctCount,
    scorePercent,
    isPassed,
    handleSelectOption,
    handleNextQuestion,
    handleRetake
  };
}
