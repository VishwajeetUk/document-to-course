import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Zap, 
  HelpCircle,
  FileCode,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCourse } from '../context/CourseContext';
import { SAMPLE_COURSES } from '../data/sampleCourses';

export const UploadScreen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    startDocumentProcessing, 
    processingStatus, 
    cancelProcessing, 
    selectCourse 
  } = useCourse();

  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const processFile = async (file: File) => {
    setErrorMessage(null);
    try {
      const courseId = await startDocumentProcessing(file);
      navigate(`/course/${courseId}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process document. Please try a valid PDF, DOCX, or TXT file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handlePresetSelect = (presetCourseId: string) => {
    selectCourse(presetCourseId);
    navigate(`/course/${presetCourseId}`);
  };

  const stepsList = [
    { key: 'reading_file', label: 'Reading document & extracting text' },
    { key: 'extracting_text', label: 'Analyzing concepts & keywords' },
    { key: 'detecting_chapters', label: 'Detecting chapter boundaries' },
    { key: 'structuring_modules', label: 'Synthesizing modules & lessons' },
    { key: 'generating_quizzes', label: 'Formulating quiz knowledge checks' }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header Title & Intro */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            AI-Powered Document Curriculum Transformer
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Turn Any Document Into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Complete Online Course</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload notes, research papers, design docs, or playbooks. CourseForge automatically decomposes raw text into structured lessons, key takeaway callouts, and interactive quizzes.
          </p>
        </div>

        {/* Error Notification */}
        <AnimatePresence>
          {(errorMessage || processingStatus.error) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 flex items-start gap-3 shadow-lg"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm">
                <p className="font-semibold text-red-300">Upload Issue</p>
                <p className="mt-0.5 text-red-200/90">{errorMessage || processingStatus.error}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  cancelProcessing();
                }}
                className="text-xs font-semibold px-2 py-1 bg-red-900/60 hover:bg-red-900 rounded text-red-200"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing State vs Drop Zone */}
        {processingStatus.isProcessing ? (
          <div className="bg-slate-900/90 border border-indigo-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
            
            <div className="max-w-md mx-auto text-center relative z-10">
              <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping opacity-30" />
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shadow-inner">
                  <Cpu className="w-8 h-8 animate-pulse text-indigo-300" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight">
                Synthesizing Course Blueprint
              </h2>
              <p className="text-xs text-slate-400 mt-1 truncate">
                Source: <span className="text-slate-200 font-medium">{processingStatus.fileName}</span>
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2.5 mt-6 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                  initial={{ width: '10%' }}
                  animate={{ width: `${processingStatus.progressPercent}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
                <span>Transforming content...</span>
                <span className="font-semibold text-indigo-300">{processingStatus.progressPercent}%</span>
              </div>

              {/* Staged Steps Indicator */}
              <div className="mt-8 space-y-3 text-left">
                {stepsList.map((st, idx) => {
                  const isDone = processingStatus.stepIndex > idx + 1;
                  const isCurrent = processingStatus.stepIndex === idx + 1;
                  return (
                    <div 
                      key={st.key}
                      className={`flex items-center gap-3 text-xs p-2.5 rounded-lg transition-colors ${
                        isCurrent 
                          ? 'bg-indigo-950/60 border border-indigo-800/80 text-indigo-200' 
                          : isDone 
                          ? 'text-slate-300' 
                          : 'text-slate-600'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                      )}
                      <span className="font-medium">{st.label}</span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        ) : (
          /* Empty / Idle / Drag-Active State */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200 relative group overflow-hidden ${
              isDragActive 
                ? 'border-indigo-400 bg-indigo-950/40 ring-4 ring-indigo-500/20 scale-[1.01]' 
                : 'border-slate-700 hover:border-indigo-500/80 bg-slate-900/60 hover:bg-slate-900/90'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt,.md"
              className="hidden"
              onChange={handleFileInputChange}
            />

            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-800/80 mx-auto flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Upload className="w-8 h-8 text-indigo-300" />
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {isDragActive ? 'Drop your document here' : 'Choose a document or drag it here'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Accepts <span className="text-slate-200 font-medium">PDF, DOCX, TXT</span> documents up to 25MB.
              </p>

              <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-colors">
                <FileText className="w-4 h-4" />
                Browse Local Files
              </div>

              <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-800/80 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Private client-side preview</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Instant module synthesis</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preset Sample Documents Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Or Explore Ready-to-Learn Presets
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Test the curriculum builder instantly with pre-synthesized course documents.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAMPLE_COURSES.map(course => (
              <div
                key={course.id}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-indigo-950/30 group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 font-medium">
                      {course.level}
                    </span>
                    <span>{course.totalEstimatedMinutes} mins</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {course.tagline}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-3">
                    <FileCode className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{course.sourceFileName}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handlePresetSelect(course.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition-all group-hover:shadow-md"
                  >
                    <span>Load This Course</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
