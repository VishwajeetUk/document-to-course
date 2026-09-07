import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  BookOpen, 
  Upload, 
  Award, 
  RotateCcw, 
  ChevronDown, 
  CheckCircle2, 
  FileText,
  Lock,
  Layers
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    courses, 
    activeCourseId, 
    activeCourse, 
    selectCourse, 
    getCourseProgressStats, 
    resetCourseProgress,
    unlockAllForDemo 
  } = useCourse();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const stats = getCourseProgressStats(activeCourseId);

  // Determine first lesson path
  const firstLessonId = activeCourse.modules[0]?.lessons[0]?.id;

  const handleSelectCourse = (id: string) => {
    selectCourse(id);
    setIsDropdownOpen(false);
    navigate(`/course/${id}`);
  };

  const handleReset = () => {
    resetCourseProgress(activeCourseId);
    setShowResetConfirm(false);
  };

  const handleUnlockDemo = () => {
    unlockAllForDemo(activeCourseId);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-indigo-100" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  CourseForge
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                  Doc to Interactive Course
                </span>
              </div>
            </Link>

            {/* Course Selector Dropdown */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
                title="Switch course"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span className="max-w-[170px] truncate text-slate-300">{activeCourse.title}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)} 
                  />
                  <div className="absolute left-0 mt-2 w-72 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Available Courses
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-700/50">
                      {courses.map(c => {
                        const isCurrent = c.id === activeCourseId;
                        const cStats = getCourseProgressStats(c.id);
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleSelectCourse(c.id)}
                            className={`w-full text-left px-3 py-2.5 hover:bg-slate-700/70 transition-colors flex items-start gap-2.5 ${
                              isCurrent ? 'bg-indigo-950/40 text-indigo-300' : 'text-slate-200'
                            }`}
                          >
                            <FileText className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{c.title}</p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                <span>{c.level}</span>
                                <span>•</span>
                                <span>{cStats.percentComplete}% done</span>
                              </div>
                            </div>
                            {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="p-2 border-t border-slate-700 mt-1">
                      <Link
                        to="/upload"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload New Document
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/upload"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                location.pathname === '/upload'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload</span>
            </Link>

            <Link
              to={`/course/${activeCourseId}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                location.pathname.startsWith('/course') && !location.pathname.includes('/lesson') && !location.pathname.includes('/quiz')
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Overview</span>
            </Link>

            {firstLessonId && (
              <Link
                to={`/course/${activeCourseId}/lesson/${firstLessonId}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  location.pathname.includes('/lesson')
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Lessons</span>
              </Link>
            )}

            <Link
              to={`/course/${activeCourseId}/certificate`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                location.pathname.includes('/certificate')
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : stats.isEligibleForCertificate
                  ? 'text-amber-300 hover:bg-amber-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={stats.isEligibleForCertificate ? 'Certificate Unlocked!' : 'Certificate Locked until 100% complete'}
            >
              {stats.isEligibleForCertificate ? (
                <Award className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className="hidden sm:inline">Certificate</span>
            </Link>

            {/* Quick Progress Indicator */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800">
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-bold text-slate-200">
                  {stats.percentComplete}%
                </span>
                <span className="text-[9px] text-slate-400 hidden lg:inline">
                  {stats.completedLessons}/{stats.totalLessons} Lessons
                </span>
              </div>
              <div className="w-7 h-7 relative flex items-center justify-center">
                <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    className="stroke-slate-700"
                    strokeWidth="3.5"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    className="stroke-indigo-500 transition-all duration-500 ease-out"
                    strokeWidth="3.5"
                    strokeDasharray={88}
                    strokeDashoffset={88 - (88 * stats.percentComplete) / 100}
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Demo actions: Reset & Unlock */}
              <div className="flex items-center gap-1 ml-1">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Reset course progress"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleUnlockDemo}
                  className="px-2 py-1 text-[10px] font-medium rounded-md bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 transition-colors hidden xl:inline-block"
                  title="Unlock 100% completion for quick demo"
                >
                  Unlock Demo
                </button>
              </div>
            </div>

          </nav>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-semibold text-white">Reset Course Progress?</h3>
            <p className="text-xs text-slate-400 mt-2">
              This will clear completed lessons and quiz scores for <strong className="text-slate-200">{activeCourse.title}</strong>.
            </p>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
