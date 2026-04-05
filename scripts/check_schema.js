const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cgpkfhrqprqptvehatad.supabase.co';
const supabaseKey = 'sb_publishable_gjkalaMwShdo-vS4p3zvnw_RHVvcMSr';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  // Tentar inserir uma tarefa mínima para ver o erro
  console.log('Verificando schema da tabela tarefas...\n');
  
  // Consultar uma linha existente (se houver) para ver as colunas
  const { data, error } = await supabase
    .from('tarefas')
    .select('*')
    .limit(1);
  
  if (data && data.length > 0) {
    console.log('Colunas existentes (baseado em dados):');
    console.log(Object.keys(data[0]));
  } else {
    console.log('Tabela vazia ou não encontrada. Tentando descobrir schema pelo erro...\n');
    
    // Tentar inserir com campos mínimos
    const testFields = [
      { titulo: 'test' },
      { titulo: 'test', descricao: 'test' },
      { title: 'test', description: 'test' }
    ];
    
    for (const fields of testFields) {
      const { error } = await supabase.from('tarefas').insert(fields);
      if (error && error.message.includes('Could not find')) {
        console.log('Erro:', error.message);
      } else if (error) {
        console.log('Outro erro:', error);
      } else {
        console.log('Sucesso com campos:', Object.keys(fields));
        // Limpar teste
        await supabase.from('tarefas').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        break;
      }
    }
  }
}

checkSchema().catch(console.error);
