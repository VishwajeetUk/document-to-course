import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CourseProvider } from './context/CourseContext';
import { MainLayout } from './layouts/MainLayout';
import { UploadScreen } from './pages/UploadScreen';
import { CourseOverviewScreen } from './pages/CourseOverviewScreen';
import { LessonViewerScreen } from './pages/LessonViewerScreen';
import { QuizScreen } from './pages/QuizScreen';
import { CertificateScreen } from './pages/CertificateScreen';

export default function App() {
  return (
    <CourseProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<UploadScreen />} />
            <Route path="/upload" element={<UploadScreen />} />
            <Route path="/course/:courseId" element={<CourseOverviewScreen />} />
            <Route path="/course/:courseId/lesson/:lessonId" element={<LessonViewerScreen />} />
            <Route path="/course/:courseId/quiz/:quizId" element={<QuizScreen />} />
            <Route path="/course/:courseId/certificate" element={<CertificateScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CourseProvider>
  );
}
