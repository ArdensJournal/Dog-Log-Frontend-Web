'use client';

import { useState } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.google && window.google.accounts) {
        resolve();
        return;
      }

      // Remove existing script if any
      const existingScript = document.querySelector('script[src*="gsi/client"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Wait a bit for the library to initialize
        setTimeout(() => {
          if (window.google && window.google.accounts) {
            resolve();
          } else {
            reject(new Error('Google library failed to load'));
          }
        }, 100);
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google script'));
      };

      document.head.appendChild(script);
    });
  };

  const signInWithGoogle = async (onSuccess: (token: string) => void, onError: (error: string) => void) => {
    try {
      setIsLoading(true);
      
      // Load Google script
      await loadGoogleScript();
      
      // Initialize Google Sign-In - remove the aud parameter as it doesn't work
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: (response: any) => {
          setIsLoading(false);
          if (response.credential) {
            onSuccess(response.credential);
          } else {
            onError('Failed to get Google credentials');
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false, // Disable FedCM to avoid NetworkError
      });

      // Create a temporary container for the Google button
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '-9999px';
      tempContainer.style.visibility = 'hidden';
      document.body.appendChild(tempContainer);

      // Render the Google button
      window.google.accounts.id.renderButton(tempContainer, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'signin_with',
        logo_alignment: 'left',
        width: 250
      });

      // Find and click the button
      setTimeout(() => {
        const googleButton = tempContainer.querySelector('div[role="button"]') as HTMLElement;
        if (googleButton) {
          googleButton.click();
        } else {
          // Fallback to prompt if button method fails
          try {
            window.google.accounts.id.prompt((notification: any) => {
              if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                setIsLoading(false);
                onError('Google Sign-In was blocked or skipped');
              }
            });
          } catch (promptError) {
            setIsLoading(false);
            onError('Failed to show Google Sign-In');
          }
        }
        
        // Clean up the temporary container
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      }, 200);

    } catch (error) {
      setIsLoading(false);
      console.error('Google Auth Error:', error);
      onError('Failed to initialize Google Sign-In');
    }
  };

  return { signInWithGoogle, isLoading };
}