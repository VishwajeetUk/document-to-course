import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Award, 
  ChevronRight, 
  FileText, 
  HelpCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  RotateCcw,
  Check,
  Zap,
  Layers
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';

export const CourseOverviewScreen: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { 
    courses, 
    userProgress, 
    getCourseProgressStats, 
    selectCourse,
    resetCourseProgress,
    unlockAllForDemo 
  } = useCourse();

  // Find course or fallback
  const course = courses.find(c => c.id === courseId) || courses[0];
  const stats = getCourseProgressStats(course.id);
  const progress = userProgress[course.id];
  const completedLessonIds = progress?.completedLessonIds || [];

  // Collapsible modules state
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    course.modules.forEach(m => {
      initial[m.id] = true;
    });
    return initial;
  });

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  // Find resume target (first incomplete lesson)
  let resumeLessonId = course.modules[0]?.lessons[0]?.id;
  for (const mod of course.modules) {
    const firstIncomplete = mod.lessons.find(l => !completedLessonIds.includes(l.id));
    if (firstIncomplete) {
      resumeLessonId = firstIncomplete.id;
      break;
    }
  }

  const handleStartResume = () => {
    if (stats.isEligibleForCertificate) {
      navigate(`/course/${course.id}/certificate`);
    } else if (resumeLessonId) {
      navigate(`/course/${course.id}/lesson/${resumeLessonId}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Course Header Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-950 border border-indigo-800/80 text-indigo-300">
                  {course.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                  {course.level}
                </span>
                {course.sourceFileName && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-slate-800/70 text-slate-400">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span className="truncate max-w-[180px]">{course.sourceFileName}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {course.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-2 font-medium">
                {course.tagline}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed max-w-2xl">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-5 mt-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>{course.totalEstimatedMinutes} mins total duration</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>{stats.totalLessons} Lessons across {course.modules.length} Modules</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span>{stats.totalQuizzes} Knowledge Checks</span>
                </div>
              </div>
            </div>

            {/* Primary Action Button & Stats Card */}
            <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleStartResume}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
              >
                {stats.isEligibleForCertificate ? (
                  <>
                    <Award className="w-5 h-5 text-amber-300" />
                    <span>View Certificate</span>
                  </>
                ) : stats.completedLessons > 0 ? (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Resume Course</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Learning</span>
                  </>
                )}
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => unlockAllForDemo(course.id)}
                  className="px-3 py-1.5 text-[11px] font-medium text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800/60 rounded-xl transition-colors"
                  title="Unlock all lessons and quizzes for quick demonstration"
                >
                  ⚡ Unlock All (Demo)
                </button>
                {stats.completedLessons > 0 && (
                  <button
                    type="button"
                    onClick={() => resetCourseProgress(course.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                    title="Reset progress"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
            <div>
              <h2 className="text-sm font-semibold text-white">Course Completion Status</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete all lessons and pass every module quiz to unlock your graduation certificate.
              </p>
            </div>
            <div className="flex items-center gap-2 font-bold text-sm text-indigo-300">
              <span>{stats.percentComplete}% Complete</span>
            </div>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentComplete}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-center">
            <div className="p-2 rounded-xl bg-slate-950/50">
              <p className="text-[11px] text-slate-400">Lessons Completed</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {stats.completedLessons} / {stats.totalLessons}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/50">
              <p className="text-[11px] text-slate-400">Quizzes Passed</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {stats.passedQuizzes} / {stats.totalQuizzes}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/50">
              <p className="text-[11px] text-slate-400">Estimated Duration</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {course.totalEstimatedMinutes} Mins
              </p>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/50">
              <p className="text-[11px] text-slate-400">Certificate Status</p>
              <p className={`text-sm font-bold mt-0.5 ${stats.isEligibleForCertificate ? 'text-amber-400' : 'text-slate-400'}`}>
                {stats.isEligibleForCertificate ? 'Unlocked 🏆' : 'Locked 🔒'}
              </p>
            </div>
          </div>
        </div>

        {/* Modules & Syllabus List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Curriculum & Modules
            </h2>
            <span className="text-xs text-slate-400">
              {course.modules.length} Modules Total
            </span>
          </div>

          <div className="space-y-4">
            {course.modules.map((mod, modIdx) => {
              const isExpanded = expandedModules[mod.id] !== false;
              const moduleLessons = mod.lessons;
              const completedInMod = moduleLessons.filter(l => completedLessonIds.includes(l.id)).length;
              const isModCompleted = completedInMod === moduleLessons.length && moduleLessons.length > 0;
              const quizResult = mod.quiz ? progress?.quizResults?.[mod.quiz.id] : undefined;

              return (
                <div
                  key={mod.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all shadow-md"
                >
                  {/* Module Header Bar */}
                  <div 
                    onClick={() => toggleModule(mod.id)}
                    className="p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isModCompleted 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                          : 'bg-indigo-950/70 text-indigo-300 border border-indigo-800/80'
                      }`}>
                        {isModCompleted ? <Check className="w-4 h-4" /> : mod.moduleNumber}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                            Module {mod.moduleNumber}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[11px] text-slate-400">
                            {completedInMod}/{moduleLessons.length} lessons completed
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                          {mod.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                          {mod.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-semibold text-slate-300">
                          {mod.estimatedTimeMinutes} min
                        </span>
                      </div>
                      <button 
                        type="button" 
                        className="p-1 rounded-lg hover:bg-slate-700 text-slate-400"
                        aria-label="Toggle module"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Module Content / Lessons */}
                  {isExpanded && (
                    <div className="border-t border-slate-800/80 bg-slate-950/40 divide-y divide-slate-800/60">
                      {/* Lessons List */}
                      {moduleLessons.map((lesson, lessonIdx) => {
                        const isCompleted = completedLessonIds.includes(lesson.id);

                        return (
                          <div 
                            key={lesson.id}
                            className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                          >
                            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                                isCompleted 
                                  ? 'bg-emerald-500 text-slate-950' 
                                  : 'border border-slate-600 text-slate-400'
                              }`}>
                                {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : <span className="text-[10px]">{lessonIdx + 1}</span>}
                              </div>

                              <div className="flex-1 min-w-0">
                                <Link 
                                  to={`/course/${course.id}/lesson/${lesson.id}`}
                                  className="text-xs sm:text-sm font-semibold text-slate-200 hover:text-indigo-400 transition-colors block truncate"
                                >
                                  {lesson.title}
                                </Link>
                                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                  {lesson.summary}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {lesson.durationMinutes}m
                              </span>
                              <Link
                                to={`/course/${course.id}/lesson/${lesson.id}`}
                                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-medium transition-colors"
                              >
                                {isCompleted ? 'Review' : 'Start'}
                              </Link>
                            </div>
                          </div>
                        );
                      })}

                      {/* Module Quiz Item */}
                      {mod.quiz && (
                        <div className="p-4 sm:px-6 bg-indigo-950/20 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                              quizResult?.passed 
                                ? 'bg-amber-400 text-slate-950' 
                                : 'bg-slate-800 text-indigo-300 border border-indigo-700/60'
                            }`}>
                              <HelpCircle className="w-3.5 h-3.5" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/course/${course.id}/quiz/${mod.quiz.id}`}
                                  className="text-xs sm:text-sm font-semibold text-indigo-300 hover:text-indigo-200 block truncate"
                                >
                                  {mod.quiz.title}
                                </Link>
                                {quizResult && (
                                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                                    quizResult.passed 
                                      ? 'bg-emerald-950 border border-emerald-700 text-emerald-300' 
                                      : 'bg-red-950 border border-red-800 text-red-300'
                                  }`}>
                                    Score: {quizResult.score}%
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                {mod.quiz.questions.length} questions • Pass threshold: {mod.quiz.passingScore}%
                              </p>
                            </div>
                          </div>

                          <Link
                            to={`/course/${course.id}/quiz/${mod.quiz.id}`}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                              quizResult?.passed 
                                ? 'bg-indigo-950/80 border border-indigo-700/80 text-indigo-200 hover:bg-indigo-900' 
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            }`}
                          >
                            {quizResult ? (quizResult.passed ? 'Retake Quiz' : 'Retry Quiz') : 'Take Quiz'}
                          </Link>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Completion Prompt Footer */}
        <div className={`p-6 rounded-3xl border transition-all ${
          stats.isEligibleForCertificate 
            ? 'bg-gradient-to-r from-amber-950/40 via-indigo-950/30 to-slate-900 border-amber-500/50 shadow-xl' 
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                stats.isEligibleForCertificate ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-500'
              }`}>
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white">
                  {stats.isEligibleForCertificate ? 'Congratulations! Your Certificate is Ready' : 'Course Certificate of Completion'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {stats.isEligibleForCertificate 
                    ? 'You have satisfied all lesson milestones and passed the knowledge checks.' 
                    : `Complete ${stats.totalLessons - stats.completedLessons} remaining lessons and pass all quizzes to unlock your verified credential.`
                  }
                </p>
              </div>
            </div>

            <Link
              to={`/course/${course.id}/certificate`}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shrink-0 ${
                stats.isEligibleForCertificate 
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/20' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {stats.isEligibleForCertificate ? 'Claim & Print Certificate' : 'Preview Certificate Requirements'}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
