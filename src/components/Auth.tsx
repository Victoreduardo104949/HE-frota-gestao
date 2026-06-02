import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Truck, Eye, EyeOff } from 'lucide-react';

type AuthMode = 'login' | 'signup';

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setError('Conta criada! Verifique seu email para confirmar.');
        setMode('login');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-elegant-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-elegant-card rounded-2xl flex items-center justify-center border border-elegant-border">
              <Truck className="text-elegant-accent" size={32} />
            </div>
          </div>

          <h1 className="text-xl font-bold text-elegant-text text-center">
            HE Travels&Tuors
          </h1>
          <p className="text-sm text-elegant-dim text-center mt-1 mb-8">
            {mode === 'login' ? 'Faça login para continuar' : 'Crie sua conta'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-elegant-dim mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-3 py-2.5 bg-elegant-card border border-elegant-border rounded-lg text-sm text-elegant-text placeholder-elegant-dim/50 focus:outline-none focus:border-elegant-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-elegant-dim mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-3 py-2.5 pr-10 bg-elegant-card border border-elegant-border rounded-lg text-sm text-elegant-text placeholder-elegant-dim/50 focus:outline-none focus:border-elegant-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-elegant-dim hover:text-elegant-text transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className={`text-xs ${error.includes('Verifique') ? 'text-elegant-success' : 'text-elegant-danger'}`}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-elegant-accent hover:bg-elegant-accent/90 disabled:opacity-50 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : mode === 'login' ? (
                <><LogIn size={16} /> Entrar</>
              ) : (
                <><UserPlus size={16} /> Criar Conta</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-xs text-elegant-accent hover:text-elegant-accent/80 transition-colors"
            >
              {mode === 'login'
                ? 'Não tem conta? Cadastre-se'
                : 'Já tem conta? Faça login'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
