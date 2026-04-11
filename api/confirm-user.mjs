/**
 * Confirma usuário via Supabase Admin API
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cgpkfhrqprqptvehatad.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || '';

export async function confirmUserByEmail(email) {
  try {
    console.log('🔧 Confirmando usuário:', email);
    
    // Buscar usuário
    const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY
      }
    });

    if (!listRes.ok) {
      const error = await listRes.text();
      console.error('Erro ao buscar usuário:', error);
      return { success: false, error: 'Erro ao buscar usuário' };
    }

    const users = await listRes.json();
    if (!users.users || users.users.length === 0) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    const user = users.users[0];
    
    // Se já está confirmado, retornar sucesso
    if (user.email_confirmed_at) {
      return { success: true, message: 'Email já confirmado' };
    }

    // Confirmar email
    const updateRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_confirm: true,
        email_confirmed_at: new Date().toISOString()
      })
    });

    if (updateRes.ok) {
      console.log('✅ Email confirmado com sucesso!');
      return { success: true, message: 'Email confirmado' };
    } else {
      const error = await updateRes.text();
      console.error('Erro ao confirmar:', error);
      return { success: false, error: 'Erro ao confirmar email' };
    }
  } catch (err) {
    console.error('Erro:', err);
    return { success: false, error: err.message };
  }
}
