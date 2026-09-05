import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { GlassCard } from '../components/ui/GlassCard';
import { toast } from 'react-hot-toast';

export function Login() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      
      if (!res.ok) {
        if (res.status === 403) {
          toast.error("Login failed: Access denied. Email not registered as a paid participant. Please log in with the exact email you registered with.");
        } else {
          const errorData = await res.json();
          toast.error(errorData.detail || "Authentication failed. Please try again.");
        }
        return; 
      }
      
      const data = await res.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.is_new_user) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error connecting to the server.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4">
      <GlassCard className="p-12 max-w-md w-full text-center flex flex-col items-center">
        <h1 className="text-4xl font-display text-white mb-6">Team Portal</h1>
        <p className="text-lg text-white/70 mb-8">
          Sign in with your Google account to access your Team Dashboard.
        </p>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            toast.error('Google Login Failed');
          }}
          useOneTap
        />
      </GlassCard>
    </div>
  );
}
