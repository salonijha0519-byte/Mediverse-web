
import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Droplets, ArrowRight, Loader2, Key, Info } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bloodGroup: 'O+'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const users: UserProfile[] = JSON.parse(localStorage.getItem('mediverse_db_users') || '[]');

    // Simulate network delay for premium feel
    setTimeout(() => {
      if (isRegistering) {
        if (users.find(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
          setError('User with this email already exists.');
          setLoading(false);
          return;
        }

        const newUser: UserProfile = {
          id: Math.random().toString(36).substr(2, 6).toUpperCase(),
          name: formData.name,
          email: formData.email,
          bloodGroup: formData.bloodGroup,
          allergies: [],
          chronicConditions: [],
          joinedAt: new Date().toISOString()
        };

        localStorage.setItem('mediverse_db_users', JSON.stringify([...users, newUser]));
        onLogin(newUser);
      } else {
        const found = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
        if (found) {
          // In a real app we'd check password, here we assume it's valid
          onLogin(found);
        } else {
          setError('Account not found. Please register first.');
          setLoading(false);
        }
      }
    }, 1500);
  };

  const mockGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const mockUser: UserProfile = {
        id: 'G' + Math.random().toString(36).substr(2, 5).toUpperCase(),
        name: 'Google User',
        email: 'user@gmail.com',
        bloodGroup: 'B+',
        allergies: [],
        chronicConditions: [],
        joinedAt: new Date().toISOString()
      };
      
      const users: UserProfile[] = JSON.parse(localStorage.getItem('mediverse_db_users') || '[]');
      if (!users.find(u => u.email === mockUser.email)) {
        localStorage.setItem('mediverse_db_users', JSON.stringify([...users, mockUser]));
      }
      
      onLogin(mockUser);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/10 blur-[120px] rounded-full"></div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden relative z-10">
        <div className="p-8 sm:p-12">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
              <ShieldCheck className="text-white w-10 h-10" />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {isRegistering ? 'Create Mediverse' : 'Welcome Back'}
            </h1>
            <p className="text-slate-500 font-medium">
              {isRegistering ? 'Start your meaningful health journey' : 'Access your private health ledger'}
            </p>
          </div>

          <div className="space-y-4 mb-8">
             <button 
              onClick={mockGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors font-semibold text-slate-700"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Sign in with Google
            </button>
            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-slate-100 flex-1"></div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">or email</span>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="email" 
                placeholder="Gmail / Email Address" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            {isRegistering && (
              <div className="relative group">
                <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                <select 
                  value={formData.bloodGroup}
                  onChange={e => setFormData({...formData, bloodGroup: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium appearance-none"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
            )}

            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="password" 
                placeholder="Vault Password" 
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold animate-pulse">
                <Info className="w-4 h-4" />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {isRegistering ? 'Register Account' : 'Unlock My Vault'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-slate-500 font-semibold hover:text-blue-600 transition-colors"
            >
              {isRegistering ? 'Already have a Vault? Sign In' : "New here? Create your Ledger"}
            </button>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
           <ShieldCheck className="w-4 h-4 text-slate-400" />
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">End-to-End Privacy Guaranteed</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;