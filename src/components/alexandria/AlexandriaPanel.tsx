/**
 * AlexandriaPanel - Gerenciamento de documentos RAG
 * Interface para adicionar, editar e visualizar documentos de contexto
 */

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  FileText, 
  Palette, 
  Users, 
  Clock, 
  Info,
  Trash2,
  Edit2,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { listDocuments, addDocument } from '@/services/embeddingService';
import type { RagDocument } from '@/types/alexandria';

const documentTypeIcons = {
  design_system: Palette,
  pops: FileText,
  slas: Clock,
  client_info: Users,
  execution_history: Info
};

const documentTypeLabels = {
  design_system: 'Design System',
  pops: 'POPs',
  slas: 'SLAs',
  client_info: 'Cliente',
  execution_history: 'Histórico'
};

const documentTypeColors = {
  design_system: 'bg-purple-100 text-purple-800',
  pops: 'bg-blue-100 text-blue-800',
  slas: 'bg-orange-100 text-orange-800',
  client_info: 'bg-green-100 text-green-800',
  execution_history: 'bg-gray-100 text-gray-800'
};

export function AlexandriaPanel() {
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<RagDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Form state
  const [newDocType, setNewDocType] = useState<string>('pops');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Carregar documentos
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    const docs = await listDocuments(undefined, 100);
    setDocuments(docs);
    setFilteredDocs(docs);
    setIsLoading(false);
  };

  // Filtrar documentos
  useEffect(() => {
    let filtered = documents;
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(d => d.type === selectedType);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(query) ||
        d.content.toLowerCase().includes(query)
      );
    }
    
    setFilteredDocs(filtered);
  }, [documents, selectedType, searchQuery]);

  // Adicionar documento
  const handleAddDocument = async () => {
    if (!newDocTitle.trim() || !newDocContent.trim()) return;
    
    setIsSaving(true);
    
    const newDoc = await addDocument(
      newDocType,
      newDocTitle,
      newDocContent,
      { created_from: 'alexandria_panel', created_at: new Date().toISOString() }
    );
    
    if (newDoc) {
      await loadDocuments();
      setShowAddDialog(false);
      resetForm();
    }
    
    setIsSaving(false);
  };

  const resetForm = () => {
    setNewDocType('pops');
    setNewDocTitle('');
    setNewDocContent('');
  };

  const getIcon = (type: string) => {
    const Icon = documentTypeIcons[type as keyof typeof documentTypeIcons] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Alexandria 📚</CardTitle>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Documento</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tipo</label>
                    <Select value={newDocType} onValueChange={setNewDocType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(documentTypeLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Título</label>
                    <Input
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      placeholder="Nome do documento"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Conteúdo</label>
                  <Textarea
                    value={newDocContent}
                    onChange={(e) => setNewDocContent(e.target.value)}
                    placeholder="Cole o conteúdo do documento aqui..."
                    rows={10}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddDialog(false);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddDocument}
                    disabled={isSaving || !newDocTitle.trim() || !newDocContent.trim()}
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Documento'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <p className="text-sm text-muted-foreground mt-1">
          Base de conhecimento para contexto dos agentes
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(documentTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lista de documentos */}
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Carregando...
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <BookOpen className="h-12 w-12 mb-2 opacity-50" />
              <p>Nenhum documento encontrado</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDocs.map((doc) => (
                <Card key={doc.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getIcon(doc.type)}
                          <span className="font-medium truncate">{doc.title}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {doc.content}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="secondary" 
                            className={documentTypeColors[doc.type as keyof typeof documentTypeColors]}
                          >
                            {documentTypeLabels[doc.type as keyof typeof documentTypeLabels]}
                          </Badge>
                          
                          <span className="text-xs text-muted-foreground">
                            {new Date(doc.updatedAt).toLocaleDateString('pt-BR')}
                          </span>
                          
                          {doc.embedding ? (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Indexado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-yellow-600">
                              Sem embedding
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-1 ml-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {/* Estatísticas */}
        <div className="flex items-center justify-between pt-2 border-t text-sm text-muted-foreground">
          <span>{filteredDocs.length} documento(s)</span>
          <span>{documents.filter(d => d.embedding).length} com embedding</span>
        </div>
      </CardContent>
    </Card>
  );
}
