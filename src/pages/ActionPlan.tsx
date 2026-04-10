import { useState } from 'react';
import { toast } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Unlock } from 'lucide-react';

const HARDCODED_PASSWORD = 'Totum@SupremoIsrael';

const ActionPlan = () => {
  const [passInput, setPassInput] = useState('');
  const [autorizado, setAutorizado] = useState(false);

  const verificarAcesso = () => {
    if (passInput === HARDCODED_PASSWORD) {
      setAutorizado(true);
      toast.success('Acesso concedido');
    } else {
      toast.error('Código de acesso inválido');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') verificarAcesso();
  };

  if (!autorizado) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4" style={{ backgroundColor: '#EAEAE5' }}>
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold">Plano de Ação</h1>
            <p className="text-muted-foreground">
              Esta área é restrita. Digite o código de acesso para continuar.
            </p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Código de acesso"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={verificarAcesso} className="w-full">
              <Unlock className="w-4 h-4 mr-2" />
              Acessar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout><div className="p-6">
      <h1>Plano de Ação - Conteúdo Protegido</h1>
    </div></AppLayout>
  );
};

export default ActionPlan;
