import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  HelpCircle, 
  Copy, 
  Check, 
  Lightbulb, 
  AlertTriangle, 
  Bookmark, 
  Compass, 
  Menu, 
  X,
  Award,
  Layers,
  FileText
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { LessonCallout } from '../types';

export const LessonViewerScreen: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { 
    courses, 
    userProgress, 
    toggleLessonComplete, 
    markLessonComplete,
    getCourseProgressStats 
  } = useCourse();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const course = courses.find(c => c.id === courseId) || courses[0];
  const stats = getCourseProgressStats(course.id);
  const progress = userProgress[course.id];
  const completedLessonIds = progress?.completedLessonIds || [];

  // Flatten all lessons with their module context
  interface FlatLessonItem {
    lesson: any;
    moduleNumber: number;
    moduleTitle: string;
    moduleId: string;
    quizId?: string;
  }

  const flattenedLessons: FlatLessonItem[] = [];
  course.modules.forEach(m => {
    m.lessons.forEach(l => {
      flattenedLessons.push({
        lesson: l,
        moduleNumber: m.moduleNumber,
        moduleTitle: m.title,
        moduleId: m.id,
        quizId: m.quiz?.id
      });
    });
  });

  const currentIndex = flattenedLessons.findIndex(item => item.lesson.id === lessonId);
  const currentItem = currentIndex >= 0 ? flattenedLessons[currentIndex] : flattenedLessons[0];
  const currentLesson = currentItem?.lesson;

  // Mark this lesson as complete or check if completed
  const isCurrentLessonCompleted = currentLesson ? completedLessonIds.includes(currentLesson.id) : false;

  // Navigation targets
  const prevItem = currentIndex > 0 ? flattenedLessons[currentIndex - 1] : null;
  const nextItem = currentIndex < flattenedLessons.length - 1 ? flattenedLessons[currentIndex + 1] : null;

  // Scroll to top on lesson switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSidebarOpen(false);
  }, [lessonId]);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleToggleComplete = () => {
    if (currentLesson) {
      toggleLessonComplete(course.id, currentLesson.id);
    }
  };

  const handleNextAction = () => {
    if (currentLesson && !isCurrentLessonCompleted) {
      markLessonComplete(course.id, currentLesson.id);
    }

    if (nextItem) {
      navigate(`/course/${course.id}/lesson/${nextItem.lesson.id}`);
    } else if (currentItem?.quizId) {
      navigate(`/course/${course.id}/quiz/${currentItem.quizId}`);
    } else {
      navigate(`/course/${course.id}/certificate`);
    }
  };

  if (!currentLesson) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-slate-400">Lesson not found.</p>
          <Link to={`/course/${course.id}`} className="mt-4 inline-block px-4 py-2 bg-indigo-600 rounded-lg text-white text-xs">
            Return to Overview
          </Link>
        </div>
      </div>
    );
  }

  const renderCallout = (callout: LessonCallout) => {
    let icon = <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />;
    let bg = 'bg-amber-950/20 border-amber-600/40 text-amber-200';
    let titleColor = 'text-amber-300';

    if (callout.type === 'warning') {
      icon = <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />;
      bg = 'bg-red-950/20 border-red-600/40 text-red-200';
      titleColor = 'text-red-300';
    } else if (callout.type === 'takeaway') {
      icon = <Bookmark className="w-5 h-5 text-indigo-400 shrink-0" />;
      bg = 'bg-indigo-950/30 border-indigo-600/40 text-indigo-200';
      titleColor = 'text-indigo-300';
    } else if (callout.type === 'deep-dive') {
      icon = <Compass className="w-5 h-5 text-cyan-400 shrink-0" />;
      bg = 'bg-cyan-950/20 border-cyan-600/40 text-cyan-200';
      titleColor = 'text-cyan-300';
    }

    return (
      <div className={`p-4 rounded-2xl border ${bg} my-5 flex items-start gap-3 shadow-md`}>
        {icon}
        <div className="text-xs sm:text-sm">
          <h4 className={`font-semibold ${titleColor} mb-1`}>{callout.title}</h4>
          <p className="leading-relaxed opacity-90">{callout.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Sub-Header bar for lesson status */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-16 z-30 px-4 sm:px-6 py-2.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              title="Open Syllabus"
            >
              <Menu className="w-4 h-4" />
            </button>
            <Link
              to={`/course/${course.id}`}
              className="text-xs font-semibold text-slate-400 hover:text-indigo-400 flex items-center gap-1 shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Course Overview</span>
            </Link>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-xs text-indigo-300 font-medium truncate">
              Module {currentItem.moduleNumber}: {currentLesson.title}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleComplete}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isCurrentLessonCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white border border-slate-700'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${isCurrentLessonCompleted ? 'text-emerald-400' : ''}`} />
              <span>{isCurrentLessonCompleted ? 'Completed' : 'Mark as Complete'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area + Sidebar Grid */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex gap-8">
        
        {/* Mobile Drawer Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar Syllabus */}
        <aside className={`
          fixed lg:static top-0 bottom-0 left-0 z-50 lg:z-auto
          w-80 shrink-0 bg-slate-900 lg:bg-transparent border-r lg:border-r-0 border-slate-800
          p-5 lg:p-0 transition-transform duration-300 ease-in-out overflow-y-auto max-h-screen lg:max-h-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="lg:sticky lg:top-32 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Course Syllabus</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Overall Progress Widget */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400">Total Progress</span>
                <span className="font-bold text-indigo-400">{stats.percentComplete}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full" 
                  style={{ width: `${stats.percentComplete}%` }} 
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">
                {stats.completedLessons} of {stats.totalLessons} lessons marked complete
              </p>
            </div>

            {/* Modules Navigation Accordion / List */}
            <div className="space-y-4">
              {course.modules.map(mod => {
                const isCurrentMod = mod.id === currentItem.moduleId;
                const modQuizResult = mod.quiz ? progress?.quizResults?.[mod.quiz.id] : undefined;

                return (
                  <div key={mod.id} className="space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center justify-between">
                      <span>Module {mod.moduleNumber}: {mod.title}</span>
                    </div>

                    <div className="space-y-1 pl-1">
                      {mod.lessons.map(les => {
                        const isSelected = les.id === currentLesson.id;
                        const isDone = completedLessonIds.includes(les.id);

                        return (
                          <Link
                            key={les.id}
                            to={`/course/${course.id}/lesson/${les.id}`}
                            className={`flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                isDone 
                                  ? (isSelected ? 'bg-white text-indigo-700' : 'bg-emerald-500 text-slate-950')
                                  : 'border border-slate-600'
                              }`}>
                                {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span className="truncate">{les.title}</span>
                            </div>
                            <span className="text-[10px] opacity-70 shrink-0">{les.durationMinutes}m</span>
                          </Link>
                        );
                      })}

                      {/* Quiz Link in Sidebar */}
                      {mod.quiz && (
                        <Link
                          to={`/course/${course.id}/quiz/${mod.quiz.id}`}
                          className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl text-xs transition-colors ${
                            modQuizResult?.passed
                              ? 'text-amber-300 hover:bg-amber-950/40'
                              : 'text-indigo-400 hover:bg-indigo-950/40'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>Knowledge Check</span>
                          </div>
                          {modQuizResult && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800">
                              {modQuizResult.score}%
                            </span>
                          )}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Certificate Link shortcut in sidebar */}
            <div className="pt-4 border-t border-slate-800">
              <Link
                to={`/course/${course.id}/certificate`}
                className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                  stats.isEligibleForCertificate
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>{stats.isEligibleForCertificate ? 'Claim Certificate' : 'Certificate (Locked)'}</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Reading Pane */}
        <main className="flex-1 min-w-0 max-w-3xl">
          <article className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
            
            {/* Lesson Title Header */}
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-2">
                <span>Module {currentItem.moduleNumber}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {currentLesson.durationMinutes} min read
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentLesson.title}
              </h1>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed italic border-l-2 border-indigo-500/50 pl-3">
                {currentLesson.summary}
              </p>
            </div>

            {/* Lesson Sections Content */}
            <div className="space-y-8 text-slate-300 leading-relaxed text-sm sm:text-base">
              {currentLesson.sections.map((section: any, sIdx: number) => (
                <section key={sIdx} className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight border-b border-slate-800 pb-2">
                    {section.heading}
                  </h2>

                  {/* Body Paragraphs */}
                  {section.body.map((paragraph: string, pIdx: number) => (
                    <p key={pIdx} className="text-slate-300 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}

                  {/* Callout if present */}
                  {section.callout && renderCallout(section.callout)}

                  {/* Code Snippet if present */}
                  {section.codeSnippet && (
                    <div className="my-5 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs shadow-lg">
                      <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400">
                        <span className="text-[11px] font-medium tracking-wide uppercase text-indigo-400">
                          {section.codeSnippet.language}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(section.codeSnippet.code, sIdx)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                        >
                          {copiedIndex === sIdx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-300">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto text-slate-200 leading-relaxed">
                        <code>{section.codeSnippet.code}</code>
                      </pre>
                      {section.codeSnippet.caption && (
                        <div className="px-4 py-1.5 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400">
                          {section.codeSnippet.caption}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Key Points Checklist */}
                  {section.keyPoints && section.keyPoints.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 my-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Key Takeaways
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm">
                        {section.keyPoints.map((point: string, kIdx: number) => (
                          <li key={kIdx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-slate-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </section>
              ))}
            </div>

            {/* Bottom Lesson Navigation Bar */}
            <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              {prevItem ? (
                <Link
                  to={`/course/${course.id}/lesson/${prevItem.lesson.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors w-full sm:w-auto justify-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Lesson</span>
                </Link>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleToggleComplete}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isCurrentLessonCompleted 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isCurrentLessonCompleted ? 'Marked Complete' : 'Mark as Complete'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextAction}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
                >
                  <span>
                    {nextItem ? 'Next Lesson' : currentItem?.quizId ? 'Take Module Quiz' : 'Finish Course'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </article>
        </main>

      </div>
    </div>
  );
};
