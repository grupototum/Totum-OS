// src/pages/Index.tsx
// Redirecionamento para /dashboard com loading state

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para /dashboard após brief loading
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div 
      className="flex min-h-screen items-center justify-center" 
      style={{ backgroundColor: '#EAEAE5' }}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Carregando Totum OS...</p>
      </div>
    </div>
  );
};

export default Index;
