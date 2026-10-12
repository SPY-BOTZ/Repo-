export interface BotFile {
  path: string;
  name: string;
  category: 'core' | 'plugin' | 'config' | 'deploy' | 'docs';
  description: string;
  content: string;
}

export interface TriggerRuleItem {
  id: string;
  triggers: string[];
  matchType: 'exact' | 'contains' | 'word' | 'all';
  reply: string;
  enabled: boolean;
  hasButton: boolean;
  buttons: Array<{ text: string; url: string }>;
}

export const INITIAL_USERBOT_CONFIG = {
  replyText: "Hello! Main is group me auto-reply ke liye active hoon. Join our channel or DM me directly! ✨",
  deleteTimeSeconds: 30,
  cooldownSeconds: 5,
  replyMode: 'all' as 'all' | 'keyword', // 'all' = any member sms, 'keyword' = specific keywords
};

export const INITIAL_TRIGGER_RULES: TriggerRuleItem[] = [
  {
    id: '1',
    triggers: ['all'],
    matchType: 'all',
    reply: "Hello {mention}! Main is group me active hoon. Join our main link or DM me for details!",
    enabled: true,
    hasButton: false,
    buttons: []
  },
  {
    id: '2',
    triggers: ['hi', 'hello', 'hey', 'bhai'],
    matchType: 'word',
    reply: "Hey {mention}! Kaise hain aap? Details ke liye mujhe direct message karein ya link check karein.",
    enabled: true,
    hasButton: false,
    buttons: []
  },
  {
    id: '3',
    triggers: ['price', 'rate', 'cost'],
    matchType: 'word',
    reply: "💰 Plans & Pricing: 1 Month $10 | Lifetime $50. DM me directly to activate!",
    enabled: true,
    hasButton: false,
    buttons: []
  }
];

export const BOT_FILES: BotFile[] = [
  {
    path: 'bot.py',
    name: 'bot.py',
    category: 'core',
    description: 'Telegram Userbot runner using Pyrofork string session + aiohttp port 8080 web server for Koyeb health check.',
    content: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Telegram Auto-Reply Userbot (Pyrofork / Pyrogram)
Works in ANY group without admin rights.
Auto-replies to any member SMS & auto-deletes the reply after 30 seconds!
"""

import sys
import asyncio
import logging
import logging.config
from pyrogram import Client, __version__
from aiohttp import web
from vars import Var
from plugins.route import web_server

# Configure logging
logging.config.fileConfig('logging.conf')
logging.getLogger().setLevel(logging.INFO)
logging.getLogger("pyrogram").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)

class AutoReplyUserbot(Client):
    def __init__(self):
        super().__init__(
            name="AutoReplyUserbot",
            session_string=Var.STRING_SESSION,
            api_id=Var.API_ID,
            api_hash=Var.API_HASH,
            plugins=dict(root="plugins"),
            workers=Var.WORKERS
        )
        self.me_user = None

    async def start(self):
        logger.info("Initializing Telegram Auto-Reply Userbot...")
        await super().start()
        me = await self.get_me()
        self.me_user = me
        logger.info("=" * 60)
        logger.info(f"USERBOT LOGGED IN SUCCESSFULLY: {me.first_name} (@{me.username}) [ID: {me.id}]")
        logger.info(f"Running on Pyrofork v{__version__}")
        logger.info(f"Auto-Reply Mode: {Var.AUTO_REPLY_MODE.upper()}")
        logger.info(f"Auto-Delete Timer: {Var.DELETE_TIME} SECONDS")
        logger.info(f"Group Auto-Reply Active: {Var.GROUP_AUTO_REPLY}")
        logger.info("Works in ANY group without needing Admin rights!")
        logger.info("=" * 60)

        # Start Web Server for Koyeb / Render / Heroku 200 OK Health Check
        app = web.AppRunner(await web_server())
        await app.setup()
        bind_address = "0.0.0.0"
        site = web.TCPSite(app, bind_address, Var.PORT)
        await site.start()
        logger.info(f"Koyeb Web Health Server running at http://{bind_address}:{Var.PORT}")

    async def stop(self, *args):
        logger.info("Stopping Userbot...")
        await super().stop()
        logger.info("Userbot Stopped cleanly.")

if __name__ == "__main__":
    if not Var.STRING_SESSION or not Var.API_ID or not Var.API_HASH:
        logger.error("STRING_SESSION, API_ID, or API_HASH missing in environment variables!")
        logger.error("Please provide your Pyrogram String Session in Koyeb environment variables.")
        sys.exit(1)

    userbot = AutoReplyUserbot()
    userbot.run()
`
  },
  {
    path: 'vars.py',
    name: 'vars.py',
    category: 'core',
    description: 'Userbot configuration: STRING_SESSION, default reply text, 30-sec auto-delete timer, cooldown, and Koyeb port.',
    content: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
from dotenv import load_dotenv

load_dotenv()

class Var:
    # Telegram API Credentials (Get from my.telegram.org)
    API_ID = int(os.environ.get("API_ID", "12345678"))
    API_HASH = os.environ.get("API_HASH", "your_api_hash_here")
    
    # Pyrogram String Session of your personal Telegram account
    # Generated using Pyrogram/Pyrofork string generator
    STRING_SESSION = os.environ.get("STRING_SESSION", "").strip()

    # Default reply message sent to group members
    DEFAULT_REPLY = os.environ.get(
        "REPLY_TEXT",
        "Hello {mention}! Main is group me auto-reply ke liye active hoon. Join our channel or DM me directly! ✨"
    )

    # 30-Second Auto-Delete Timer (Aapka reply sms 30 sec baad delete hoga)
    DELETE_TIME = int(os.environ.get("DELETE_TIME", "30"))

    # Auto-Reply Mode:
    # "all" -> Kisi bhi member ke SMS karne par auto-reply karega
    # "keyword" -> Sirf set kiye gaye keywords par reply karega
    AUTO_REPLY_MODE = os.environ.get("AUTO_REPLY_MODE", "all").lower()

    # Anti-flood Cooldown in seconds per chat (group me spam hone se rokne ke liye)
    COOLDOWN_SECONDS = int(os.environ.get("COOLDOWN_SECONDS", "5"))

    # Master toggle for group replies
    GROUP_AUTO_REPLY = os.environ.get("GROUP_AUTO_REPLY", "True").lower() in ("true", "1", "yes")

    # Private (PM) Auto Reply
    PRIVATE_AUTO_REPLY = os.environ.get("PRIVATE_AUTO_REPLY", "False").lower() in ("true", "1", "yes")

    # Optional Whitelist: Agar khali chhodenge toh HAR GROUP me chalega bina admin ke
    raw_groups = os.environ.get("AUTH_GROUPS", "")
    AUTH_GROUPS = [int(x.strip()) for x in raw_groups.split(",") if x.strip() and x.strip().lstrip('-').isdigit()]

    # Quote/Reply to the member message
    QUOTE_REPLY = os.environ.get("QUOTE_REPLY", "True").lower() in ("true", "1", "yes")

    # Web service port for Koyeb / Render
    PORT = int(os.environ.get("PORT", "8080"))
    WORKERS = int(os.environ.get("WORKERS", "4"))
`
  },
  {
    path: 'plugins/auto_reply.py',
    name: 'auto_reply.py',
    category: 'plugin',
    description: 'CORE USERBOT LOGIC: Listens in ANY group without admin, replies to member SMS, and auto-deletes the reply after 30 seconds!',
    content: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Auto Reply Plugin for Userbot
Features:
1. Works in ANY group without admin rights (as user account)
2. Auto-replies when any member sends a message
3. Auto-deletes userbot's reply after 30 seconds (DELETE_TIME)
4. Anti-spam cooldown per chat
5. Background auto-delete task to never block message polling
"""

import asyncio
import logging
from pyrogram import Client, filters
from pyrogram.types import Message
from pyrogram.enums import ChatType
from vars import Var
from utils import (
    get_active_reply_text,
    is_chat_on_cooldown,
    set_chat_cooldown,
    find_matching_rule
)

logger = logging.getLogger(__name__)

async def delete_after_delay(message: Message, delay_seconds: int):
    """Background coroutine to delete the userbot reply after 30 seconds"""
    try:
        await asyncio.sleep(delay_seconds)
        await message.delete()
        logger.info(f"[Auto-Delete] Deleted userbot reply message ID {message.id} after {delay_seconds}s")
    except Exception as e:
        logger.debug(f"[Auto-Delete] Could not delete message: {e}")

@Client.on_message(filters.group & ~filters.me & ~filters.bot, group=1)
async def group_auto_reply_handler(client: Client, message: Message):
    """
    Triggers on ANY member message in ANY group (even without admin)!
    """
    try:
        # Check master switch
        if not Var.GROUP_AUTO_REPLY:
            return

        chat = message.chat
        
        # Check optional group whitelist
        if Var.AUTH_GROUPS and chat.id not in Var.AUTH_GROUPS:
            return

        text = message.text or message.caption
        if not text:
            return

        # Check anti-spam cooldown per group chat
        if is_chat_on_cooldown(chat.id, Var.COOLDOWN_SECONDS):
            return

        # Extract sender name safely
        sender_name = "Member"
        mention = "Member"
        if message.from_user:
            sender_name = message.from_user.first_name or "Member"
            mention = message.from_user.mention(sender_name)
        elif message.sender_chat:
            sender_name = message.sender_chat.title or "Member"
            mention = f"<b>{sender_name}</b>"

        # Determine reply content
        reply_content = None
        if Var.AUTO_REPLY_MODE == "all":
            # Mode ALL: Reply to ANY message
            raw_template = get_active_reply_text()
            reply_content = raw_template.replace("{mention}", mention).replace("{name}", sender_name).replace("{group_name}", chat.title or "Group")
        else:
            # Mode KEYWORD: Check keyword rules
            matched = find_matching_rule(text)
            if matched:
                reply_content = matched.replace("{mention}", mention).replace("{name}", sender_name).replace("{group_name}", chat.title or "Group")

        if not reply_content:
            return

        # Mark chat on cooldown so we don't spam if multiple members chat at the same second
        set_chat_cooldown(chat.id)

        # Thread / topic support for supergroups
        thread_id = getattr(message, "message_thread_id", None)
        
        kwargs = {
            "chat_id": chat.id,
            "text": reply_content,
            "disable_web_page_preview": True
        }
        if Var.QUOTE_REPLY:
            kwargs["reply_to_message_id"] = message.id
        if thread_id:
            kwargs["message_thread_id"] = thread_id

        # Send Userbot auto-reply
        sent_reply = await client.send_message(**kwargs)
        logger.info(f"[Userbot Reply] Replied to {sender_name} in group '{chat.title}' ({chat.id})")

        # 🕒 30-SECOND AUTO-DELETE LOGIC:
        # Delete userbot reply message after DELETE_TIME (default 30 seconds)
        if Var.DELETE_TIME > 0:
            asyncio.create_task(delete_after_delay(sent_reply, Var.DELETE_TIME))

    except Exception as e:
        logger.error(f"[Userbot AutoReply Error] {e}", exc_info=True)
`
  },
  {
    path: 'plugins/commands.py',
    name: 'commands.py',
    category: 'plugin',
    description: 'Userbot management commands (.setreply, .time, .mode, .status) runnable by you in any chat.',
    content: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Userbot Control Commands (Only you can execute these using '.' prefix)
Examples:
.setreply Your new reply message
.time 30
.mode all
.status
"""

from pyrogram import Client, filters
from pyrogram.types import Message
from vars import Var
from utils import set_active_reply_text, get_active_reply_text

@Client.on_message(filters.me & filters.command("setreply", prefixes="."))
async def set_reply_cmd(client: Client, message: Message):
    new_text = message.text[len(".setreply"):].strip()
    if not new_text:
        return await message.edit_text("⚠️ **Format:** \`.setreply Aapka auto-reply message yahan likhein\`")

    set_active_reply_text(new_text)
    await message.edit_text(
        f"✅ **Auto-Reply Text Updated!**\\n\\n"
        f"**New Message:**\\n{new_text}\\n\\n"
        f"⏱️ **Auto-Delete:** \`{Var.DELETE_TIME} seconds\`"
    )

@Client.on_message(filters.me & filters.command("time", prefixes="."))
async def set_time_cmd(client: Client, message: Message):
    args = message.text.split()
    if len(args) < 2 or not args[1].isdigit():
        return await message.edit_text(f"⚠️ **Format:** \`.time 30\` (Current: \`{Var.DELETE_TIME}s\`)")

    seconds = int(args[1])
    Var.DELETE_TIME = seconds
    await message.edit_text(f"✅ **Auto-Delete Timer Set To:** \`{seconds} seconds\`")

@Client.on_message(filters.me & filters.command("mode", prefixes="."))
async def set_mode_cmd(client: Client, message: Message):
    args = message.text.split()
    if len(args) < 2:
        return await message.edit_text("⚠️ Use \`.mode all\` (reply to all messages) or \`.mode keyword\`")

    m = args[1].lower()
    if m in ("all", "keyword"):
        Var.AUTO_REPLY_MODE = m
        await message.edit_text(f"✅ **Auto-Reply Mode Set To:** \`{m.upper()}\`")
    else:
        await message.edit_text("⚠️ Invalid mode. Choose \`all\` or \`keyword\`.")

@Client.on_message(filters.me & filters.command("status", prefixes="."))
async def status_cmd(client: Client, message: Message):
    reply_preview = get_active_reply_text()
    msg = (
        "🤖 **Auto-Reply Userbot Status:**\\n\\n"
        f"• **Group Auto-Reply:** \`{'ENABLED' if Var.GROUP_AUTO_REPLY else 'DISABLED'}\`\\n"
        f"• **Mode:** \`{Var.AUTO_REPLY_MODE.upper()}\`\\n"
        f"• **Auto-Delete Delay:** \`{Var.DELETE_TIME} seconds\`\\n"
        f"• **Cooldown:** \`{Var.COOLDOWN_SECONDS} seconds\`\\n\\n"
        f"📝 **Current Reply Text:**\\n_{reply_preview}_"
    )
    await message.edit_text(msg)
`
  },
  {
    path: 'plugins/route.py',
    name: 'route.py',
    category: 'plugin',
    description: 'aiohttp Web server for Koyeb / Render / Heroku HTTP port 8080 health check.',
    content: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from aiohttp import web

routes = web.RouteTableDef()

@routes.get("/", allow_head=True)
async def root_route(request):
    return web.json_response({
        "status": "healthy",
        "service": "Telegram Auto-Reply Userbot",
        "mode": "all-group-members",
        "auto_delete": "30s"
    })

@routes.get("/health", allow_head=True)
async def health_check(request):
    return web.Response(text="OK", status=200)

async def web_server():
    web_app = web.Application(client_max_size=30000000)
    web_app.add_routes(routes)
    return web_app
`
  },
  {
    path: 'plugins/__init__.py',
    name: '__init__.py',
    category: 'plugin',
    description: 'Plugins package initializer.',
    content: `# Auto Reply Userbot Plugins
`
  },
  {
    path: 'utils.py',
    name: 'utils.py',
    category: 'core',
    description: 'Userbot helper functions for cooldowns, dynamic reply storage, and keyword triggers.',
    content: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import re
import json
import time
from typing import Optional
from vars import Var

CONFIG_FILE = "userbot_config.json"
_chat_cooldowns = {}

DEFAULT_KEYWORD_RULES = {
    "hi": "Hey {mention}! Main is group me active hoon. DM me for details!",
    "hello": "Hello {mention}! Kaise hain aap? Please check my PM or link.",
    "price": "💰 Rates: 1 Month $10 | Lifetime $50. DM me for instant access!",
    "link": "🔗 Here is our main channel link: Check pinned message or contact me in PM!"
}

def get_config():
    if not os.path.exists(CONFIG_FILE):
        return {"reply_text": Var.DEFAULT_REPLY}
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"reply_text": Var.DEFAULT_REPLY}

def save_config(data):
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception:
        pass

def get_active_reply_text() -> str:
    cfg = get_config()
    return cfg.get("reply_text", Var.DEFAULT_REPLY)

def set_active_reply_text(text: str):
    cfg = get_config()
    cfg["reply_text"] = text
    save_config(cfg)

def is_chat_on_cooldown(chat_id: int, cooldown_seconds: int) -> bool:
    now = time.time()
    last = _chat_cooldowns.get(chat_id, 0)
    return (now - last) < cooldown_seconds

def set_chat_cooldown(chat_id: int):
    _chat_cooldowns[chat_id] = time.time()

def find_matching_rule(text: str) -> Optional[str]:
    clean = text.lower().strip()
    for trigger, reply in DEFAULT_KEYWORD_RULES.items():
        pattern = r"\\b" + re.escape(trigger.lower()) + r"\\b"
        if re.search(pattern, clean) or clean == trigger.lower():
            return reply
    return None
`
  },
  {
    path: 'script.py',
    name: 'script.py',
    category: 'core',
    description: 'Formatted strings and help guide for userbot commands.',
    content: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-

class Script:
    USERBOT_HELP = """
🤖 <b>Auto-Reply Userbot Commands:</b>

• <code>.setreply &lt;text&gt;</code> - Apna naya auto-reply text set karein
• <code>.time &lt;seconds&gt;</code> - Auto-delete timer badlein (e.g. <code>.time 30</code>)
• <code>.mode all</code> - Group ke har member ke message par auto-reply karein
• <code>.mode keyword</code> - Sirf set kiye gaye keywords par reply karein
• <code>.status</code> - Current userbot status aur active reply message dekhein
"""
`
  },
  {
    path: 'requirements.txt',
    name: 'requirements.txt',
    category: 'config',
    description: 'Userbot dependencies: Pyrofork, TgCrypto, aiohttp, python-dotenv.',
    content: `pyrofork==2.3.45
tgcrypto==1.2.5
aiohttp==3.10.5
python-dotenv==1.0.1
pytz==2024.1
`
  },
  {
    path: 'Dockerfile',
    name: 'Dockerfile',
    category: 'deploy',
    description: 'Docker image configuration for Koyeb, Render, or VPS deployment.',
    content: `FROM python:3.10-slim-buster

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    git \\
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip3 install --no-cache-dir -U -r requirements.txt

COPY . .

CMD ["python3", "bot.py"]
`
  },
  {
    path: 'Procfile',
    name: 'Procfile',
    category: 'deploy',
    description: 'Web service startup command for Koyeb, Heroku, and Render.',
    content: `web: python3 bot.py
`
  },
  {
    path: 'render.yaml',
    name: 'render.yaml',
    category: 'deploy',
    description: 'Render & Koyeb service manifest with healthcheck.',
    content: `services:
  - type: web
    name: telegram-autoreply-userbot
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "python3 bot.py"
    healthCheckPath: /health
    autoDeploy: true
    envVars:
      - key: PYTHON_VERSION
        value: 3.10.9
      - key: PORT
        value: 8080
      - key: DELETE_TIME
        value: "30"
      - key: AUTO_REPLY_MODE
        value: "all"
`
  },
  {
    path: 'app.json',
    name: 'app.json',
    category: 'deploy',
    description: 'One-Click deploy template for cloud platforms.',
    content: `{
  "name": "Telegram Auto-Reply Userbot",
  "description": "Telegram userbot that auto-replies in ANY group without admin rights and deletes replies after 30 seconds.",
  "keywords": ["telegram", "userbot", "pyrogram", "pyrofork", "auto-reply"],
  "env": {
    "STRING_SESSION": {
      "description": "Pyrogram string session for your Telegram account",
      "required": true
    },
    "API_ID": {
      "description": "Telegram API ID from my.telegram.org",
      "required": true
    },
    "API_HASH": {
      "description": "Telegram API Hash from my.telegram.org",
      "required": true
    },
    "REPLY_TEXT": {
      "description": "Auto-reply message text",
      "required": false
    },
    "DELETE_TIME": {
      "description": "Auto delete reply seconds (default 30)",
      "value": "30",
      "required": false
    }
  }
}
`
  },
  {
    path: 'heroku.yml',
    name: 'heroku.yml',
    category: 'deploy',
    description: 'Docker deployment specification.',
    content: `build:
  docker:
    web: Dockerfile
run:
  web: python3 bot.py
`
  },
  {
    path: 'logging.conf',
    name: 'logging.conf',
    category: 'config',
    description: 'Standard logging configuration.',
    content: `[loggers]
keys=root

[handlers]
keys=consoleHandler

[formatters]
keys=simpleFormatter

[logger_root]
level=INFO
handlers=consoleHandler

[handler_consoleHandler]
class=StreamHandler
level=INFO
formatter=simpleFormatter
args=(sys.stdout,)

[formatter_simpleFormatter]
format=%(asctime)s - %(name)s - %(levelname)s - %(message)s
datefmt=%Y-%m-%d %H:%M:%S
`
  },
  {
    path: 'runtime.txt',
    name: 'runtime.txt',
    category: 'config',
    description: 'Python runtime version pin.',
    content: `python-3.10.9
`
  },
  {
    path: 'start.sh',
    name: 'start.sh',
    category: 'deploy',
    description: 'Linux bash runner script.',
    content: `#!/usr/bin/env bash
python3 bot.py
`
  },
  {
    path: '.gitignore',
    name: '.gitignore',
    category: 'config',
    description: 'Git ignore rules for Python, sessions, and cache.',
    content: `__pycache__/
*.py[cod]
*$py.class
*.session
*.session-journal
.env
.venv
env/
venv/
Logs.txt
userbot_config.json
`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'docs',
    description: 'Documentation for Auto-Reply Userbot with 30-Second Auto-Delete & Koyeb Setup.',
    content: `# Telegram Auto-Reply Userbot (With 30-Second Auto-Delete) 🚀

Aapka fixed Userbot repository: **My-auto-bot-arpite**.

### ✨ KAISE KAAM KARTA HAI (Features):
1. **Bina Admin Bane Har Group Me Auto-Reply:**
   Yeh ek **Userbot** hai (jo aapke Telegram account se chalta hai). Kisi ke bhi group me aapka account add hone par, bina admin bane kisi bhi member ke SMS par instant auto-reply deta hai.
2. **30 Seconds Auto-Delete (Self-Destruct):**
   Aapka bheja gaya reply **30 seconds baad automatically delete** ho jata hai, taaki group me spam na lage aur admin aapko remove na kare!
3. **Koyeb Port 8080 200 OK Health Check:**
   Koyeb par deployment kabhi sleep ya crash nahi hoga kyunki background me \`aiohttp\` web server port bind karta hai.

---

### ⚙️ KOYEB ENVIRONMENT VARIABLES:
- \`STRING_SESSION\` : Pyrogram String Session of your Telegram Account
- \`API_ID\` : Telegram API ID from my.telegram.org
- \`API_HASH\` : Telegram API Hash from my.telegram.org
- \`REPLY_TEXT\` : Jo message aap auto-reply me bhejna chahte hain
- \`DELETE_TIME\` : \`30\` (Kitne second baad message delete hoga)
- \`AUTO_REPLY_MODE\` : \`all\` (Har message par reply)
- \`PORT\` : \`8080\`

---

### 🎮 USER COMMANDS (Telegram me chala sakte hain):
- \`.setreply <message>\` - Auto-reply text change karein
- \`.time 30\` - Auto-delete delay change karein
- \`.mode all\` / \`.mode keyword\` - Reply mode badlein
- \`.status\` - Current settings dekhein
`
  }
];
