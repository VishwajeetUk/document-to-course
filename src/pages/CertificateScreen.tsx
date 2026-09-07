import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Award, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Edit3, 
  Check, 
  Copy, 
  ChevronLeft, 
  ShieldCheck, 
  BookOpen, 
  Zap,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCourse } from '../context/CourseContext';

export const CertificateScreen: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { 
    courses, 
    learnerName, 
    setLearnerName, 
    getCourseProgressStats, 
    unlockAllForDemo 
  } = useCourse();

  const course = courses.find(c => c.id === courseId) || courses[0];
  const stats = getCourseProgressStats(course.id);

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(learnerName);
  const [copiedShare, setCopiedShare] = useState(false);
  const [hasFiredConfetti, setHasFiredConfetti] = useState(false);

  const certificateRef = useRef<HTMLDivElement>(null);

  // Generate deterministic verification code from course ID
  const verificationCode = `CF-${course.id.replace(/[^a-zA-Z0-9]/g, '').slice(-5).toUpperCase()}-${new Date().getFullYear()}`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Confetti effect on unlock
  useEffect(() => {
    if (stats.isEligibleForCertificate && !hasFiredConfetti) {
      setHasFiredConfetti(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  }, [stats.isEligibleForCertificate, hasFiredConfetti]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setLearnerName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/course/${course.id}/certificate?credential=${verificationCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Controls Bar (Hidden during print) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
          <Link
            to={`/course/${course.id}`}
            className="text-xs font-semibold text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Course Overview</span>
          </Link>

          {stats.isEligibleForCertificate && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedShare ? 'Credential Link Copied!' : 'Share Credential'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          )}
        </div>

        {/* Unlocked State vs Locked State */}
        {!stats.isEligibleForCertificate ? (
          /* Locked State View */
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-slate-400 mb-5">
              <Lock className="w-8 h-8 text-amber-500" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Certificate Locked
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Complete all lessons and pass every module knowledge check to unlock your verified credential for <strong className="text-slate-200">{course.title}</strong>.
            </p>

            {/* Requirement Checklist */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 mt-6 text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Lesson Progress</span>
                <span className="font-semibold text-slate-200">
                  {stats.completedLessons} / {stats.totalLessons} Completed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Quizzes Passed</span>
                <span className="font-semibold text-slate-200">
                  {stats.passedQuizzes} / {stats.totalQuizzes} Passed
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/course/${course.id}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
              >
                Resume Course
              </Link>

              <button
                type="button"
                onClick={() => unlockAllForDemo(course.id)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/80 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Unlock All (Demo Mode)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Unlocked High-Fidelity Printable Certificate */
          <div className="space-y-6">
            
            {/* Student Name Personalizer Toolbar */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs print:hidden">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300">
                  Recipient Name on Certificate: <strong className="text-white font-semibold">{learnerName}</strong>
                </span>
              </div>

              {isEditingName ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Enter your full name"
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-indigo-500 text-white text-xs focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTempName(learnerName);
                      setIsEditingName(false);
                    }}
                    className="px-2 py-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setTempName(learnerName);
                    setIsEditingName(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 font-medium transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Customize Name</span>
                </button>
              )}
            </div>

            {/* Print Styling CSS Injection */}
            <style>{`
              @media print {
                body {
                  background-color: white !important;
                  color: black !important;
                }
                header, nav, button, .print\\:hidden {
                  display: none !important;
                }
                .certificate-printable {
                  box-shadow: none !important;
                  border: 2px solid #334155 !important;
                  background: #ffffff !important;
                  color: #0f172a !important;
                  padding: 40px !important;
                  margin: 0 auto !important;
                  page-break-inside: avoid;
                }
              }
            `}</style>

            {/* The Certificate Document Frame */}
            <div 
              ref={certificateRef}
              className="certificate-printable bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-8 border-double border-amber-600/40 rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center"
            >
              {/* Subtle background ornamentation */}
              <div className="absolute top-0 left-0 w-32 h-32 border-b-2 border-r-2 border-amber-500/20 rounded-br-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-32 h-32 border-t-2 border-l-2 border-amber-500/20 rounded-tl-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                
                {/* Header Crest / Seal */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-600/50 text-amber-300 text-xs font-bold tracking-widest uppercase">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Official Credential
                </div>

                <div className="space-y-1">
                  <h1 className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-slate-400 uppercase">
                    Certificate of Completion
                  </h1>
                  <p className="text-[11px] text-slate-500 tracking-wider">
                    COURSEFORGE ACCREDITED CURRICULUM
                  </p>
                </div>

                <div className="py-2">
                  <p className="text-xs sm:text-sm text-slate-400 font-serif italic">
                    This document certifies that
                  </p>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-amber-300 tracking-tight font-serif mt-2">
                    {learnerName}
                  </h2>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2" />
                </div>

                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  has successfully completed all modules, interactive lessons, and passed the knowledge assessments for the course
                </p>

                {/* Course Title Block */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 max-w-md mx-auto shadow-inner">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {course.title}
                  </h3>
                  <p className="text-xs text-indigo-400 font-medium mt-1">
                    {course.category} • {course.level} Level
                  </p>
                </div>

                {/* Footer Badges, Date, and Signatures */}
                <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 items-center gap-6 border-t border-slate-800/80 text-xs">
                  
                  {/* Issue Date */}
                  <div className="text-center sm:text-left space-y-1">
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Date Issued</p>
                    <p className="text-slate-200 font-medium">{issueDate}</p>
                  </div>

                  {/* Gold Rosette Stamp / Seal */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black">
                      <Award className="w-8 h-8 text-slate-950 stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-1">
                      VERIFIED PASS
                    </span>
                  </div>

                  {/* Credential ID */}
                  <div className="text-center sm:text-right space-y-1">
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Credential ID</p>
                    <p className="text-slate-200 font-mono font-medium">{verificationCode}</p>
                  </div>

                </div>

              </div>
            </div>

            {/* Shareable Badge Box */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Share Your Achievement</h4>
                  <p className="text-xs text-slate-400">
                    Add this verifiable credential to your portfolio, resume, or LinkedIn profile.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Verification URL</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
