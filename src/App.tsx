import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

// PAGES
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NotFound from "./pages/NotFound";
import CustomerPage from "./pages/CustomerPage";
import CustomerBookingsPage from "./pages/CustomerBookingsPage";
import WaiterPage from "./pages/WaiterPage";
import WaiterOrderPage from "./pages/WaiterOrderPage";
import KitchenPage from "./pages/KitchenPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AdminTablesPage from "./pages/AdminTablesPage";
import AdminReservationsPage from "./pages/AdminReservationsPage";
import AdminMenuPage from "./pages/AdminMenuPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminStaffPage from "./pages/AdminStaffPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import RestaurantSettingsPage from "./pages/RestaurantSettingsPage";
import AdminFloorPlanPage from "./pages/AdminFloorPlanPage";
import AdminLoyaltyPage from "./pages/AdminLoyaltyPage";
import AdminFeedbackPage from "./pages/AdminFeedbackPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import AdminShiftsPage from "./pages/AdminShiftPage";
import ReservationTimelinePage from "./pages/ReservationTimeline";
import QRCodePage from "./pages/QrCode";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="bottom-right" expand={true} richColors />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Main Protected Layout */}
          <Route element={
            <ProtectedRoute allowedRoles={["ADMIN", "WAITER", "KITCHEN", "CUSTOMER"]}>
              <AppLayout />
            </ProtectedRoute>
          }>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Index />} />
            
            {/* Admin & Management */}
            <Route path="/admin/floor-plan" element={<AdminFloorPlanPage />} />
            <Route path="/admin/loyalty" element={<AdminLoyaltyPage />} />
            <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/tables" element={<AdminTablesPage />} />
            <Route path="/admin/menu" element={<AdminMenuPage />} />
            <Route path="/admin/reservations" element={<AdminReservationsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/staff" element={<AdminStaffPage />} />
            <Route path="/admin/settings" element={<RestaurantSettingsPage />} />
            <Route path="/admin/shift" element={<AdminShiftsPage/>}/>
            <Route path="/timeline" element={<ReservationTimelinePage/>}/>
            <Route path="/qrcode" element={<QRCodePage/>}/>
            <Route path="/analytics" element={<AnalyticsPage />} />

            {/* Staff Section */}
            <Route path="/waiter" element={<WaiterPage />} />
            <Route path="/waiter/order" element={<WaiterOrderPage />} />
            <Route path="/kitchen" element={<KitchenPage />} />

            {/* Customer Section */}
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/customer/bookings" element={<CustomerBookingsPage />} />

            {/* Settings */}
            <Route path="/settings/profile" element={<ProfileSettingsPage />} />
          </Route>
          
          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
