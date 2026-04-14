import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import {
  ClientActions,
  STATUS_BADGE,
  INDUSTRY_COLORS,
  anim,
  timeAgo,
} from "./ClientUtilities";
import type { Client } from "../hooks";

interface ClientListViewProps {
  clients: Client[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onDetail: (client: Client) => void;
}

export function ClientListView({
  clients,
  selected,
  onToggleSelect,
  onToggleAll,
  onDelete,
  onStatusChange,
  onDetail,
}: ClientListViewProps) {
  return (
    <motion.div {...anim(2)}>
      <Card className="border-border/40 bg-card/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="p-3 text-left w-8">
                  <Checkbox
                    checked={selected.size === clients.length && clients.length > 0}
                    onCheckedChange={onToggleAll}
                  />
                </th>
                <th className="p-3 text-left text-[10px] text-muted-foreground uppercase font-medium">
                  Empresa
                </th>
                <th className="p-3 text-left text-[10px] text-muted-foreground uppercase font-medium hidden md:table-cell">
                  Responsável
                </th>
                <th className="p-3 text-left text-[10px] text-muted-foreground uppercase font-medium hidden lg:table-cell">
                  Ramo
                </th>
                <th className="p-3 text-left text-[10px] text-muted-foreground uppercase font-medium">
                  Status
                </th>
                <th className="p-3 text-left text-[10px] text-muted-foreground uppercase font-medium hidden lg:table-cell">
                  Cadastro
                </th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border/20 hover:bg-secondary/30 transition-colors cursor-pointer"
                  onClick={() => onDetail(c)}
                >
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.has(c.id)}
                      onCheckedChange={() => onToggleSelect(c.id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                        style={{
                          backgroundColor: (c.primary_color ?? "#f76926") + "20",
                          color: c.primary_color ?? "#f76926",
                        }}
                      >
                        {c.company_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {c.company_name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {c.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="text-foreground text-xs">
                        {c.contact_name ?? "—"}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    {c.industry && (
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          INDUSTRY_COLORS[c.industry] ??
                          "bg-muted text-muted-foreground"
                        }`}
                      >
                        {c.industry}
                      </Badge>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] capitalize ${STATUS_BADGE[c.status]}`}
                    >
                      {c.status === "active"
                        ? "Ativo"
                        : c.status === "pending"
                          ? "Pendente"
                          : "Inativo"}
                    </Badge>
                  </td>
                  <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground">
                    {timeAgo(c.created_at)}
                  </td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <ClientActions
                      client={c}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                      onView={() => onDetail(c)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
