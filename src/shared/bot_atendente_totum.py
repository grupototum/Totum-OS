#!/usr/bin/env python3
"""
🤖 TOTUM AGENTS BOT - Atendente Inteligente
Bot do Telegram para atendimento da equipe com LLM local
"""

import os
import json
import logging
import sqlite3
from datetime import datetime
from typing import Optional, Dict, Any

# Configuração de logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Telegram
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    ConversationHandler,
    ContextTypes,
    filters
)

# LLM Local (Ollama)
import requests

# Opik Integration (leve - cloud)
try:
    from opik_integration import tracker, trace_llm, OPIK_AVAILABLE
    logger.info(f"📊 Opik tracing: {'Ativo' if OPIK_AVAILABLE else 'Inativo'}")
except ImportError:
    OPIK_AVAILABLE = False
    tracker = None
    def trace_llm(f): return f
    logger.info("📊 Opik não disponível")

# Groq Integration (API rápida - tier gratuito)
try:
    from groq_integration import groq_handler, get_llm_handler, GROQ_AVAILABLE
    logger.info(f"🚀 Groq API: {'Disponível' if GROQ_AVAILABLE else 'Não instalado'}")
except ImportError:
    GROQ_AVAILABLE = False
    groq_handler = None
    def get_llm_handler(use_groq=None): return None
    logger.info("🚀 Groq não disponível")

# ==================== CONFIGURAÇÕES ====================

TELEGRAM_TOKEN = "8675078490:AAHuWe-3CphyWn4vlYv-1tDKZofDS-mJScM"
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.2"

# IDs dos responsáveis por departamento (preencher com os IDs reais do Telegram)
RESPONSAVEIS = {
    "suporte": os.getenv("TELEGRAM_ID_SUPORTE", ""),
    "comercial": os.getenv("TELEGRAM_ID_COMERCIAL", ""),
    "tecnico": os.getenv("TELEGRAM_ID_TECNICO", ""),
    "financeiro": os.getenv("TELEGRAM_ID_FINANCEIRO", ""),
    "direcao": os.getenv("TELEGRAM_ID_DIRECAO", "")
}

# Estados da conversação
MENU_PRINCIPAL, AGUARDANDO_DUVIDA, CLASSIFICANDO, CONFIRMAR_ESCALAMENTO = range(4)

# ==================== BANCO DE DADOS ====================

class Database:
    def __init__(self, db_path: str = "data/atendimento_bot.db"):
        self.db_path = db_path
        self.init_db()
    
    def init_db(self):
        """Inicializa as tabelas do banco"""
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Tabela de conversas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS conversas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                username TEXT,
                first_name TEXT,
                mensagem TEXT,
                resposta TEXT,
                tipo TEXT,
                departamento TEXT,
                urgencia INTEGER,
                escalado_para TEXT,
                status TEXT DEFAULT 'novo',
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Tabela de tarefas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tarefas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                username TEXT,
                titulo TEXT,
                descricao TEXT,
                departamento TEXT,
                urgencia INTEGER,
                status TEXT DEFAULT 'pendente',
                responsavel TEXT,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                concluido_em TIMESTAMP
            )
        """)
        
        # Tabela de conhecimento (FAQ e processos)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS conhecimento (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                categoria TEXT,
                pergunta TEXT,
                resposta TEXT,
                palavras_chave TEXT,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        conn.close()
        logger.info("✅ Banco de dados inicializado")
    
    def salvar_conversa(self, user_id: int, username: str, first_name: str, 
                        mensagem: str, resposta: str, tipo: str = "duvida",
                        departamento: str = None, urgencia: int = None,
                        escalado_para: str = None):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO conversas 
            (user_id, username, first_name, mensagem, resposta, tipo, 
             departamento, urgencia, escalado_para)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (user_id, username, first_name, mensagem, resposta, tipo,
              departamento, urgencia, escalado_para))
        conn.commit()
        conn.close()
    
    def criar_tarefa(self, user_id: int, username: str, titulo: str, 
                     descricao: str, departamento: str, urgencia: int):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO tarefas (user_id, username, titulo, descricao, 
                               departamento, urgencia, responsavel)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, username, titulo, descricao, departamento, 
              urgencia, RESPONSAVEIS.get(departamento, "")))
        task_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return task_id
    
    def buscar_conhecimento(self, palavra_chave: str) -> Optional[Dict]:
        """Busca resposta na base de conhecimento"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT pergunta, resposta, categoria FROM conhecimento
            WHERE palavras_chave LIKE ?
            LIMIT 1
        """, (f"%{palavra_chave}%",))
        resultado = cursor.fetchone()
        conn.close()
        
        if resultado:
            return {
                "pergunta": resultado[0],
                "resposta": resultado[1],
                "categoria": resultado[2]
            }
        return None

# Instância global do banco
db = Database()

# ==================== LLM HANDLER (Ollama Local OU Groq API) ====================

class LLMHandler:
    def __init__(self):
        self.url = OLLAMA_URL
        self.model = OLLAMA_MODEL
        self.use_groq = os.getenv("USE_GROQ", "false").lower() == "true"
        
        # Verifica se Groq está disponível e configurado
        if self.use_groq and GROQ_AVAILABLE and groq_handler and groq_handler.enabled:
            logger.info("🚀 Usando Groq API (ultra-rápido)")
            self.groq = groq_handler
        else:
            logger.info("🦙 Usando Ollama local")
            self.groq = None
    
    def generate(self, prompt: str, system: str = None) -> str:
        """Gera resposta do LLM (Groq ou Ollama)"""
        # Se Groq estiver ativo, usa ele
        if self.groq:
            return self.groq.generate(prompt, system)
        
        # Senão, usa Ollama local
        try:
            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 500
                }
            }
            
            if system:
                payload["system"] = system
            
            response = requests.post(self.url, json=payload, timeout=60)
            response.raise_for_status()
            result = response.json().get("response", "Desculpe, não consegui processar.")
            
            # Log no Opik se disponível
            if OPIK_AVAILABLE and tracker and tracker.enabled:
                tracker.log_conversation(
                    user_id=0,  # será atualizado no handler
                    username="llm_call",
                    mensagem=prompt[:200],
                    resposta=result[:200],
                    classificacao={"tipo": "llm_internal", "departamento": "sistema", "urgencia": 1}
                )
            
            return result
            
        except Exception as e:
            logger.error(f"Erro no LLM: {e}")
            return "⚠️ Erro ao conectar com o assistente. Tente novamente."
    
    def classificar_demanda(self, mensagem: str) -> Dict[str, Any]:
        """Classifica a demanda usando o LLM"""
        # Se Groq estiver ativo, usa ele
        if self.groq:
            return self.groq.classificar_demanda(mensagem)
        
        # Senão, usa Ollama local
        system_prompt = """Você é um classificador de demandas de atendimento.
Analise a mensagem e classifique em JSON:
{
  "tipo": "duvida|reclamacao|solicitacao|tarefa",
  "departamento": "suporte|comercial|tecnico|financeiro|direcao|geral",
  "urgencia": 1-5,
  "resumo": "breve resumo",
  "responder_direto": true|false,
  "motivo": "por que deve responder direto ou escalar"
}"""
        
        prompt = f"""Classifique esta demanda:
"{mensagem}"

Responda APENAS em JSON válido."""
        
        try:
            resposta = self.generate(prompt, system_prompt)
            # Tenta extrair JSON da resposta
            import re
            json_match = re.search(r'\{.*\}', resposta, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except Exception as e:
            logger.error(f"Erro ao classificar: {e}")
        
        # Fallback
        return {
            "tipo": "duvida",
            "departamento": "geral",
            "urgencia": 3,
            "resumo": mensagem[:50],
            "responder_direto": True,
            "motivo": "fallback"
        }
    
    def responder_duvida(self, mensagem: str, contexto: str = "") -> str:
        """Responde dúvidas usando o LLM com contexto da empresa"""
        system_prompt = """Você é o Atendente Totum, assistente virtual da empresa.

PERSONALIDADE:
- Cordial, profissional mas humano
- Respostas concisas mas completas
- Usa emojis ocasionalmente
- Se não souber, admite e oferece escalar

PROCESSOS DA EMPRESA (contexto):
""" + contexto + """

REGRAS:
1. Responda em português
2. Se for sobre processos internos, use o contexto acima
3. Se não tiver informação suficiente, diga que vai escalar
4. Sempre ofereça ajuda adicional no final"""
        
        return self.generate(mensagem, system_prompt)

# Instância do LLM
llm = LLMHandler()

# ==================== COMANDOS DO BOT ====================

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Comando /start"""
    user = update.effective_user
    
    welcome_text = f"""👋 Olá, {user.first_name}! 

Sou o **Atendente Totum**, seu assistente virtual da empresa.

Posso te ajudar com:
📋 **Dúvidas** sobre processos internos
⚡ **Criar tarefas** para os departamentos  
📢 **Escalar demandas** urgentes

Como posso ajudar você hoje?"""
    
    keyboard = [
        [InlineKeyboardButton("❓ Tenho uma dúvida", callback_data='duvida')],
        [InlineKeyboardButton("⚡ Criar uma tarefa", callback_data='tarefa')],
        [InlineKeyboardButton("📞 Falar com humano", callback_data='humano')],
        [InlineKeyboardButton("📊 Minhas solicitações", callback_data='minhas')]
    ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(welcome_text, reply_markup=reply_markup)
    return MENU_PRINCIPAL

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Comando /help"""
    help_text = """🤖 **Comandos disponíveis:**

/start - Iniciar atendimento
/help - Ver esta mensagem
/tarefa - Criar nova tarefa
/status - Ver minhas solicitações
/cancelar - Cancelar operação atual

**Como usar:**
1. Envie sua dúvida que eu respondo
2. Se precisar criar tarefa, clique em "⚡ Criar uma tarefa"
3. Para urgências, clicar em "📞 Falar com humano"

Estou aqui para ajudar! 🚀"""
    
    await update.message.reply_text(help_text)

async def minhas_solicitacoes(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Mostra histórico do usuário"""
    user = update.effective_user
    
    conn = sqlite3.connect(db.db_path)
    cursor = conn.cursor()
    
    # Últimas 5 conversas
    cursor.execute("""
        SELECT mensagem, resposta, status, criado_em 
        FROM conversas 
        WHERE user_id = ?
        ORDER BY criado_em DESC
        LIMIT 5
    """, (user.id,))
    
    conversas = cursor.fetchall()
    conn.close()
    
    if not conversas:
        await update.message.reply_text("📭 Você ainda não tem solicitações.")
        return
    
    texto = "📊 **Suas últimas solicitações:**\n\n"
    for msg, resp, status, data in conversas:
        data_fmt = data.split()[0] if data else ""
        status_emoji = "✅" if status == "resolvido" else "⏳"
        texto += f"{status_emoji} {data_fmt}: {msg[:40]}...\n"
    
    await update.message.reply_text(texto)

# ==================== HANDLERS DE CALLBACK ====================

async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Manipula cliques nos botões"""
    query = update.callback_query
    await query.answer()
    
    if query.data == 'duvida':
        await query.edit_message_text(
            "❓ **Qual é a sua dúvida?**\n\n"
            "Descreva sua pergunta que vou te ajudar!"
        )
        return AGUARDANDO_DUVIDA
    
    elif query.data == 'tarefa':
        await query.edit_message_text(
            "⚡ **Vamos criar uma tarefa!**\n\n"
            "Qual é o título da tarefa?"
        )
        context.user_data['criando_tarefa'] = {}
        return CLASSIFICANDO
    
    elif query.data == 'humano':
        await query.edit_message_text(
            "📞 **Vou te conectar com um humano!**\n\n"
            "Qual departamento você precisa?",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("Suporte", callback_data='escalar_suporte')],
                [InlineKeyboardButton("Comercial", callback_data='escalar_comercial')],
                [InlineKeyboardButton("Técnico", callback_data='escalar_tecnico')],
                [InlineKeyboardButton("Financeiro", callback_data='escalar_financeiro')]
            ])
        )
        return CONFIRMAR_ESCALAMENTO
    
    elif query.data == 'minhas':
        await minhas_solicitacoes(update, context)
        return MENU_PRINCIPAL
    
    elif query.data.startswith('escalar_'):
        departamento = query.data.replace('escalar_', '')
        context.user_data['escalar_para'] = departamento
        await query.edit_message_text(
            f"📞 **Escalonando para {departamento.title()}**\n\n"
            "Descreva sua demanda em uma mensagem:"
        )
        return CONFIRMAR_ESCALAMENTO

# ==================== PROCESSAMENTO DE MENSAGENS ====================

async def processar_duvida(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Processa dúvidas do usuário"""
    user = update.effective_user
    mensagem = update.message.text
    
    # Mostra "digitando..."
    await context.bot.send_chat_action(
        chat_id=update.effective_chat.id, 
        action="typing"
    )
    
    # Classifica a demanda
    classificacao = llm.classificar_demanda(mensagem)
    logger.info(f"Classificação: {classificacao}")
    
    # Se for tarefa ou urgência, escala
    if classificacao.get('tipo') == 'tarefa' or classificacao.get('urgencia', 3) >= 4:
        return await criar_tarefa_from_message(update, context, mensagem, classificacao)
    
    # Busca na base de conhecimento primeiro
    conhecimento = None
    for palavra in mensagem.lower().split():
        conhecimento = db.buscar_conhecimento(palavra)
        if conhecimento:
            break
    
    # Gera resposta
    if conhecimento:
        contexto = f"FAQ: {conhecimento['pergunta']}\nResposta: {conhecimento['resposta']}"
        resposta = llm.responder_duvida(mensagem, contexto)
    else:
        resposta = llm.responder_duvida(mensagem)
    
    # Salva conversa
    db.salvar_conversa(
        user_id=user.id,
        username=user.username,
        first_name=user.first_name,
        mensagem=mensagem,
        resposta=resposta,
        tipo=classificacao.get('tipo', 'duvida'),
        departamento=classificacao.get('departamento', 'geral'),
        urgencia=classificacao.get('urgencia', 3)
    )
    
    # Log no Opik (tracing leve em nuvem)
    if OPIK_AVAILABLE and tracker and tracker.enabled:
        try:
            tracker.log_conversation(
                user_id=user.id,
                username=user.username or str(user.id),
                mensagem=mensagem,
                resposta=resposta,
                classificacao=classificacao
            )
            logger.info(f"📊 Conversa logada no Opik - User: {user.id}")
        except Exception as e:
            logger.warning(f"Erro ao logar no Opik: {e}")
    
    # Envia resposta com botões de ação
    keyboard = [
        [InlineKeyboardButton("✅ Resolveu minha dúvida", callback_data='resolvido')],
        [InlineKeyboardButton("⚡ Criar tarefa disso", callback_data='tarefa_from_duvida')],
        [InlineKeyboardButton("📞 Preciso de mais ajuda", callback_data='humano')]
    ]
    
    await update.message.reply_text(
        resposta,
        reply_markup=InlineKeyboardMarkup(keyboard)
    )
    
    return MENU_PRINCIPAL

async def criar_tarefa_from_message(update: Update, context: ContextTypes.DEFAULT_TYPE, 
                                    mensagem: str, classificacao: Dict):
    """Cria tarefa a partir de mensagem"""
    user = update.effective_user
    
    task_id = db.criar_tarefa(
        user_id=user.id,
        username=user.username,
        titulo=classificacao.get('resumo', mensagem[:50]),
        descricao=mensagem,
        departamento=classificacao.get('departamento', 'geral'),
        urgencia=classificacao.get('urgencia', 3)
    )
    
    # Notifica responsável (se tiver ID)
    responsavel = RESPONSAVEIS.get(classificacao.get('departamento'))
    if responsavel:
        try:
            await context.bot.send_message(
                chat_id=responsavel,
                text=f"🚨 **Nova tarefa #{task_id}**\n\n"
                     f"De: @{user.username or user.first_name}\n"
                     f"Urgência: {classificacao.get('urgencia')}/5\n\n"
                     f"{mensagem[:200]}..."
            )
        except Exception as e:
            logger.error(f"Erro ao notificar responsável: {e}")
    
    await update.message.reply_text(
        f"✅ **Tarefa #{task_id} criada!**\n\n"
        f"Departamento: {classificacao.get('departamento', 'geral').title()}\n"
        f"Urgência: {'⭐' * classificacao.get('urgencia', 3)}\n\n"
        f"Um responsável será notificado em breve."
    )
    
    return MENU_PRINCIPAL

async def processar_escalamento(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Processa escalamento para humano"""
    user = update.effective_user
    mensagem = update.message.text
    departamento = context.user_data.get('escalar_para', 'geral')
    
    # Salva como conversa escalada
    db.salvar_conversa(
        user_id=user.id,
        username=user.username,
        first_name=user.first_name,
        mensagem=mensagem,
        resposta="ESCALADO",
        tipo="escalamento",
        departamento=departamento,
        urgencia=5,
        escalado_para=RESPONSAVEIS.get(departamento, "")
    )
    
    # Notifica responsável
    responsavel = RESPONSAVEIS.get(departamento)
    if responsavel:
        await context.bot.send_message(
            chat_id=responsavel,
            text=f"🚨 **ATENÇÃO - Escalonamento {departamento.upper()}**\n\n"
                 f"De: @{user.username or user.first_name} (ID: {user.id})\n\n"
                 f"{mensagem}\n\n"
                 f"Responda diretamente para atender."
        )
    
    await update.message.reply_text(
        f"📞 **Escalonado para {departamento.title()}!**\n\n"
        f"Um responsável foi notificado e entrará em contato em breve.\n\n"
        f"Se for urgente, ligue diretamente."
    )
    
    return MENU_PRINCIPAL

# ==================== MAIN ====================

def main():
    """Inicializa o bot"""
    logger.info("🚀 Iniciando Totum Agents Bot...")
    
    # Cria aplicação
    application = Application.builder().token(TELEGRAM_TOKEN).build()
    
    # Conversation handler
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            MENU_PRINCIPAL: [
                CallbackQueryHandler(button_handler),
                MessageHandler(filters.TEXT & ~filters.COMMAND, processar_duvida)
            ],
            AGUARDANDO_DUVIDA: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, processar_duvida)
            ],
            CLASSIFICANDO: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, processar_duvida)
            ],
            CONFIRMAR_ESCALAMENTO: [
                CallbackQueryHandler(button_handler),
                MessageHandler(filters.TEXT & ~filters.COMMAND, processar_escalamento)
            ]
        },
        fallbacks=[CommandHandler("cancelar", start)]
    )
    
    # Adiciona handlers
    application.add_handler(conv_handler)
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("status", minhas_solicitacoes))
    
    logger.info("✅ Bot pronto! Pressione Ctrl+C para parar.")
    
    # Inicia o bot
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
