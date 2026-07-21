import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ToastProvider from "@/components/common/ToastProvider";
import ScrollToTop from "@/components/common/ScrollToTop";
import { AuthProvider } from "@/context/AuthContext";
import { CartCountProvider } from "@/context/CartCountContext";
import "./globals.css";

// Home Page
import Home from "./Home";

// Public Pages
import PublicLayout from "./(public)/layout";
import About from "./(public)/about/page";
import Account from "./(public)/account/page";
import Cart from "./(public)/cart/page";
import Contact from "./(public)/contact/page";
import Order from "./(public)/order/page";
import OrderForm from "./(public)/order-form/page";
import PrivacyPolicy from "./(public)/privacy-policy/page";
import Product from "./(public)/product/page";
import Products from "./(public)/products/page";
import Special from "./(public)/special/page";
import SpecialLogin from "./(public)/special/login/page";
import SpecialProducts from "./(public)/special/products/page";
import TermsAndConditions from "./(public)/terms-and-conditions/page";

// Auth Pages
import UserLogin from "./login/page";
import UserSignup from "./signup/page";

// Admin Pages
import AdminLayout from "./admin/(panel)/layout";
import AdminDashboard from "./admin/(panel)/page";
import AdminCategory from "./admin/(panel)/category/page";
import AdminEnquiries from "./admin/(panel)/enquiries/page";
import AdminHome from "./admin/(panel)/home/page";
import AdminOrders from "./admin/(panel)/orders/page";
import AdminProducts from "./admin/(panel)/products/page";
import AdminSpecialUserRequests from "./admin/(panel)/special-user-requests/page";
import AdminSpecialUsers from "./admin/(panel)/special-users/page";
import AdminUsers from "./admin/(panel)/users/page";
import AdminLogin from "./admin/login/page";

export default function App() {
  return (
    <AuthProvider>
      <CartCountProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Root Home Route */}
            <Route path="/" element={<Home />} />

            {/* Public Layout Routes */}
            <Route element={<PublicLayout />}>
              <Route path="about" element={<About />} />
              <Route path="account" element={<Account />} />
              <Route path="cart" element={<Cart />} />
              <Route path="contact" element={<Contact />} />
              <Route path="order" element={<Order />} />
              <Route path="order-form" element={<OrderForm />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="product" element={<Product />} />
              <Route path="products" element={<Products />} />
              <Route path="special" element={<Special />} />
              <Route path="special/login" element={<SpecialLogin />} />
              <Route path="special/products" element={<SpecialProducts />} />
              <Route path="terms-and-conditions" element={<TermsAndConditions />} />
            </Route>

            {/* Auth Routes */}
            <Route path="login" element={<UserLogin />} />
            <Route path="signup" element={<UserSignup />} />

            {/* Admin Login Route */}
            <Route path="admin/login" element={<AdminLogin />} />

            {/* Admin Panel Routes */}
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="category" element={<AdminCategory />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="home" element={<AdminHome />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="special-user-requests" element={<AdminSpecialUserRequests />} />
              <Route path="special-users" element={<AdminSpecialUsers />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </Router>
        <ToastProvider />
      </CartCountProvider>
    </AuthProvider>
  );
}
