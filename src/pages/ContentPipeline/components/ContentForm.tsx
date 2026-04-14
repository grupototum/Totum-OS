import { Upload, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StageId, ApprovalStatus } from "../hooks";

const ASSIGNEES = ["Miguel", "Liz", "Jarvis"];

interface ContentFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  assignee: string;
  onAssigneeChange: (value: string) => void;
  approvalStatus: ApprovalStatus;
  onApprovalStatusChange: (value: ApprovalStatus) => void;
  uploadingImage: boolean;
  previewUrl: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  onImageClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  errors: Record<string, string>;
  onClearError: (field: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ContentForm({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  assignee,
  onAssigneeChange,
  approvalStatus,
  onApprovalStatusChange,
  uploadingImage,
  previewUrl,
  onImageUpload,
  onClearImage,
  onImageClick,
  fileInputRef,
  errors,
  onClearError,
  onSubmit,
  isLoading,
}: ContentFormProps) {
  return (
    <div className="space-y-4 pt-2">
      <div>
        <Label className="text-xs text-muted-foreground">Título *</Label>
        <Input
          value={title}
          onChange={(e) => {
            onTitleChange(e.target.value);
            if (errors.title) onClearError("title");
          }}
          placeholder="Ex: Review do produto X"
          className={`mt-1 bg-secondary border ${
            errors.title
              ? "border-destructive focus-visible:ring-destructive"
              : "border-border"
          }`}
        />
        {errors.title && (
          <p className="text-xs text-destructive mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">
          Descrição / Roteiro
        </Label>
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Descreva o conteúdo ou cole o roteiro..."
          className="mt-1 bg-secondary border-border min-h-[80px]"
        />
      </div>

      {/* Image upload */}
      <div>
        <Label className="text-xs text-muted-foreground">
          Thumbnail / Imagem
        </Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
        {previewUrl ? (
          <div className="mt-1 relative rounded-lg overflow-hidden h-36">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            {uploadingImage && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <button
              onClick={onClearImage}
              className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={onImageClick}
            className="mt-1 w-full h-24 rounded-lg border border-dashed border-border bg-secondary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span className="text-xs">Clique para enviar</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Responsável</Label>
          <Select value={assignee} onValueChange={onAssigneeChange}>
            <SelectTrigger className="mt-1 bg-secondary border-border text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASSIGNEES.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Aprovação</Label>
          <Select
            value={approvalStatus}
            onValueChange={(v) => onApprovalStatusChange(v as ApprovalStatus)}
          >
            <SelectTrigger className="mt-1 bg-secondary border-border text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={!title.trim() || uploadingImage || isLoading}
        className="w-full bg-gradient-to-r from-primary to-orange-400 hover:opacity-90 text-primary-foreground"
      >
        Criar Conteúdo
      </Button>
    </div>
  );
}
