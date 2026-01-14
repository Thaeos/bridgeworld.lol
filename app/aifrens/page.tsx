'use client';

import AIFrensProfile from '@/components/AIFrensProfile';

export default function AIFrensPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-pink-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Frens Profile</h1>
          <p className="text-gray-400">Connect with the AI Frens community</p>
        </div>

        <AIFrensProfile />
      </div>
    </main>
  );
}
