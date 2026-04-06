// src/hooks/useFormValidation.ts
// ✅ NOVO: Hook reutilizável para validação de formulários

import { useState, useCallback } from 'react';

// ============================================
// TIPOS
// ============================================

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  date?: boolean;
  custom?: (value: any, formData?: any) => boolean;
  message: string;
}

export interface ValidationSchema {
  [field: string]: ValidationRule[];
}

export interface FormErrors {
  [field: string]: string;
}

export interface UseFormValidationReturn<T> {
  errors: FormErrors;
  touched: Record<string, boolean>;
  isValid: boolean;
  validateField: (name: keyof T, value: any, formData?: T) => string;
  validateForm: (data: T) => boolean;
  handleBlur: (name: keyof T, value: any) => void;
  handleChange: (name: keyof T, value: any) => void;
  resetValidation: () => void;
  setFieldError: (name: keyof T, error: string) => void;
  clearFieldError: (name: keyof T) => void;
}

// ============================================
// HOOK PRINCIPAL
// ============================================

export const useFormValidation = <T extends Record<string, any>>(
  schema: ValidationSchema
): UseFormValidationReturn<T> => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((
    name: keyof T, 
    value: any, 
    formData?: T
  ): string => {
    const rules = schema[name as string];
    if (!rules) return '';

    for (const rule of rules) {
      // Required
      if (rule.required) {
        const isEmpty = value === null || value === undefined || 
                       (typeof value === 'string' && value.trim() === '') ||
                       (Array.isArray(value) && value.length === 0);
        if (isEmpty) {
          return rule.message;
        }
      }

      // Skip other validations if empty and not required
      if (!value && !rule.required) continue;

      // MinLength
      if (rule.minLength !== undefined && value?.length < rule.minLength) {
        return rule.message;
      }

      // MaxLength
      if (rule.maxLength !== undefined && value?.length > rule.maxLength) {
        return rule.message;
      }

      // Min (number)
      if (rule.min !== undefined && Number(value) < rule.min) {
        return rule.message;
      }

      // Max (number)
      if (rule.max !== undefined && Number(value) > rule.max) {
        return rule.message;
      }

      // Pattern (regex)
      if (rule.pattern && !rule.pattern.test(String(value))) {
        return rule.message;
      }

      // Email
      if (rule.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) {
          return rule.message;
        }
      }

      // URL
      if (rule.url) {
        try {
          new URL(String(value));
        } catch {
          return rule.message;
        }
      }

      // Date
      if (rule.date) {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return rule.message;
        }
      }

      // Custom validation
      if (rule.custom && !rule.custom(value, formData)) {
        return rule.message;
      }
    }

    return '';
  }, [schema]);

  const validateForm = useCallback((data: T): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(schema).forEach((field) => {
      const error = validateField(field as keyof T, data[field], data);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    // Marcar todos como touched
    const allTouched = Object.keys(schema).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    return isValid;
  }, [schema, validateField]);

  const handleBlur = useCallback((name: keyof T, value: any) => {
    setTouched(prev => ({ ...prev, [name as string]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name as string]: error }));
  }, [validateField]);

  const handleChange = useCallback((name: keyof T, value: any) => {
    if (touched[name as string]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name as string]: error }));
    }
  }, [touched, validateField]);

  const resetValidation = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name as string]: error }));
  }, []);

  const clearFieldError = useCallback((name: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name as string];
      return newErrors;
    });
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    touched,
    isValid,
    validateField,
    validateForm,
    handleBlur,
    handleChange,
    resetValidation,
    setFieldError,
    clearFieldError
  };
};

// ============================================
// SCHEMAS PRONTOS
// ============================================

export const tarefaValidationSchema: ValidationSchema = {
  titulo: [
    { required: true, message: 'Título é obrigatório' },
    { minLength: 3, message: 'Título deve ter pelo menos 3 caracteres' },
    { maxLength: 100, message: 'Título deve ter no máximo 100 caracteres' }
  ],
  descricao: [
    { maxLength: 500, message: 'Descrição deve ter no máximo 500 caracteres' }
  ],
  responsavel: [
    { required: true, message: 'Responsável é obrigatório' }
  ],
  prioridade: [
    { required: true, message: 'Prioridade é obrigatória' }
  ],
  status: [
    { required: true, message: 'Status é obrigatório' }
  ],
  data_limite: [
    { required: true, message: 'Data limite é obrigatória' },
    { 
      custom: (value: string) => {
        if (!value) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputDate = new Date(value);
        return inputDate >= today;
      },
      message: 'Data limite não pode ser no passado'
    }
  ]
};

export const projetoValidationSchema: ValidationSchema = {
  nome: [
    { required: true, message: 'Nome é obrigatório' },
    { minLength: 3, message: 'Nome deve ter pelo menos 3 caracteres' },
    { maxLength: 100, message: 'Nome deve ter no máximo 100 caracteres' }
  ],
  descricao: [
    { maxLength: 1000, message: 'Descrição deve ter no máximo 1000 caracteres' }
  ],
  responsavel_id: [
    { required: true, message: 'Responsável é obrigatório' }
  ],
  data_inicio: [
    { required: true, message: 'Data de início é obrigatória' }
  ],
  data_fim: [
    { 
      custom: (value: string, formData?: any) => {
        if (!value || !formData?.data_inicio) return true;
        return new Date(value) >= new Date(formData.data_inicio);
      },
      message: 'Data de término deve ser após a data de início'
    }
  ]
};

export const comentarioValidationSchema: ValidationSchema = {
  conteudo: [
    { required: true, message: 'Comentário não pode estar vazio' },
    { minLength: 1, message: 'Comentário não pode estar vazio' },
    { maxLength: 1000, message: 'Comentário deve ter no máximo 1000 caracteres' }
  ]
};

export const subtarefaValidationSchema: ValidationSchema = {
  titulo: [
    { required: true, message: 'Título é obrigatório' },
    { minLength: 1, message: 'Título não pode estar vazio' },
    { maxLength: 200, message: 'Título deve ter no máximo 200 caracteres' }
  ]
};

export const loginValidationSchema: ValidationSchema = {
  email: [
    { required: true, message: 'Email é obrigatório' },
    { email: true, message: 'Email inválido' }
  ],
  password: [
    { required: true, message: 'Senha é obrigatória' },
    { minLength: 6, message: 'Senha deve ter pelo menos 6 caracteres' }
  ]
};

export default useFormValidation;
