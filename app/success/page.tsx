'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen paper-bg flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-2xl p-12">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-whisper-sage rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-playfair text-whisper-charcoal mb-4">
            Your card is on its way
          </h1>

          <p className="text-lg text-whisper-charcoal/70 mb-8">
            Thank you for choosing Whispering Art. Your handcrafted card will be printed
            and mailed within 1-2 business days.
          </p>

          <div className="bg-whisper-cream rounded-lg p-6 mb-8">
            <p className="text-sm text-whisper-charcoal/80">
              A confirmation email has been sent to your inbox with tracking details.
            </p>
            {sessionId && (
              <p className="text-xs text-whisper-charcoal/60 mt-2 font-mono">
                Order ID: {sessionId.slice(-12)}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full py-3 bg-whisper-sage text-white rounded-lg hover:bg-whisper-gold transition-all duration-300 font-medium"
            >
              Create Another Card
            </Link>
            <p className="text-sm text-whisper-charcoal/60">
              Questions? Contact Nana at{' '}
              <a
                href="mailto:hello@whisperingart.com"
                className="text-whisper-sage hover:text-whisper-gold"
              >
                hello@whisperingart.com
              </a>
            </p>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="mt-8 text-center">
          <p className="font-allura text-2xl text-whisper-charcoal/70">
            Whispering Art by Nana
          </p>
          <p className="text-sm text-whisper-charcoal/50 mt-2">
            Where words and art whisper together
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
