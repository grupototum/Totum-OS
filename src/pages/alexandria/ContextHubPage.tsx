import AppLayout from '@/components/layout/AppLayout';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { useAlexandria } from '@/hooks/useAlexandria';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import ContextHub from './ContextHub';

export default function ContextHubPage() {
  const { data, isLoading, error } = useAlexandria();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center max-w-md">
            <p className="text-destructive font-semibold">Erro ao carregar dados</p>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message || 'Não foi possível conectar ao Supabase'}
            </p>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageBreadcrumb />
      <div className="p-6">
        <ContextHub agents={data?.agents} />
      </div>
    </AppLayout>
  );
}
