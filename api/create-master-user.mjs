#!/usr/bin/env node

/**
 * Script para criar usuário master no Supabase
 * Execute: node api/create-master-user.mjs
 */

const SUPABASE_URL = 'https://cgpkfhrqprqptvehatad.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

const MASTER_EMAIL = 'totumpersonalizados@gmail.com';
const MASTER_PASSWORD = 'Totum@Apps120103';
const MASTER_NAME = 'Administrador Totum';

async function createMasterUser() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║              👤 CRIANDO USUÁRIO MASTER                         ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  try {
    // Usar a API REST do Supabase para criar usuário
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: MASTER_EMAIL,
        password: MASTER_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: MASTER_NAME,
          role: 'admin'
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Usuário master criado com sucesso!');
      console.log('');
      console.log('📧 Email:', MASTER_EMAIL);
      console.log('🔑 Senha:', MASTER_PASSWORD);
      console.log('');
      console.log('════════════════════════════════════════════════════════════════');
    } else {
      const error = await response.json();
      if (error.message && error.message.includes('already')) {
        console.log('⚠️  Usuário já existe!');
        console.log('');
        console.log('📧 Email:', MASTER_EMAIL);
        console.log('🔑 Senha: [já configurada]');
      } else {
        console.error('❌ Erro ao criar usuário:', error);
        console.log('');
        console.log('Nota: Para criar usuário via API, é necessário');
        console.log('      a SERVICE_ROLE_KEY do Supabase.');
      }
    }
  } catch (err) {
    console.error('❌ Erro:', err.message);
    console.log('');
    console.log('Alternativa: Crie o usuário manualmente em:');
    console.log('https://app.supabase.com/project/cgpkfhrqprqptvehatad/auth/users');
  }
}

// Verificar se foi executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createMasterUser();
}

export { createMasterUser };
