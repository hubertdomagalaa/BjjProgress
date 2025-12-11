'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle, Scale, UserX, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-500 mb-12">Last updated: December 2024</p>

        {/* Intro */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <FileText size={24} className="text-purple-400" />
            <h2 className="text-xl font-bold">Welcome to BJJ Progress</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            By using BJJ Progress, you agree to these terms of service. Please read them carefully before using the app.
          </p>
        </div>

        {/* Acceptance */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle size={20} className="text-green-400" />
            <h2 className="text-2xl font-bold">Acceptance of Terms</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-gray-300 leading-relaxed">
              By accessing or using BJJ Progress, you agree to be bound by these Terms of Service and our Privacy Policy. 
              If you disagree with any part of the terms, you may not access the service.
            </p>
          </div>
        </section>

        {/* Your Responsibilities */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Scale size={20} className="text-blue-400" />
            <h2 className="text-2xl font-bold">Your Responsibilities</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <ul className="space-y-3 text-gray-300">
              <li>• Provide accurate information when creating your account</li>
              <li>• Use the app only for personal training tracking</li>
              <li>• Keep your account credentials secure</li>
              <li>• Not attempt to abuse or compromise the service</li>
            </ul>
          </div>
        </section>

        {/* Prohibited Activities */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <UserX size={20} className="text-red-400" />
            <h2 className="text-2xl font-bold">Prohibited Activities</h2>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <ul className="space-y-3 text-gray-300">
              <li>• Attempting to access other users&apos; data</li>
              <li>• Using the service for illegal purposes</li>
              <li>• Reverse engineering or tampering with the app</li>
              <li>• Creating multiple accounts to abuse free trials</li>
            </ul>
          </div>
        </section>

        {/* Subscriptions */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle size={20} className="text-yellow-400" />
            <h2 className="text-2xl font-bold">Subscriptions & Payments</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <ul className="space-y-3 text-gray-300">
              <li>• PRO subscriptions are billed monthly or annually</li>
              <li>• Subscriptions auto-renew unless cancelled</li>
              <li>• Refunds are handled through the respective app store</li>
            </ul>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle size={20} className="text-yellow-400" />
            <h2 className="text-2xl font-bold">Disclaimer</h2>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <p className="text-gray-300 leading-relaxed">
              BJJ Progress is provided &quot;as is&quot; without warranties of any kind. We are not responsible for any injuries 
              or issues that may occur during your BJJ training. Always train safely under qualified instruction.
            </p>
          </div>
        </section>

        {/* Changes to Terms */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-12">
          <h3 className="font-bold mb-2">Changes to Terms</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            We may update these terms from time to time. Continued use of the app after changes constitutes acceptance of the new terms.
          </p>
        </div>

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
