import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Rocket, CheckCircle, Circle, RotateCcw } from 'lucide-react';

interface CheckItem {
  id: string;
  label: string;
  category: 'pre' | 'deploy' | 'post';
  checked: boolean;
}

const INITIAL_CHECKLIST: CheckItem[] = [
  // Pré-deploy
  { id: 'build', label: 'Build sem erros (npm run build)', category: 'pre', checked: false },
  { id: 'tests', label: 'Testes passando', category: 'pre', checked: false },
  { id: 'env', label: 'Variáveis de ambiente atualizadas', category: 'pre', checked: false },
  { id: 'branch', label: 'Branch main atualizada (git pull)', category: 'pre', checked: false },
  { id: 'review', label: 'Code review aprovado', category: 'pre', checked: false },
  // Deploy
  { id: 'backup_db', label: 'Backup do banco feito', category: 'deploy', checked: false },
  { id: 'migration', label: 'Migrations aplicadas', category: 'deploy', checked: false },
  { id: 'push', label: 'Push para produção', category: 'deploy', checked: false },
  { id: 'cache', label: 'Cache invalidado', category: 'deploy', checked: false },
  // Pós-deploy
  { id: 'smoke', label: 'Smoke test no ambiente de prod', category: 'post', checked: false },
  { id: 'monitor', label: 'Monitoramento verificado', category: 'post', checked: false },
  { id: 'notify', label: 'Time notificado do deploy', category: 'post', checked: false },
];

const categoryLabel: Record<CheckItem['category'], string> = {
  pre: 'Pré-Deploy',
  deploy: 'Deploy',
  post: 'Pós-Deploy',
};

const categoryColor: Record<CheckItem['category'], string> = {
  pre: 'bg-blue-500/10 text-blue-400',
  deploy: 'bg-amber-500/10 text-amber-400',
  post: 'bg-emerald-500/10 text-emerald-400',
};

export default function DeploymentChecklist() {
  const [items, setItems] = useState<CheckItem[]>(INITIAL_CHECKLIST);

  const toggle = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const reset = () => setItems(INITIAL_CHECKLIST.map(i => ({ ...i, checked: false })));

  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100);
  const allDone = items.every(i => i.checked);

  const grouped = (['pre', 'deploy', 'post'] as const).map(cat => ({
    cat,
    items: items.filter(i => i.category === cat),
  }));

  return (
    <AppLayout>
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50">
            <Rocket className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Checklist de Deploy</h1>
            <p className="text-sm text-muted-foreground">Passo a passo para implantação segura</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={allDone ? 'bg-emerald-500/10 text-emerald-400 border-0' : 'bg-muted text-muted-foreground border-0'}>
            {progress}% concluído
          </Badge>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-1" />Resetar
          </Button>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary rounded-full h-2 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {allDone && (
        <Card className="p-4 bg-green-50 border-green-200 flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-800">Pronto para deploy!</p>
            <p className="text-sm text-green-600">Todos os itens foram verificados.</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {grouped.map(({ cat, items: catItems }) => (
          <Card key={cat} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`border-0 text-xs ${categoryColor[cat]}`}>{categoryLabel[cat]}</Badge>
              <span className="text-xs text-muted-foreground ml-auto">
                {catItems.filter(i => i.checked).length}/{catItems.length}
              </span>
            </div>
            <div className="space-y-3">
              {catItems.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    id={item.id}
                    checked={item.checked}
                    onCheckedChange={() => toggle(item.id)}
                  />
                  <label
                    htmlFor={item.id}
                    className={`text-sm cursor-pointer ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
    </AppLayout>
  );
}
