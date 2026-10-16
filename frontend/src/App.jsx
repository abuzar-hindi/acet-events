import { Routes, Route, Navigate } from 'react-router-dom';
import './styles/index.css';
import HomePage from './pages/HomePage';
import InvitationPage from './pages/InvitationPage';
import FacultyPage from './pages/FacultyPage';
import SigningPage from './pages/SigningPage';
import ThankYouPage from './pages/ThankYouPage';
import OrganizerPage from './pages/OrganizerPage';
import SiteGate from './components/SiteGate';
import DandiyaGlowTransition from './components/transitions/DandiyaGlowTransition';
import MandalaRevealTransition from './components/transitions/MandalaRevealTransition';
import DandiyaSwipeTransition from './components/transitions/DandiyaSwipeTransition';

export default function App() {
  return (
    <SiteGate>
      <Routes>
        {/* 1. Home / Hero Page (ONLY the hero section) */}
        <Route path="/" element={<HomePage />} />

        {/* 2. Invitation Card Page (Dedicated uncluttered invitation experience) */}
        <Route
          path="/invitation"
          element={
            <DandiyaGlowTransition>
              <InvitationPage />
            </DandiyaGlowTransition>
          }
        />

        {/* 3. Faculty Directory Page (Dedicated faculty honor roll experience) */}
        <Route path="/faculty" element={<FacultyPage />} />

        {/* 4. Individual Signing Page / Sign In Page */}
        <Route
          path="/sign/:facultyId"
          element={
            <MandalaRevealTransition>
              <SigningPage />
            </MandalaRevealTransition>
          }
        />
        <Route
          path="/sign"
          element={
            <MandalaRevealTransition>
              <SigningPage />
            </MandalaRevealTransition>
          }
        />
        <Route
          path="/signin"
          element={
            <MandalaRevealTransition>
              <SigningPage />
            </MandalaRevealTransition>
          }
        />

        {/* 5. Personalized Thank-You & Card Experience */}
        <Route
          path="/thank-you/:facultyId"
          element={
            <DandiyaSwipeTransition>
              <ThankYouPage />
            </DandiyaSwipeTransition>
          }
        />

        {/* 6. Organizer Settings and Management Interface */}
        <Route
          path="/organizer"
          element={
            <DandiyaSwipeTransition>
              <OrganizerPage />
            </DandiyaSwipeTransition>
          }
        />

        {/* Fallback — redirect anything unknown to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteGate>
  );
}
