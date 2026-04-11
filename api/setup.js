/**
 * Setup API - Cria usuário master na primeira execução
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cgpkfhrqprqptvehatad.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

const MASTER_USER = {
  email: 'totumpersonalizados@gmail.com',
  password: 'Totum@Apps120103',
  name: 'Administrador Totum'
};

export async function setupMasterUser() {
  try {
    console.log('🔧 Verificando usuário master...');
    
    // Tentar fazer login com o usuário master
    const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: MASTER_USER.email,
        password: MASTER_USER.password
      })
    });

    if (loginRes.ok) {
      console.log('✅ Usuário master já existe e está configurado');
      return { success: true, message: 'Usuário já existe' };
    }

    // Se não existe, criar via signUp
    console.log('👤 Criando usuário master...');
    const signupRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: MASTER_USER.email,
        password: MASTER_USER.password,
        data: {
          full_name: MASTER_USER.name,
          role: 'admin'
        }
      })
    });

    if (signupRes.ok) {
      console.log('✅ Usuário master criado com sucesso!');
      console.log('');
      console.log('📧 Email:', MASTER_USER.email);
      console.log('🔑 Senha:', MASTER_USER.password);
      return { success: true, message: 'Usuário criado' };
    } else {
      const error = await signupRes.json();
      console.log('⚠️  Não foi possível criar usuário automaticamente');
      console.log('   Erro:', error.message || 'Erro desconhecido');
      return { success: false, error: error.message };
    }
  } catch (err) {
    console.error('❌ Erro no setup:', err.message);
    return { success: false, error: err.message };
  }
}

// Se executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupMasterUser().then(result => {
    console.log('');
    if (result.success) {
      console.log('════════════════════════════════════════════════════════════════');
      console.log('✅ SETUP CONCLUÍDO!');
      console.log('');
      console.log('📧 Email:', MASTER_USER.email);
      console.log('🔑 Senha:', MASTER_USER.password);
      console.log('════════════════════════════════════════════════════════════════');
    } else {
      console.log('════════════════════════════════════════════════════════════════');
      console.log('⚠️  SETUP INCOMPLETO');
      console.log('');
      console.log('Crie o usuário manualmente em:');
      console.log('https://app.supabase.com/project/cgpkfhrqprqptvehatad/auth/users');
      console.log('════════════════════════════════════════════════════════════════');
    }
    process.exit(0);
  });
}
