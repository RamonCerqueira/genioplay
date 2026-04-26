# 🚀 Guia de Deploy GênioPlay (Híbrido: Node.js + PM2 + Redis Docker)

Este guia foi otimizado para VPS com recursos limitados (2GB RAM). Rodaremos o App direto no Linux e apenas o Redis no Docker.

---

## 1. Acesso Inicial e Preparação

Acesse sua VPS via terminal:
```bash
ssh root@153.75.244.238
```
senha: Dagol7-Bikaz0_Nabyd7-Zadog0=Povuk6


Atualize o sistema:
```bash
apt update && apt upgrade -y
```

---

## 2. Instalação do Ambiente (Node.js, Docker, PM2)

Execute estes comandos para preparar a máquina:
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Instalar PM2
npm install -g pm2
```

---

## 3. Preparação do Repositório

Clone o projeto e entre na pasta:
```bash
git clone https://github.com/SEU_USUARIO/genioplay.git genioplay
cd genioplay
```

---

## 4. Configurando Variáveis de Ambiente

Crie o arquivo `.env`:
```bash
nano .env
```
Use o modelo abaixo (substitua o IP pelo seu):
```env
DATABASE_URL="sua_url_do_supabase"
GEMINI_API_KEY="sua_chave"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_SECRET="uma_chave_aleatoria"
NEXTAUTH_URL="http://153.75.244.238"
NEXT_PUBLIC_APP_URL="http://153.75.244.238"
RESEND_API_KEY="sua_chave"
EMAIL_FROM="onboarding@resend.dev"
```

---

## 5. Build e Lançamento

**A. Subir o Redis (Docker):**
```bash
docker compose up -d
```

**B. Instalar e Buildar o App (Direto no Linux):**
```bash
npm install
npx prisma generate
npm run build
npx prisma db push
```

**C. Iniciar com PM2:**
```bash
pm2 start npm --name "genioplay" -- start
```

---

## 6. Configurando Nginx (Acesso via IP)

1. Instale o Nginx:
```bash
apt install nginx -y
```

2. Configure o site:
```bash
nano /etc/nginx/sites-available/genioplay
```

3. Cole este conteúdo:
```nginx
server {
    listen 80;
    server_name 153.75.244.238;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Ative e Reinicie:
```bash
ln -s /etc/nginx/sites-available/genioplay /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 7. Comandos Úteis

*   **Ver Logs:** `pm2 logs genioplay`
*   **Reiniciar App:** `pm2 restart genioplay`
*   **Verificar Status:** `pm2 status`
*   **Logs do Redis:** `docker compose logs -f redis`

---

**Pronto! Seu SaaS GênioPlay está online e seguro. 🎉**
