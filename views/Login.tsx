
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Info } from 'lucide-react';
import { api } from '../mockApi';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@vatsin.in');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.login(email, password);
      onLogin(response.user, response.token);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
      {/* Left Branding Side */}
      <div className="hidden lg:flex flex-1 sidebar-gradient p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-2xl font-bold tracking-tight uppercase">VatsinHR</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-black leading-tight mb-6">
            Future of Indian <br />
            <span className="text-teal-400">Workforce Tech</span>
          </h1>
          <p className="text-indigo-100/70 max-w-md leading-relaxed">
            Manage your global workforce with precision. From automated payroll and Form 16s to AI-driven recruitment, VatsinHR is the central nervous system for your organization.
          </p>
        </div>

        <div className="flex items-center gap-6 relative z-10 opacity-60">
          <p className="text-xs font-bold uppercase tracking-[2px]">SOC2 Type II</p>
          <p className="text-xs font-bold uppercase tracking-[2px]">GDPR Compliant</p>
          <p className="text-xs font-bold uppercase tracking-[2px]">ISO 27001</p>
        </div>
      </div>

      {/* Right Login Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden flex items-center gap-2 justify-center">
             <ShieldCheck className="text-indigo-900 w-8 h-8" />
             <span className="text-2xl font-black text-indigo-900 uppercase">VatsinHR</span>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 relative">
            <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
            <p className="text-slate-500 mt-2">Access your organization's dashboard.</p>

            {error && (
              <div className="mt-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm flex items-start gap-3">
                 <Info className="flex-shrink-0 mt-0.5" size={18} />
                 {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-700"
                    placeholder="name@vatsin.in"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Forgot?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-700"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-indigo-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-950 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {loading ? 'Authenticating...' : (
                  <>
                    Sign Into Portal
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-slate-100">
               <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl">
                 <p className="text-xs font-bold text-teal-800 uppercase mb-2">Demo Credentials</p>
                 <div className="space-y-1">
                   <p className="text-[10px] text-teal-600 flex justify-between"><span>Admin:</span> <b>admin@vatsin.in / admin123</b></p>
                   <p className="text-[10px] text-teal-600 flex justify-between"><span>Employee:</span> <b>emp@vatsin.in / emp123</b></p>
                 </div>
               </div>
            </div>
          </div>
          
          <p className="text-center mt-8 text-slate-400 text-sm">
            Powered by Vatsin Solutions Enterprise Engine
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
