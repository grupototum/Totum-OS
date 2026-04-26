// Validações de formulários para Totum OS

/**
 * Valida formato de email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida CNPJ (formato e dígitos verificadores)
 */
export const isValidCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/[^\d]/g, "");
  
  if (cleaned.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais (CNPJ inválido)
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  // Validação dos dígitos verificadores
  let size = cleaned.length - 2;
  let numbers = cleaned.substring(0, size);
  const digits = cleaned.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  size = size + 1;
  numbers = cleaned.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
};

/**
 * Valida telefone brasileiro (com DDD)
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[^\d]/g, "");
  // Celular: 11 dígitos (com 9) ou fixo: 10 dígitos
  return cleaned.length >= 10 && cleaned.length <= 11;
};

/**
 * Valida URL
 */
export const isValidURL = (url: string): boolean => {
  if (!url) return true; // URL é opcional
  try {
    new URL(url);
    return true;
  } catch {
    // Tenta adicionar https:// se não tiver protocolo
    try {
      new URL(`https://${url}`);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Valida senha (mínimo 6 caracteres)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Valida se campo está preenchido
 */
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Sanitiza URL (adiciona https:// se necessário)
 */
export const sanitizeURL = (url: string): string => {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};

// Tipos para erros de validação
export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Valida formulário de login
 */
export const validateLoginForm = (email: string, password: string): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!isRequired(email)) {
    errors.email = "E-mail é obrigatório";
  } else if (!isValidEmail(email)) {
    errors.email = "E-mail inválido";
  }
  
  if (!isRequired(password)) {
    errors.password = "Senha é obrigatória";
  }
  
  return errors;
};

/**
 * Valida formulário de registro
 */
export const validateSignUpForm = (
  email: string,
  password: string,
  confirmPassword: string,
  name?: string
): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (name !== undefined && !isRequired(name)) {
    errors.name = "Nome é obrigatório";
  }
  
  if (!isRequired(email)) {
    errors.email = "E-mail é obrigatório";
  } else if (!isValidEmail(email)) {
    errors.email = "E-mail inválido";
  }
  
  if (!isRequired(password)) {
    errors.password = "Senha é obrigatória";
  } else if (!isValidPassword(password)) {
    errors.password = "Senha deve ter pelo menos 6 caracteres";
  }
  
  if (password !== confirmPassword) {
    errors.confirmPassword = "As senhas não coincidem";
  }
  
  return errors;
};

/**
 * Valida formulário de recuperação de senha
 */
export const validateForgotPasswordForm = (email: string): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!isRequired(email)) {
    errors.email = "E-mail é obrigatório";
  } else if (!isValidEmail(email)) {
    errors.email = "E-mail inválido";
  }
  
  return errors;
};

/**
 * Valida formulário de redefinição de senha
 */
export const validateResetPasswordForm = (password: string, confirmPassword: string): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!isRequired(password)) {
    errors.password = "Senha é obrigatória";
  } else if (!isValidPassword(password)) {
    errors.password = "Senha deve ter pelo menos 6 caracteres";
  }
  
  if (password !== confirmPassword) {
    errors.confirmPassword = "As senhas não coincidem";
  }
  
  return errors;
};

/**
 * Valida dados do cliente (etapa 0 - informações básicas)
 */
export const validateClientBasicInfo = (
  company_name: string,
  cnpj: string,
  contact_name: string,
  email: string,
  phone: string,
  website?: string
): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!isRequired(company_name)) {
    errors.company_name = "Nome da empresa é obrigatório";
  }
  
  if (!isRequired(cnpj)) {
    errors.cnpj = "CNPJ é obrigatório";
  } else if (!isValidCNPJ(cnpj)) {
    errors.cnpj = "CNPJ inválido";
  }
  
  if (!isRequired(contact_name)) {
    errors.contact_name = "Nome do responsável é obrigatório";
  }
  
  if (!isRequired(email)) {
    errors.email = "E-mail é obrigatório";
  } else if (!isValidEmail(email)) {
    errors.email = "E-mail inválido";
  }
  
  if (!isRequired(phone)) {
    errors.phone = "Telefone é obrigatório";
  } else if (!isValidPhone(phone)) {
    errors.phone = "Telefone inválido";
  }
  
  if (website && !isValidURL(website)) {
    errors.website = "URL inválida";
  }
  
  return errors;
};

/**
 * Valida tarefa
 */
export const validateTask = (title: string): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!isRequired(title)) {
    errors.title = "Título é obrigatório";
  }
  
  return errors;
};

/**
 * Valida conteúdo do pipeline
 */
export const validateContentCard = (title: string): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!isRequired(title)) {
    errors.title = "Título é obrigatório";
  }
  
  return errors;
};
