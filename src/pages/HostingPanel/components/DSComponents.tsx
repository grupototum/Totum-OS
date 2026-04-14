import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// DS Card - Base container with optional accent corners
export const DSCard = ({
  children,
  className = '',
  accent = false,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) => (
  <div
    className={`relative bg-black border border-zinc-800 rounded-none ${className}`}
  >
    {accent && (
      <>
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ef233c]" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ef233c]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ef233c]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ef233c]" />
      </>
    )}
    {children}
  </div>
);

// DS Label - Mono uppercase label with brand red accent
export const DSLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-[10px] text-[#ef233c] tracking-widest uppercase font-bold">
    [ {children} ]
  </span>
);

// DS Button - Multiple variants with transitions
export const DSButton = ({
  children,
  onClick,
  disabled,
  variant = 'primary',
  className = '',
  size = 'default',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  className?: string;
  size?: 'default' | 'sm' | 'icon';
}) => {
  const base =
    'transition-all uppercase font-bold tracking-widest flex items-center justify-center gap-2 rounded-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
  const sizes = {
    default: 'text-[11px] py-3 px-5',
    sm: 'text-[10px] py-2 px-3',
    icon: 'p-2',
  };
  const variants = {
    primary:
      'bg-transparent border border-[#ef233c] text-[#ef233c] hover:bg-[#ef233c] hover:text-white',
    outline:
      'bg-transparent border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white',
    ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5',
    danger:
      'bg-transparent border border-red-800 text-red-500 hover:bg-red-600 hover:text-white',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// DS Input - Minimal input with underline style
export const DSInput = ({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) => (
  <input
    {...props}
    className={`w-full bg-transparent border-b border-white/10 py-2.5 text-white placeholder-zinc-600 focus:border-[#ef233c] focus:outline-none transition-colors font-sans text-sm ${className}`}
  />
);

// DS Select - Custom select with underline style
export const DSSelect = ({
  value,
  onValueChange,
  children,
  placeholder,
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
  placeholder?: string;
}) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className="bg-transparent border-b border-white/10 rounded-none text-white text-sm focus:ring-0 focus:border-[#ef233c] hover:border-zinc-600 transition-colors">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className="bg-zinc-900 border-zinc-800 rounded-none">
      {children}
    </SelectContent>
  </Select>
);

// DS Badge - Status indicator with color coding
export const DSBadge = ({
  status,
  label,
}: {
  status: string;
  label?: string;
}) => {
  const colors: Record<string, string> = {
    ativo: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    inativo: 'bg-zinc-500/10 text-zinc-500 border-zinc-600/30',
    running: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    stopped: 'bg-red-500/10 text-red-400 border-red-500/30',
    pago: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    pendente: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    atrasado: 'bg-red-500/10 text-red-400 border-red-500/30',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider border rounded-none ${
        colors[status] || 'bg-zinc-500/10 text-zinc-400 border-zinc-600/30'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {label || status}
    </span>
  );
};

// DS Dot - Small status indicator
export const DSDot = ({ active = false }: { active?: boolean }) => (
  <div
    className={`w-2 h-2 rounded-full ${
      active ? 'bg-[#ef233c]' : 'bg-zinc-700'
    } animate-pulse`}
  />
);

// DS Table - Generic table container
export const DSTable = ({
  headers,
  children,
  loading = false,
  empty = <div>No data</div>,
}: {
  headers: string[];
  children?: React.ReactNode;
  loading?: boolean;
  empty?: React.ReactNode;
}) => (
  <DSCard className="overflow-hidden">
    <div className="grid gap-2 px-4 py-3 border-b border-zinc-800 border-dashed bg-white/[0.02]">
      {headers.map((h) => (
        <div
          key={h}
          className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono font-bold"
        >
          {h}
        </div>
      ))}
    </div>
    {loading ? (
      <div className="p-8 text-center text-zinc-600 font-mono text-xs uppercase tracking-wider">
        Carregando dados...
      </div>
    ) : children ? (
      <div className="divide-y divide-zinc-800/50">{children}</div>
    ) : (
      empty
    )}
  </DSCard>
);

// DS Stat Card - Statistics display card
export const DSStatCard = ({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) => (
  <DSCard accent className="p-6">
    <div className="flex items-center justify-between border-b border-zinc-800 border-dashed pb-3 mb-4">
      <DSLabel>{label}</DSLabel>
      <DSDot active={accent} />
    </div>
    <div className="flex items-baseline gap-2">
      <p
        className={`text-3xl font-medium tracking-tighter font-sans ${
          accent ? 'text-[#ef233c]' : 'text-white'
        }`}
      >
        {value}
      </p>
      {sub && <span className="text-zinc-500 text-xs font-mono">{sub}</span>}
    </div>
  </DSCard>
);
