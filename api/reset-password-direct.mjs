#!/usr/bin/env node

/**
 * Script para redefinir senha diretamente (sem e-mail)
 * Útil quando o SMTP não está configurado
 * 
 * Uso: node api/reset-password-direct.mjs <email> <nova_senha>
 */

const SUPABASE_URL = 'https://cgpkfhrqprqptvehatad.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || '';

async function resetPasswordDirect(email, newPassword) {
  console.log('🔑 Redefinindo senha para:', email);
  
  try {
    // 1. Buscar usuário pelo e-mail
    const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      }
    });

    if (!listRes.ok) {
      console.error('❌ Erro ao buscar usuário:', await listRes.text());
      return false;
    }

    const users = await listRes.json();
    if (!users || users.length === 0) {
      console.error('❌ Usuário não encontrado');
      return false;
    }

    const userId = users[0].id;
    console.log('✅ Usuário encontrado:', userId);

    // 2. Atualizar senha
    const updateRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: newPassword,
        email_confirm: true
      })
    });

    if (updateRes.ok) {
      console.log('✅ Senha redefinida com sucesso!');
      return true;
    } else {
      console.error('❌ Erro ao redefinir senha:', await updateRes.text());
      return false;
    }
  } catch (err) {
    console.error('❌ Erro:', err.message);
    return false;
  }
}

// Se executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const email = process.argv[2];
  const password = process.argv[3];
  
  if (!email || !password) {
    console.log('Uso: node reset-password-direct.mjs <email> <nova_senha>');
    process.exit(1);
  }
  
  resetPasswordDirect(email, password).then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { resetPasswordDirect };
