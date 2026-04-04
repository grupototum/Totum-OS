import { 
  BookOpen, 
  Search,
  TrendingUp,
  FileText,
  Database,
  Globe,
  BarChart3,
  Layers
} from 'lucide-react';
import { MetricCard } from './shared/MetricCard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { mockDocumentos, mockMetricasConhecimento, mockDominiosAcessados } from '../../data/mock';

export function DashboardConhecimento() {
  const totalDocumentos = mockDocumentos.length;
  const totalConsultas = mockDocumentos.reduce((acc, d) => acc + d.consultas, 0);
  const tamanhoTotal = mockDocumentos.reduce((acc, d) => acc + d.tamanho, 0);
  
  const documentosRecentes = [...mockDocumentos]
    .sort((a, b) => new Date(b.indexadoEm).getTime() - new Date(a.indexadoEm).getTime())
    .slice(0, 5);
  
  const documentosMaisConsultados = [...mockDocumentos]
    .sort((a, b) => b.consultas - a.consultas)
    .slice(0, 5);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const colors = ['#4A4A45', '#5A8F5A', '#C4A35A', '#5A7A9C', '#7A6A9C', '#8A5A5A'];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tot-text">Dashboard de Conhecimento 📚</h1>
          <p className="text-tot-muted">Alexandria - Base de conhecimento da Totum</p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Documentos Indexados"
          value={totalDocumentos}
          subtitle="Total na Alexandria"
          trend="up"
          trendValue="+6 este mês"
          icon={<FileText className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Total de Consultas"
          value={totalConsultas.toLocaleString()}
          subtitle="Acessos aos documentos"
          trend="up"
          trendValue="+23% este mês"
          icon={<Search className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Tamanho da Base"
          value={formatSize(tamanhoTotal)}
          subtitle="Armazenamento utilizado"
          icon={<Database className="w-5 h-5" />}
        />
        
        <MetricCard
          title="Domínios"
          value={mockDominiosAcessados.length}
          subtitle="Categorias de conhecimento"
          icon={<Globe className="w-5 h-5" />}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tot-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-tot-primary" />
            <h2 className="text-lg font-semibold text-tot-text">Crescimento da Base</h2>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockMetricasConhecimento}>
                <defs>
                  <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A4A45" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4A4A45" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5A8F5A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5A8F5A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4D4CF" />
                <XAxis 
                  dataKey="data" 
                  stroke="#6B6B66"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis 
                  stroke="#6B6B66"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#F5F5F0',
                    border: '1px solid #D4D4CF',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                />
                <Legend />
                
                <Area 
                  type="monotone" 
                  dataKey="documentos" 
                  name="Documentos"
                  stroke="#4A4A45" 
                  fillOpacity={1} 
                  fill="url(#colorDocs)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="consultas" 
                  name="Consultas"
                  stroke="#5A8F5A" 
                  fillOpacity={1} 
                  fill="url(#colorQueries)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="tot-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-tot-primary" />
            <h2 className="text-lg font-semibold text-tot-text">Domínios Mais Acessados</h2>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDominiosAcessados} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4D4CF" horizontal={false} />
                <XAxis 
                  type="number" 
                  stroke="#6B6B66"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  type="category" 
                  dataKey="nome"
                  stroke="#6B6B66"
                  fontSize={12}
                  tickLine={false}
                  width={90}
                  tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#F5F5F0',
                    border: '1px solid #D4D4CF',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value} acessos`, 'Consultas']}
                />
                <Bar dataKey="acessos" radius={[0, 4, 4, 0]}>
                  {mockDominiosAcessados.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Listas de Documentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tot-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-tot-primary" />
            <h2 className="text-lg font-semibold text-tot-text">Documentos Mais Consultados</h2>
          </div>
          
          <div className="space-y-3">
            {documentosMaisConsultados.map((doc, index) => (
              <div 
                key={doc.id}
                className="flex items-center justify-between p-3 bg-tot-bg rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-tot-muted w-6">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-tot-text line-clamp-1">{doc.titulo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-tot-primary/10 text-tot-primary rounded-full">
                        {doc.dominio}
                      </span>
                      <span className="text-xs text-tot-muted">{formatSize(doc.tamanho)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-tot-primary">
                  <Search className="w-4 h-4" />
                  <span className="font-medium">{doc.consultas}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tot-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-tot-primary" />
            <h2 className="text-lg font-semibold text-tot-text">Documentos Recentes</h2>
          </div>
          
          <div className="space-y-3">
            {documentosRecentes.map((doc) => (
              <div 
                key={doc.id}
                className="flex items-center justify-between p-3 bg-tot-bg rounded-lg"
              >
                <div>
                  <p className="font-medium text-tot-text line-clamp-1">{doc.titulo}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-tot-primary/10 text-tot-primary rounded-full">
                      {doc.dominio}
                    </span>
                    <span className="text-xs text-tot-muted">{formatSize(doc.tamanho)}</span>
                  </div>
                </div>
                
                <span className="text-xs text-tot-muted">
                  {new Date(doc.indexadoEm).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'short' 
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
