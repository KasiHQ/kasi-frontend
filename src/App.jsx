import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './modules/Dashboard/pages/Dashboard';
import LandingPage from './modules/Landing/pages/LandingPage';
import MainLayout from './components/layout/MainLayout';
import NotFound from './components/layout/NotFound';

import { AuthProvider } from './context/AuthContext';
import { LayoutProvider } from './context/LayoutContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './modules/Auth/pages/Login';
import Signup from './modules/Auth/pages/Signup';
import ForgotPassword from './modules/Auth/pages/ForgotPassword';

import CreateInvoice from './modules/Invoices/pages/CreateInvoice';
import Invoices from './modules/Invoices/pages/Invoices';
import ProtectedRoute from './components/layout/ProtectedRoute';
import SubscriptionGate from './components/layout/SubscriptionGate';

const SubscriptionProtected = ({ children }) => (
  <ProtectedRoute>
    <SubscriptionGate>{children}</SubscriptionGate>
  </ProtectedRoute>
);

import { ToastProvider } from './context/ToastContext';
import Settings from './modules/Settings/pages/Settings';
import SalesNotebook from './modules/Sales/pages/SalesNotebook';
import Clients from './modules/Clients/pages/Clients';
import Payments from './modules/Payments/pages/Payments';
import Help from './modules/Help/pages/Help';
import Products from './modules/Products/pages/Products';
import Analytics from './modules/Analytics/pages/Analytics';
import AdminDashboard from './modules/Admin/pages/AdminDashboard';
import AdminUsers from './modules/Admin/pages/AdminUsers';
import AdminInvoices from './modules/Admin/pages/AdminInvoices';
import AdminStaff from './modules/Admin/pages/AdminStaff';
import AdminBroadcasts from './modules/Admin/pages/AdminBroadcasts';
import AdminTransactions from './modules/Admin/pages/AdminTransactions';
import AdminWaitlist from './modules/Admin/pages/AdminWaitlist';
import AdminAuditLogs from './modules/Admin/pages/AdminAuditLogs';
import BillingDashboard from './modules/Billing/pages/BillingDashboard';
import PaymentCallback from './modules/Billing/pages/PaymentCallback';
import PaymentSuccess from './modules/Payments/pages/PaymentSuccess';
import BillingCallback from './modules/Billing/pages/BillingCallback';
import Services from './modules/Services/pages/Services';
import Bookings from './modules/Services/pages/Bookings';
import Chats from './modules/Conversations/pages/Chats';
import Logistics from './modules/Logistics/pages/Logistics';
import PrivacyPolicy from './modules/Legal/pages/PrivacyPolicy';
import TermsOfService from './modules/Legal/pages/TermsOfService';
import DataDeletion from './modules/Legal/pages/DataDeletion';

import { OnboardingWizard } from './modules/Onboarding';
import { usePageTracker } from './hooks/usePageTracker';

function AnalyticsTracker() {
  usePageTracker();
  return null;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ThemeProvider>
        <LayoutProvider>
        <Router>
          <AnalyticsTracker />
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/data-deletion" element={<DataDeletion />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <OnboardingWizard />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<LandingPage />} />
          
          <Route element={<MainLayout />}>
              <Route path="/dashboard" element={
                <SubscriptionProtected>
                  <Dashboard />
                </SubscriptionProtected>
              } />

              {/* New primary pages */}
              <Route path="/chats" element={
                <SubscriptionProtected>
                  <Chats />
                </SubscriptionProtected>
              } />
              <Route path="/logistics" element={
                <SubscriptionProtected>
                  <Logistics />
                </SubscriptionProtected>
              } />
              <Route path="/customers" element={
                <SubscriptionProtected>
                  <Clients />
                </SubscriptionProtected>
              } />

              {/* Keep old /clients route working as alias */}
              <Route path="/clients" element={
                <SubscriptionProtected>
                  <Clients />
                </SubscriptionProtected>
              } />

              <Route path="/sales" element={
                <SubscriptionProtected>
                  <SalesNotebook />
                </SubscriptionProtected>
              } />
              <Route path="/invoices" element={
                <SubscriptionProtected>
                  <Invoices />
                </SubscriptionProtected>
              } />
              <Route path="/invoices/create" element={
                <SubscriptionProtected>
                  <CreateInvoice />
                </SubscriptionProtected>
              } />
              
              <Route path="/payments" element={
                <SubscriptionProtected>
                  <Payments />
                </SubscriptionProtected>
              } />

              <Route path="/billing" element={
                <ProtectedRoute>
                  <BillingDashboard />
                </ProtectedRoute>
              } />

              <Route path="/payment/callback" element={
                <ProtectedRoute>
                  <PaymentCallback />
                </ProtectedRoute>
              } />


              <Route path="/billing/callback" element={
                <ProtectedRoute>
                  <BillingCallback />
                </ProtectedRoute>
              } />

              <Route path="/products" element={
                <SubscriptionProtected>
                  <Products />
                </SubscriptionProtected>
              } />

              <Route path="/services" element={
                <SubscriptionProtected>
                  <Services />
                </SubscriptionProtected>
              } />

              <Route path="/bookings" element={
                <SubscriptionProtected>
                  <Bookings />
                </SubscriptionProtected>
              } />

              <Route path="/analytics" element={
                <SubscriptionProtected>
                  <Analytics />
                </SubscriptionProtected>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              <Route path="/help" element={
                <ProtectedRoute>
                   <Help />
                </ProtectedRoute>
              } />



              <Route path="/kasisalienceadministration" element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Finance Admin', 'Support Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/kasisalienceadministration/users" element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Support Admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/kasisalienceadministration/invoices" element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Finance Admin']}>
                  <AdminInvoices />
                </ProtectedRoute>
              } />
              <Route path="/kasisalienceadministration/transactions" element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Finance Admin']}>
                  <AdminTransactions />
                </ProtectedRoute>
              } />
              <Route path="/kasisalienceadministration/waitlist" element={
                <ProtectedRoute allowedRoles={['Super Admin']}>
                  <AdminWaitlist />
                </ProtectedRoute>
              } />
              <Route path="/kasisalienceadministration/audit-logs" element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Support Admin']}>
                  <AdminAuditLogs />
                </ProtectedRoute>
              } />
              <Route path="/kasisalienceadministration/broadcasts" element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Support Admin']}>
                  <AdminBroadcasts />
                </ProtectedRoute>
              } />
              <Route path="/kasisalienceadministration/staff" element={
                <ProtectedRoute allowedRoles={['Super Admin']}>
                  <AdminStaff />
                </ProtectedRoute>
              } />
          </Route>
          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </LayoutProvider>
      </ThemeProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
