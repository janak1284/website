import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { GlassCard } from '../components/ui/GlassCard';

export function Login() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.is_new_user) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert("Login failed: " + data.detail);
      }
    } catch (err) {
      console.error(err);
      alert("Network error connecting to backend.");
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
            alert('Google Login Failed');
          }}
          useOneTap
        />
      </GlassCard>
    </div>
  );
}
