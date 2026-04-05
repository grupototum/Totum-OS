const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cgpkfhrqprqptvehatad.supabase.co';
const supabaseKey = 'sb_publishable_gjkalaMwShdo-vS4p3zvnw_RHVvcMSr';
const supabase = createClient(supabaseUrl, supabaseKey);

async function discoverSchema() {
  const possibleFields = [
    'titulo', 'title',
    'descricao', 'description', 'desc',
    'status',
    'prioridade', 'priority',
    'responsavel', 'responsible', 'assignee',
    'departamento', 'department',
    'data_criacao', 'created_at', 'criado_em',
    'prazo', 'deadline', 'due_date'
  ];
  
  const validFields = [];
  
  console.log('Descobrindo schema da tabela tarefas...\n');
  
  for (const field of possibleFields) {
    const testObj = { titulo: 'test', [field]: field === 'titulo' ? 'test' : 'valor' };
    const { error } = await supabase.from('tarefas').insert(testObj);
    
    if (!error || !error.message.includes('Could not find')) {
      validFields.push(field);
      console.log(`✓ ${field} - existe`);
      // Limpar
      await supabase.from('tarefas').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } else {
      console.log(`✗ ${field} - não existe`);
    }
  }
  
  console.log('\n=== SCHEMA ENCONTRADO ===');
  console.log('Campos válidos:', validFields);
}

discoverSchema().catch(console.error);
