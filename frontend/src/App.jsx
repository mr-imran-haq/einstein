import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./features/dashboard/Dashboard";
import RoutinePage from "./features/routine/RoutinePage";
import TodoPage from "./features/todo/TodoPage";
import TargetsPage from "./features/targets/TargetsPage";
import AssistantPage from "./features/assistant/AssistantPage";
import SettingsPage from "./features/settings/SettingsPage";
import CreationsPage from "./features/creations/CreationsPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NewsPage from "./features/news/NewsPage";
import NotesPage from "./features/notes/NotesPage";
import HabitsPage from "./features/habits/HabitsPage";
import FocusPage from "./features/focus/FocusPage";
import CalendarPage from "./features/calendar/CalendarPage";
import StudyHubPage from "./features/study/StudyHubPage";
import ProgressPage from "./features/progress/ProgressPage";
import TodayPage from "./features/today/TodayPage";

const placeholders = [];

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/routine" element={<RoutinePage />} />
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/targets" element={<TargetsPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/creations" element={<CreationsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/focus" element={<FocusPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/study" element={<StudyHubPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/today" element={<TodayPage />} />
        {placeholders.map(({ path, title }) => (
          <Route key={path} path={path} element={<PlaceholderPage title={title} />} />
        ))}
      </Route>
    </Routes>
  );
}