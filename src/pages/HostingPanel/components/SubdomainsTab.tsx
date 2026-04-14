import React from 'react';
import { Globe, Trash2 } from 'lucide-react';
import { useHostingSubdomains } from '../hooks';
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

export function SubdomainsTab() {
  const { subdomains, clients, loading, form, setForm, DOMAINS, create, remove } =
    useHostingSubdomains();

  return (
    <div className="space-y-5">
      <DSCard accent className="p-6">
        <div className="flex items-center justify-between border-b border-zinc-800 border-dashed pb-3 mb-5">
          <DSLabel>Novo Subdomínio</DSLabel>
          <DSDot active />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">
              Cliente
            </label>
            <DSSelect
              value={form.client_id}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, client_id: v }))
              }
              placeholder="Selecionar..."
            >
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-white">
                  {c.company_name}
                </SelectItem>
              ))}
            </DSSelect>
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">
              Subdomínio
            </label>
            <DSInput
              value={form.subdomain}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  subdomain: e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, ''),
                }))
              }
              placeholder="meu-app"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">
              Domínio Base
            </label>
            <DSSelect
              value={form.base_domain}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, base_domain: v }))
              }
            >
              {DOMAINS.map((d) => (
                <SelectItem key={d} value={d} className="text-white">
                  {d}
                </SelectItem>
              ))}
            </DSSelect>
          </div>
        </div>
        <DSButton
          onClick={create}
          disabled={!form.client_id || !form.subdomain}
          className="mt-5"
        >
          Criar Subdomínio
        </DSButton>
      </DSCard>

      <DSTable
        headers={['Subdomínio', 'Domínio Base', 'URL Completa', 'Status', 'Ações']}
        loading={loading}
        empty={
          <div className="p-10 text-center">
            <Globe className="h-6 w-6 mx-auto mb-2 text-zinc-700" />
            <p className="text-zinc-600 font-mono text-xs uppercase tracking-wider">
              Nenhum subdomínio encontrado
            </p>
          </div>
        }
      >
        {subdomains.length > 0 &&
          subdomains.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-5 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors"
            >
              <div className="font-mono text-sm text-white">{s.subdomain}</div>
              <div className="text-sm text-zinc-400">{s.base_domain}</div>
              <div className="text-sm text-[#ef233c] font-mono">{s.full_url}</div>
              <div>
                <DSBadge status={s.status} />
              </div>
              <div>
                <DSButton
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(s.id)}
                  className="hover:!text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </DSButton>
              </div>
            </div>
          ))}
      </DSTable>
    </div>
  );
}
