import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import AiWidget from './components/AiWidget';
import { CosmicBackground } from './components/CosmicBackground';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { LearningPage } from './pages/LearningPage';
import { CourseCatalogPage } from './pages/CourseCatalogPage';
import { CoursePage } from './pages/CoursePage';
import { LessonPage } from './pages/LessonPage';
import { CTFPage } from './pages/CTFPage';
import { CTFChallengePage } from './pages/CTFChallengePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { CareerPage } from './pages/CareerPage';
import { AIAgentsPage } from './pages/AIAgentsPage';
import { CommunityPage } from './pages/CommunityPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        <CosmicBackground />
        <Navigation />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/courses" element={<CourseCatalogPage />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/ctf" element={<CTFPage />} />
            <Route path="/ctf/:challengeId" element={<CTFChallengePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/career" element={<CareerPage />} />
            <Route path="/ai" element={<AIAgentsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
        <AiWidget />
      </div>
    </BrowserRouter>
  );
}

