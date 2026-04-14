import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search, Users } from 'lucide-react';
import { useHostingClients } from '../hooks';
import {
  DSCard,
  DSLabel,
  DSButton,
  DSInput,
  DSSelect,
  DSBadge,
  DSTable,
} from './DSComponents';
import { SelectItem } from '@/components/ui/select';

export function ClientsTab() {
  const {
    filtered,
    loading,
    search,
    setSearch,
    dialogOpen,
    setDialogOpen,
    editing,
    form,
    setForm,
    openNew,
    openEdit,
    save,
    remove,
  } = useHostingClients();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-0 top-3 h-4 w-4 text-zinc-600" />
          <DSInput
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-6"
          />
        </div>
        <DSButton onClick={openNew}>
          <Plus className="h-3.5 w-3.5" />
          Novo Cliente
        </DSButton>
      </div>

      <DSTable
        headers={['Empresa', 'Domínio', 'Status', 'Valor Mensal', 'Pagamento', 'Ações']}
        loading={loading}
        empty={
          <div className="p-10 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-zinc-700" />
            <p className="text-zinc-600 font-mono text-xs uppercase tracking-wider">
              Nenhum cliente encontrado
            </p>
          </div>
        }
      >
        {filtered.length > 0 &&
          filtered.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-6 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors group"
            >
              <div>
                <p className="text-sm text-white font-medium">{c.company_name}</p>
                {c.contact_email && (
                  <p className="text-[10px] text-zinc-600 font-mono mt-0.5">
                    {c.contact_email}
                  </p>
                )}
              </div>
              <div className="text-xs font-mono text-zinc-400">{c.domain || '—'}</div>
              <div>
                <DSBadge status={c.status} />
              </div>
              <div className="text-sm text-white font-medium">
                R$ {c.monthly_value.toFixed(2)}
              </div>
              <div>
                <DSBadge status={c.payment_status} />
              </div>
              <div className="flex gap-1">
                <DSButton
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(c)}
                >
                  <Edit className="h-3.5 w-3.5" />
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
              {editing ? 'Editar Cliente' : 'Novo Cliente'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="group relative">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">
                  Empresa *
                </label>
                <DSInput
                  value={form.company_name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      company_name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="group relative">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">
                  Domínio
                </label>
                <DSInput
                  value={form.domain}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      domain: e.target.value,
                    }))
                  }
                  placeholder="exemplo.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">
                  Contato
                </label>
                <DSInput
                  value={form.contact_name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      contact_name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">
                  Email
                </label>
                <DSInput
                  value={form.contact_email}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      contact_email: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">
                  Status
                </label>
                <DSSelect
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, status: v }))
                  }
                >
                  <SelectItem value="ativo" className="text-white">
                    Ativo
                  </SelectItem>
                  <SelectItem value="inativo" className="text-white">
                    Inativo
                  </SelectItem>
                </DSSelect>
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">
                  Valor (R$)
                </label>
                <DSInput
                  type="number"
                  value={form.monthly_value}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      monthly_value: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">
                  Notas
                </label>
                <DSInput
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      notes: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <DSButton
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancelar
            </DSButton>
            <DSButton
              onClick={save}
              disabled={!form.company_name}
            >
              {editing ? 'Salvar' : 'Criar'}
            </DSButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
