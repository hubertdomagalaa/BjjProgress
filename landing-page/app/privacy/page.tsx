'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Database, Lock, Trash2, Mail, Eye } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050a14] text-white">
      {/* Header */}
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-12">Last updated: December 2024</p>

        {/* Intro */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Shield size={24} className="text-purple-400" />
            <h2 className="text-xl font-bold">Your Privacy Matters</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            BJJ Progress is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
          </p>
        </div>

        {/* Data We Collect */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Database size={20} className="text-blue-400" />
            <h2 className="text-2xl font-bold">Data We Collect</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-purple-400 mt-1" />
              <div>
                <h3 className="font-bold mb-1">Email Address</h3>
                <p className="text-gray-400 text-sm">For account authentication</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye size={18} className="text-purple-400 mt-1" />
              <div>
                <h3 className="font-bold mb-1">Training Logs</h3>
                <p className="text-gray-400 text-sm">The training data you choose to log</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield size={18} className="text-purple-400 mt-1" />
              <div>
                <h3 className="font-bold mb-1">Belt & Progress</h3>
                <p className="text-gray-400 text-sm">Your BJJ rank and preferences</p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Use Data */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={20} className="text-green-400" />
            <h2 className="text-2xl font-bold">How We Use Your Data</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <ul className="space-y-3 text-gray-300">
              <li>• Provide and maintain the BJJ Progress service</li>
              <li>• Generate your training statistics and insights</li>
              <li>• Sync your data across devices</li>
              <li>• Send important account notifications</li>
            </ul>
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={20} className="text-yellow-400" />
            <h2 className="text-2xl font-bold">Data Security</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-gray-300 leading-relaxed">
              Your data is stored securely using Appwrite cloud services with industry-standard encryption. 
              We implement appropriate security measures to protect against unauthorized access, alteration, or destruction.
            </p>
          </div>
        </section>

        {/* No Selling Data */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-12">
          <h3 className="text-green-400 font-bold text-lg mb-2">✓ We Never Sell Your Data</h3>
          <p className="text-gray-300 text-sm">
            We do not sell, trade, or share your personal information with third parties for marketing purposes.
          </p>
        </div>

        {/* Your Rights */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 size={20} className="text-red-400" />
            <h2 className="text-2xl font-bold">Your Rights</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <ul className="space-y-3 text-gray-300">
              <li>• Access your personal data at any time</li>
              <li>• Export your training data</li>
              <li>• Delete your account and all associated data from Settings</li>
            </ul>
          </div>
        </section>

        {/* Contact */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-purple-300 font-bold mb-2">Questions?</h3>
          <p className="text-gray-300 text-sm">
            Contact us at <a href="mailto:support@bjjprogress.app" className="text-purple-400 hover:underline">support@bjjprogress.app</a>
          </p>
        </div>
      </div>
    </main>
  );
}
