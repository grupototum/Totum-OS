import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona para o Hub principal
    navigate('/hub', { replace: true });
  }, [navigate]);

  // Retorna null enquanto redireciona
  return null;
};

export default Index;
