'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaTimes } from 'react-icons/fa';

export default function EmailCapture() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if user has already provided email or dismissed popup
    const hasProvidedEmail = localStorage.getItem('userEmail');
    const hasDismissed = localStorage.getItem('emailPopupDismissed');
    
    if (!hasProvidedEmail && !hasDismissed) {
      // Show popup after 10 seconds on the site
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage('Thank you! I\'ll keep you updated.');
        localStorage.setItem('userEmail', email);
        
        // Close popup after 2 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('emailPopupDismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleDismiss}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-gray-900 border-2 border-blue-500/50 rounded-2xl p-8 shadow-2xl shadow-blue-500/20 relative">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-2xl text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-white text-center mb-2">
                Let's Stay Connected! 🚀
              </h3>
              <p className="text-gray-400 text-center mb-6">
                Drop your email and be the first to know when I build something incredible. Who knows? Your next project might need my magic touch! ✨
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full px-4 py-3 bg-gray-800 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 disabled:opacity-50"
                />

                {message && (
                  <p className={`text-sm text-center ${
                    status === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed! ✓' : 'Subscribe'}
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                No spam. No boring emails. Just me, reaching out when something cool happens. Promise! 🤝
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
