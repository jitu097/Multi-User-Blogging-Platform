/**
 * Main Navigation Component
 * 
 * Responsive navbar with authentication support via Clerk
 * Features:
 * - Mobile-friendly hamburger menu
 * - Authenticated vs unauthenticated states
 * - Sticky positioning for better UX
 * - Quick access to create post
 * 
 * @param className - Optional CSS classes for styling
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { PlusCircle, Home, Folder, BookOpen, Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface NavbarProps {
  className?: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
}

// Navigation items configuration - easy to add/remove items
const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
    requiresAuth: true
  },
  {
    href: "/posts",
    label: "Posts",
    icon: BookOpen,
    requiresAuth: true
  },
  {
    href: "/categories",
    label: "Categories", 
    icon: Folder,
    requiresAuth: true
  }
];

export function Navbar({ className }: NavbarProps) {
  // Mobile menu toggle state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={cn(
      "bg-white shadow-sm border-b sticky top-0 z-50",
      "backdrop-blur-md bg-white/95", // Glassmorphism effect
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <BookOpen className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold text-gray-900 hidden sm:block">BlogPlatform</span>
              <span className="text-xl font-bold text-gray-900 sm:hidden">Blog</span>
            </Link>
          </div>
          
          {/* Desktop Navigation - Hidden on mobile */}
          <SignedIn>
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Create Post Button */}
              <Button asChild className="ml-4">
                <Link href="/posts/create" className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden lg:inline">New Post</span>
                  <span className="lg:hidden">New</span>
                </Link>
              </Button>
            </nav>
          </SignedIn>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search Button - Desktop */}
            <SignedIn>
              <Link href="/posts" className="hidden md:flex">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center"
                >
                  <Search className="w-4 h-4" />
                  <span className="ml-2 text-sm text-gray-500">Search...</span>
                </Button>
              </Link>
            </SignedIn>

            {/* User Menu */}
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 ring-2 ring-blue-100 hover:ring-blue-200 transition-all"
                  }
                }}
              />
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>

            {/* Mobile Menu Button */}
            <SignedIn>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </SignedIn>
          </div>
        </div>

        {/* Mobile Navigation */}
        <SignedIn>
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Search - Mobile */}
                <Link
                  href="/posts"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  <Search className="w-5 h-5" />
                  Search posts
                </Link>

                {/* Navigation Items */}
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
                
                {/* Create Post - Mobile */}
                <Link
                  href="/posts/create"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium transition-colors mt-4"
                >
                  <PlusCircle className="w-5 h-5" />
                  Create New Post
                </Link>
              </div>
            </div>
          )}
        </SignedIn>
      </div>
    </header>
  );
}