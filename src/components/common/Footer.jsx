"use client";

import React, { useEffect, useState } from "react";
import { Phone, Mail, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getAllCategories } from

"@/services/categoriesService";

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getAllCategories().
    then((res) =>
    setCategories(
      (res.categories ?? []).
      filter((category) => category.level === 1).
      slice(0, 6)
    )
    ).
    catch(() => {});
  }, []);

  return (
    <footer
      className="px-4 py-12 sm:px-6 lg:px-10"
      style={{
        backgroundColor: "#ffffff",
        borderTop: "1px solid #f0e0dc",
        fontFamily: "'DM Sans', sans-serif"
      }}>
      
      <div className="mx-auto max-w-7xl">
        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
            <img
              src="/logo-black.png"
              alt="The Fabric People"
              className="h-auto w-30" />
            
            <p className="text-xs leading-relaxed text-gray-500 max-w-[200px]">
              Providing sourcing solutions for Innerwear | Swimwear | Activewear
              | Nightwear | Loungewear
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
              { label: "Home", href: "/" },
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" }].
              map((item) =>
              <li key={item.label}>
                  <Link to={item.href}
                  className="text-xs text-gray-500 transition-colors hover:text-gray-900">
                  
                    {item.label}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Products — live from API */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
              Categories
            </h4>
            <ul className="flex flex-col gap-2.5">
              {categories.length === 0 ?
              Array.from({ length: 6 }).map((_, i) =>
              <li
                key={i}
                className="h-3 w-28 animate-pulse rounded bg-gray-200" />

              ) :
              categories.map((category) =>
              <li key={category._id}>
                      <Link to={`/products?category=${category._id}`}
                  className="text-xs text-gray-500 transition-colors hover:text-gray-900 line-clamp-1">
                  
                        {category.name}
                      </Link>
                    </li>
              )}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
            <h4 className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
              Contact Us
            </h4>
            <div className="flex flex-col gap-3 text-xs text-gray-600 leading-relaxed">
              <p>
                <span className="font-semibold" style={{ color: "#d94f4f" }}>
                  Head Office :{" "}
                </span>
                4778, 1st Floor, Ram Bazar, Cloth Market, Fatehpuri, Delhi -
                110006, India
              </p>
              <p>
                <span className="font-semibold" style={{ color: "#d94f4f" }}>
                  Works :{" "}
                </span>
                G-38, Ground Floor, Sector D1(P3), Tronica City, Loni,
                Ghaziabad, UP - 201102, India
              </p>
              <div className="flex flex-col gap-2 mt-1">
                <a
                  href="tel:+918811071145"
                  className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                  
                  <Phone size={12} style={{ color: "#d94f4f" }} />
                  +91-8811071145
                </a>
                <a
                  href="mailto:thefabricpeople@gmail.com"
                  className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                  
                  <Mail size={12} style={{ color: "#d94f4f" }} />
                  thefabricpeople@gmail.com
                </a>
                <a
                  href="https://www.thefabricpeople.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                  
                  <Globe size={12} style={{ color: "#d94f4f" }} />
                  www.thefabricpeople.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-10 pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row"
          style={{ borderTop: "1px solid #f0e0dc" }}>
          
          <p className="text-[11px] text-gray-400">
            © 2026 The Fabric People. All Rights Reserved.
          </p>

          <div className="flex items-center gap-4 text-[11px] text-gray-400">
            <Link to="privacy-policy" className="hover:text-gray-700 transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link to="/terms-and-conditions" className="hover:text-gray-700 transition-colors">
              Terms & Conditions
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {[
            {
              label: "LinkedIn",
              href: "#",
              svg:
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />

            },
            {
              label: "Instagram",
              href: "#",
              svg:
              <>
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </>

            },
            {
              label: "Website",
              href: "https://www.thefabricpeople.in",
              svg:
              <>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" x2="22" y1="12" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </>

            }].
            map(({ label, href, svg }) =>
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:border-gray-400 hover:text-gray-900"
              style={{ border: "1px solid #e0d5d2", color: "#888" }}>
              
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                
                  {svg}
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;