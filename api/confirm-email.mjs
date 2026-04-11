#!/usr/bin/env node

/**
 * Script para confirmar e-mail de usuário
 * Útil quando o usuário foi criado sem confirmação de e-mail
 * 
 * Uso: node api/confirm-email.mjs <email>
 */

const SUPABASE_URL = 'https://cgpkfhrqprqptvehatad.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || '';

async function confirmUserEmail(email) {
  console.log('📧 Confirmando e-mail para:', email);
  
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
    if (!users || users.users.length === 0) {
      console.error('❌ Usuário não encontrado');
      return false;
    }

    const user = users.users[0];
    const userId = user.id;
    
    console.log('✅ Usuário encontrado:', userId);
    console.log('   Email confirmado atual:', user.email_confirmed_at ? 'Sim' : 'Não');

    // 2. Atualizar usuário para confirmar email
    const updateRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_confirm: true
      })
    });

    if (updateRes.ok) {
      console.log('✅ E-mail confirmado com sucesso!');
      return true;
    } else {
      console.error('❌ Erro ao confirmar e-mail:', await updateRes.text());
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
  
  if (!email) {
    console.log('Uso: node confirm-email.mjs <email>');
    process.exit(1);
  }
  
  confirmUserEmail(email).then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { confirmUserEmail };
