import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Container, Trash2, RefreshCw } from 'lucide-react';
import { useHostingContainers } from '../hooks';
import {
  DSCard,
  DSLabel,
  DSButton,
  DSInput,
  DSSelect,
  DSBadge,
  DSDot,
  DSTable,
} from './DSComponents';
import { SelectItem } from '@/components/ui/select';

export function ContainersTab() {
  const {
    containers,
    loading,
    dialogOpen,
    setDialogOpen,
    form,
    setForm,
    create,
    restart,
    remove,
  } = useHostingContainers();

  return (
    <div className="space-y-5">
      <DSButton onClick={() => setDialogOpen(true)}>
        <Container className="h-3.5 w-3.5" />
        Novo Container
      </DSButton>

      <DSTable
        headers={['Nome', 'Tipo', 'Porta', 'Status', 'Último Check', 'Ações']}
        loading={loading}
        empty={
          <div className="p-10 text-center">
            <Container className="h-6 w-6 mx-auto mb-2 text-zinc-700" />
            <p className="text-zinc-600 font-mono text-xs uppercase tracking-wider">
              Nenhum container encontrado
            </p>
          </div>
        }
      >
        {containers.length > 0 &&
          containers.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-6 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors"
            >
              <div className="font-mono text-sm text-white font-medium">{c.name}</div>
              <div className="text-xs text-zinc-400 uppercase">{c.container_type}</div>
              <div className="text-sm text-zinc-300">{c.port || '—'}</div>
              <div>
                <DSBadge status={c.status} />
              </div>
              <div className="text-[10px] text-zinc-500 font-mono">
                {c.last_health_check
                  ? new Date(c.last_health_check).toLocaleTimeString('pt-BR')
                  : '—'}
              </div>
              <div className="flex gap-1">
                <DSButton
                  variant="ghost"
                  size="icon"
                  onClick={() => restart(c)}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </DSButton>
                <DSButton
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(c.id)}
                  className="hover:!text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </DSButton>
              </div>
            </div>
          ))}
      </DSTable>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-black border-zinc-800 rounded-none max-w-lg text-white">
          <DialogHeader>
            <DialogTitle className="text-white font-sans tracking-tight">
              Novo Container
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">
                Nome
              </label>
              <DSInput
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="evolution-api"
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">
                  Porta
                </label>
                <DSInput
                  type="number"
                  value={form.port}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, port: e.target.value }))
                  }
                  placeholder="8080"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">
                  Tipo
                </label>
                <DSSelect
                  value={form.container_type}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, container_type: v }))
                  }
                >
                  <SelectItem value="app" className="text-white">
                    Aplicação
                  </SelectItem>
                  <SelectItem value="db" className="text-white">
                    Banco de Dados
                  </SelectItem>
                  <SelectItem value="cache" className="text-white">
                    Cache
                  </SelectItem>
                </DSSelect>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">
                Health Check URL
              </label>
              <DSInput
                value={form.health_check_url}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    health_check_url: e.target.value,
                  }))
                }
                placeholder="/health"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <DSButton
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancelar
            </DSButton>
            <DSButton onClick={create} disabled={!form.name}>
              Criar
            </DSButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
