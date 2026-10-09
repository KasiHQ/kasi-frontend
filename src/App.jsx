import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './modules/Dashboard/pages/Dashboard';
import LandingPage from './modules/Landing/pages/LandingPage';
import Marketplace from './modules/Marketplace/pages/Marketplace';
import ProductDetail from './modules/Marketplace/pages/ProductDetail';
import VendorProfile from './modules/Marketplace/pages/VendorProfile';
import MainLayout from './components/layout/MainLayout';
import NotFound from './components/layout/NotFound';

import { AuthProvider } from './context/AuthContext';
import { LayoutProvider } from './context/LayoutContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './modules/Auth/pages/Login';
import Signup from './modules/Auth/pages/Signup';
import ForgotPassword from './modules/Auth/pages/ForgotPassword';
import VerifyEmail from './modules/Auth/pages/VerifyEmail';

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
import AdminBlog from './modules/Admin/pages/AdminBlog';
import BillingDashboard from './modules/Billing/pages/BillingDashboard';
import PaymentCallback from './modules/Billing/pages/PaymentCallback';
import PaymentSuccess from './modules/Payments/pages/PaymentSuccess';
import BillingCallback from './modules/Billing/pages/BillingCallback';
import Services from './modules/Services/pages/Services';
import Bookings from './modules/Services/pages/Bookings';
import Chats from './modules/Conversations/pages/Chats';
import Logistics from './modules/Logistics/pages/Logistics';
import Fulfilment from './modules/Fulfilment/pages/Fulfilment';
import PrivacyPolicy from './modules/Legal/pages/PrivacyPolicy';
import TermsOfService from './modules/Legal/pages/TermsOfService';
import DataDeletion from './modules/Legal/pages/DataDeletion';
import { ROUTES } from './routes';
import PageStub from './components/common/PageStub';
import DevLogos from './pages/DevLogos';

import { OnboardingWizard } from './modules/Onboarding';
import { usePageTracker } from './hooks/usePageTracker';

function AnalyticsTracker() {
  usePageTracker();
  return null;
}

// Helper component to scroll to top on navigation changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
          <ScrollToTop />
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
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
          <Route path="/market" element={<Marketplace />} />
          <Route path="/market/product/:id" element={<ProductDetail />} />
          <Route path="/market/vendor/:vendorId" element={<VendorProfile />} />
          
          {/* Public Spec Routes (Zero-404 stubs for Wave 2) */}
          <Route path="/how-it-works" element={<PageStub route={ROUTES.HOW_IT_WORKS} />} />
          <Route path="/features" element={<PageStub route={ROUTES.FEATURES} />} />
          <Route path="/features/sales-engine" element={<PageStub route={ROUTES.FEATURE_SALES} />} />
          <Route path="/features/fulfilment" element={<PageStub route={ROUTES.FEATURE_FULFILMENT} />} />
          <Route path="/features/delivery" element={<PageStub route={ROUTES.FEATURE_DELIVERY} />} />
          <Route path="/features/payments" element={<PageStub route={ROUTES.FEATURE_PAYMENTS} />} />
          <Route path="/features/chats" element={<PageStub route={ROUTES.FEATURE_CHATS} />} />
          <Route path="/features/customers" element={<PageStub route={ROUTES.FEATURE_CUSTOMERS} />} />
          <Route path="/features/analytics" element={<PageStub route={ROUTES.FEATURE_ANALYTICS} />} />
          <Route path="/platforms" element={<PageStub route={ROUTES.PLATFORMS} />} />
          <Route path="/try" element={<PageStub route={ROUTES.TRY} />} />
          <Route path="/pricing" element={<PageStub route={ROUTES.PRICING} />} />
          <Route path="/about" element={<PageStub route={ROUTES.ABOUT} />} />
          <Route path="/contact" element={<PageStub route={ROUTES.CONTACT} />} />
          <Route path="/get-started" element={<Signup />} />
          
          {/* Dev-only inspection route */}
          <Route path="/dev/logos" element={<DevLogos />} />
          
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
              <Route path="/fulfilment" element={
                <SubscriptionProtected>
                  <Fulfilment />
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
              <Route path="/kasisalienceadministration/blog" element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Support Admin']}>
                  <AdminBlog />
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
