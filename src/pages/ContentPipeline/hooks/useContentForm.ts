import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateContentCard, type ValidationErrors } from "@/lib/validation";
import type { ApprovalStatus } from "./useContentPipeline";

/**
 * Hook for managing content form state
 * Handles form inputs, validation, and image uploads
 */
export function useContentForm(onSuccess?: () => void) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("Miguel");
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>(
    "pending"
  );

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // Validation state
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Validate form
  const validate = () => {
    const validationErrors = validateContentCard(title);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("content-thumbnails")
        .upload(path, file);

      if (error) {
        toast({
          title: "Erro no upload",
          description: error.message,
          variant: "destructive",
        });
        setPreviewUrl(null);
      } else {
        const { data: urlData } = supabase.storage
          .from("content-thumbnails")
          .getPublicUrl(path);
        setUploadedUrl(urlData.publicUrl);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  // Reset form to initial state
  const reset = () => {
    setTitle("");
    setDescription("");
    setAssignee("Miguel");
    setApprovalStatus("pending");
    setPreviewUrl(null);
    setUploadedUrl(null);
    setErrors({});
    onSuccess?.();
  };

  // Clear image preview
  const clearImage = () => {
    setPreviewUrl(null);
    setUploadedUrl(null);
  };

  // Trigger file input click
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return {
    // Form inputs
    title,
    setTitle,
    description,
    setDescription,
    assignee,
    setAssignee,
    approvalStatus,
    setApprovalStatus,

    // Image upload
    fileInputRef,
    uploadingImage,
    previewUrl,
    uploadedUrl,
    handleImageUpload,
    clearImage,
    openFilePicker,

    // Validation
    errors,
    setErrors,
    validate,

    // Actions
    reset,
  };
}
