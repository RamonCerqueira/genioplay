# 🚀 Guia de Deploy GênioPlay (Produção)

Este guia contém os passos exatos para configurar sua VPS na InterServer e colocar o GênioPlay no ar usando Docker.

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

## 2. Instalação do Docker e Docker Compose

Execute o script oficial para instalar tudo de uma vez:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

Verifique se instalou corretamente:
```bash
docker --version
docker compose version
```

---

## 3. Clonando o Projeto

Se o seu repositório for privado, você precisará gerar uma chave SSH na VPS e adicionar ao seu GitHub/GitLab:
```bash
ssh-keygen -t ed25519 -C "vps-genioplay"
cat ~/.ssh/id_ed25519.pub
```
(Copie a chave que aparecer e cole nas "SSH Keys" do seu perfil no GitHub).

Agora, clone o projeto:
```bash
git clone git@github.com:SEU_USUARIO/SEU_REPO.git genioplay
cd genioplay
```

---

## 4. Configurando Variáveis de Ambiente

Crie o arquivo `.env` na VPS:
```bash
nano .env
```
Cole as variáveis reais de produção (DATABASE_URL do Supabase, RESEND_API_KEY, GEMINI_API_KEY, etc).
*Dica: Use a porta 5432 para a DATABASE_URL do Supabase em conexões diretas.*

---

## 5. Build e Lançamento (Docker)

Rode o comando para construir e subir os containers em background:
```bash
docker compose up -d --build
```

Verifique se os logs estão ok:
```bash
docker compose logs -f app
```

---

## 6. Configurando o Domínio (Nginx + HTTPS)

Instale o Nginx e o Certbot:
```bash
apt install nginx certbot python3-certbot-nginx -y
```

Crie a configuração do site:
```bash
nano /etc/nginx/sites-available/genioplay
```

Cole este conteúdo (substituindo seu domínio):
```nginx
server {
    server_name genioplay.com.br;

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

Ative a configuração e reinicie o Nginx:
```bash
ln -s /etc/nginx/sites-available/genioplay /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

Gere o certificado SSL gratuito:
```bash
certbot --nginx -d genioplay.com.br
```

---

## 7. Manutenção

*   **Atualizar o código:** `git pull && docker compose up -d --build`
*   **Ver Logs:** `docker compose logs -f`
*   **Reiniciar:** `docker compose restart`

---

**Pronto! Seu SaaS GênioPlay está online e seguro. 🎉**
