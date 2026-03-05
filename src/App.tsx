import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import BrowsePlayersPage from './pages/BrowsePlayersPage';
import PartiesPage from './pages/PartiesPage';
import PartyLobbyPage from './pages/PartyLobbyPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

export default function App() {
  const { isAuthenticated, player, fetchMe } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !player) {
      fetchMe();
    }
  }, [isAuthenticated]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/browse" element={<ProtectedRoute><BrowsePlayersPage /></ProtectedRoute>} />
          <Route path="/parties" element={<ProtectedRoute><PartiesPage /></ProtectedRoute>} />
          <Route path="/parties/:partyId" element={<ProtectedRoute><PartyLobbyPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1C2030',
            color: '#F0F2FF',
            border: '1px solid #252A3A',
            borderRadius: '8px',
          },
          success: { iconTheme: { primary: '#00FF88', secondary: '#1C2030' } },
          error: { iconTheme: { primary: '#FF4757', secondary: '#1C2030' } },
        }}
      />
    </QueryClientProvider>
  );
}
