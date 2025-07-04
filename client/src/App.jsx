import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BuilderPage from './pages/BuilderPage';
import PublicResumePage from './pages/PublicResumePage';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/resume/:slug" element={<PublicResumePage />} />
        
        {/* Protected Routes */}
        <Route path="" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/builder/:id" element={<BuilderPage />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;