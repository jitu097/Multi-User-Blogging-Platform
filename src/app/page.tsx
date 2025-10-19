/**
 * Home Page - Landing page with auto-redirect for authenticated users
 * 
 * Authenticated users are automatically redirected to /dashboard
 * Unauthenticated users see a clean landing page with sign-in option
 */

import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from "next/link";
import { BookOpen, Users, Zap, PenTool, PlusCircle, Filter } from "lucide-react";

export default async function HomePage() {
  // Check if user is authenticated - if yes, redirect to dashboard
  const { userId } = await auth();
  
  if (userId) {
    redirect('/dashboard');
  }

  // Only unauthenticated users see this page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">BlogPlatform</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <SignInButton mode="modal">
                <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
              Share Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Stories
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join our community of writers and readers. Create beautiful blog posts, 
              organize them with categories, and connect with people who share your interests.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                  Start Writing Today
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to blog
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you create, organize, and share your content effortlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Create & Edit</h3>
              <p className="text-gray-600 leading-relaxed">
                Write and publish your thoughts with our intuitive editor. 
                Support for rich text formatting and easy content management.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Filter className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Organize</h3>
              <p className="text-gray-600 leading-relaxed">
                Categorize your posts and make them easy to find. 
                Help readers discover exactly what they&apos;re looking for.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Connect</h3>
              <p className="text-gray-600 leading-relaxed">
                Build your audience and engage with readers. 
                Join a community of passionate writers and storytellers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thousands of writers are already sharing their stories and building their audience.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Stories Published</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">5K+</div>
              <div className="text-gray-600">Active Writers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Monthly Readers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">100+</div>
              <div className="text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Writers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from some of our amazing community members about their experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="text-gray-600 mb-6">
                &quot;This platform has completely transformed how I share my thoughts. The editor is intuitive and the community is incredibly supportive.&quot;
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  SA
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Anderson</div>
                  <div className="text-gray-600 text-sm">Tech Blogger</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="text-gray-600 mb-6">
                &quot;I love how easy it is to organize my posts with categories. My readers can easily find exactly what they&apos;re looking for.&quot;
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  MJ
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Michael Johnson</div>
                  <div className="text-gray-600 text-sm">Travel Writer</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="text-gray-600 mb-6">
                &quot;The preview feature helps me perfect my posts before publishing. It&apos;s like having a personal editor built right in.&quot;
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  EL
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Emma Liu</div>
                  <div className="text-gray-600 text-sm">Food Blogger</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to start your blogging journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of writers sharing their stories on our platform.
          </p>
          
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
                Create Your Account
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 inline-block"
            >
              Continue to Dashboard
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-blue-400 mr-2" />
            <span className="text-xl font-bold">BlogPlatform</span>
          </div>
          <p className="text-gray-400">
            © 2025 BlogPlatform. Built with Next.js, tRPC, and Clerk.
          </p>
        </div>
      </footer>
    </div>
  );
}