'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();
  const hasTracked = useRef(false);

  useEffect(() => {
    // Track only once per session to avoid spam
    if (hasTracked.current) return;
    
    const trackVisitor = async () => {
      try {
        // Get current page URL
        const page = window.location.href;
        
        // Optional: Try to get email from local storage or form data
        // This would only work if user has filled a form previously
        const storedEmail = localStorage.getItem('userEmail');
        
        const response = await fetch('/api/track-visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page,
            email: storedEmail || undefined,
            referrer: document.referrer || 'Direct',
          }),
        });

        if (response.ok) {
          hasTracked.current = true;
          console.log('Visitor tracked successfully');
        }
      } catch (error) {
        console.error('Failed to track visitor:', error);
      }
    };

    // Small delay to ensure page is loaded
    const timer = setTimeout(trackVisitor, 1000);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  // This component doesn't render anything visible
  return null;
}
