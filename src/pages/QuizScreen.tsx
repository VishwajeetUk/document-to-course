import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  ChevronLeft, 
  Sparkles,
  BookOpen,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { useQuiz } from '../hooks/useQuiz';

export const QuizScreen: React.FC = () => {
  const { courseId, quizId } = useParams<{ courseId: string; quizId: string }>();
  const navigate = useNavigate();
  const { courses, userProgress, saveQuizResult, getCourseProgressStats } = useCourse();

  const course = courses.find(c => c.id === courseId) || courses[0];
  const stats = getCourseProgressStats(course.id);

  // Find module that owns this quiz
  const currentModule = course.modules.find(m => m.quiz?.id === quizId);
  const quiz = currentModule?.quiz;

  const {
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
  } = useQuiz({
    quiz,
    courseId: course.id,
    onSaveQuizResult: saveQuizResult
  });

  if (!quiz || !currentQuestion) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-slate-400">Knowledge check not found.</p>
          <Link to={`/course/${course.id}`} className="mt-4 inline-block px-4 py-2 bg-indigo-600 rounded-lg text-white text-xs">
            Return to Overview
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = currentQuestion;

  // Find next module or navigation target
  const currentModIndex = course.modules.findIndex(m => m.id === currentModule?.id);
  const nextModule = currentModIndex >= 0 && currentModIndex < course.modules.length - 1 
    ? course.modules[currentModIndex + 1] 
    : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to={`/course/${course.id}`}
            className="text-xs font-semibold text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Course Overview</span>
          </Link>

          <span className="text-xs text-slate-500 font-medium">
            Module {currentModule?.moduleNumber} Assessment
          </span>
        </div>

        {/* Quiz Container Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Active Quiz vs Results View */}
          {!isQuizSubmitted ? (
            <div className="space-y-6">
              
              {/* Quiz Header & Stepper */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-indigo-400 uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="text-slate-400">
                    Passing standard: {quiz.passingScore}%
                  </span>
                </div>

                {/* Progress bar across questions */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-white mt-6 tracking-tight">
                  {currentQ.question}
                </h1>
              </div>

              {/* Options List */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((optionText, optIdx) => {
                  const isSelected = selectedOptionForCurrent === optIdx;
                  const isCorrect = optIdx === currentQ.correctAnswerIndex;
                  
                  let optionStyles = 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700 text-slate-200';
                  let badgeStyles = 'border-slate-700 text-slate-400';

                  if (hasAnsweredCurrent) {
                    if (isCorrect) {
                      optionStyles = 'border-emerald-500 bg-emerald-950/30 text-emerald-100 shadow-md shadow-emerald-950/20';
                      badgeStyles = 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionStyles = 'border-red-500 bg-red-950/30 text-red-100 shadow-md shadow-red-950/20';
                      badgeStyles = 'bg-red-500 text-white border-red-500 font-bold';
                    } else {
                      optionStyles = 'border-slate-800 bg-slate-950/30 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3.5 transition-all cursor-pointer ${optionStyles}`}
                    >
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-xs mt-0.5 ${badgeStyles}`}>
                        {hasAnsweredCurrent && isCorrect ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : hasAnsweredCurrent && isSelected && !isCorrect ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          String.fromCharCode(65 + optIdx)
                        )}
                      </div>

                      <div className="flex-1 font-medium leading-relaxed">
                        {optionText}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Instant Explanation Feedback Block */}
              {hasAnsweredCurrent && (
                <div className={`p-4 rounded-2xl border text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-200 ${
                  selectedOptionForCurrent === currentQ.correctAnswerIndex
                    ? 'bg-emerald-950/20 border-emerald-600/40 text-emerald-200'
                    : 'bg-indigo-950/30 border-indigo-600/40 text-indigo-200'
                }`}>
                  <div className="flex items-start gap-2.5">
                    {selectedOptionForCurrent === currentQ.correctAnswerIndex ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-bold mb-1">
                        {selectedOptionForCurrent === currentQ.correctAnswerIndex ? 'Correct!' : 'Explanation:'}
                      </h4>
                      <p className="opacity-90 leading-relaxed">{currentQ.explanation}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer action */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Select an answer to see instant feedback.
                </p>

                {hasAnsweredCurrent && (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
                  >
                    <span>
                      {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Score & Results'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* Results View */
            <div className="space-y-8 text-center sm:text-left">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                    isPassed 
                      ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' 
                      : 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                  }`}>
                    {isPassed ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isPassed 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {isPassed ? 'Passed' : 'Needs Review'}
                      </span>
                      <span className="text-xs text-slate-400">
                        Pass threshold: {quiz.passingScore}%
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5">
                      {isPassed ? 'Knowledge Check Complete!' : 'Good Effort! Keep Reviewing'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      You answered {correctCount} of {questions.length} questions correctly.
                    </p>
                  </div>
                </div>

                <div className="text-center sm:text-right px-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 min-w-[130px]">
                  <span className="text-[11px] text-slate-400 block font-medium">Final Score</span>
                  <span className={`text-3xl font-black ${isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {scorePercent}%
                  </span>
                </div>
              </div>

              {/* Questions Review Breakdown */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-200 text-left">Question Breakdown</h3>
                <div className="space-y-3">
                  {questions.map((q, qIdx) => {
                    const userAns = selectedAnswers[qIdx];
                    const isRight = userAns === q.correctAnswerIndex;

                    return (
                      <div 
                        key={q.id}
                        className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-left space-y-2 text-xs"
                      >
                        <div className="flex items-start gap-2">
                          {isRight ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          )}
                          <p className="font-semibold text-slate-200 flex-1">
                            {qIdx + 1}. {q.question}
                          </p>
                        </div>
                        <div className="pl-6 space-y-1 text-slate-400">
                          <p>
                            <span className="text-slate-500">Correct:</span>{' '}
                            <span className="text-emerald-300 font-medium">{q.options[q.correctAnswerIndex]}</span>
                          </p>
                          {!isRight && userAns !== undefined && (
                            <p>
                              <span className="text-slate-500">Your answer:</span>{' '}
                              <span className="text-red-300">{q.options[userAns]}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors w-full sm:w-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <Link
                    to={`/course/${course.id}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    Course Overview
                  </Link>

                  {nextModule ? (
                    <Link
                      to={`/course/${course.id}/lesson/${nextModule.lessons[0]?.id}`}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
                    >
                      <span>Proceed to Module {nextModule.moduleNumber}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      to={`/course/${course.id}/certificate`}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
                    >
                      <Award className="w-4 h-4" />
                      <span>View Course Certificate</span>
                    </Link>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
