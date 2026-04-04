// Página /agents - Integração do DashboardGeral
// Esta página pode ser importada e usada em projetos Next.js, React Router, etc.

import { DashboardGeral } from '../components/dashboards/DashboardGeral';

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-tot-bg">
      <DashboardGeral />
    </div>
  );
}

// Exportação nomeada também disponível
export { DashboardGeral };
