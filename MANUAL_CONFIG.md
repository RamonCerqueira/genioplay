# 📖 Manual de Configuração Mestre - GênioPlay SaaS

Este guia contém todos os locais onde você deve inserir as chaves e segredos para o sistema operar em nível de produção.

---

## 1. Arquivo de Ambiente (`.env`)
Localizado na raiz do projeto. Este arquivo guarda as chaves mais sensíveis.

| Variável | Onde Conseguir | Descrição |
| :--- | :--- | :--- |
| `DATABASE_URL` | **Supabase** (Settings > DB) | Use a URL com a porta **6543** (Pooler). |
| `DIRECT_URL` | **Supabase** (Settings > DB) | Use a URL com a porta **5432** (Direct). Necessário para migrations. |
| `GEMINI_API_KEY` | **Google AI Studio** | Chave para o motor de IA que gera as lições. |
| `MERCADO_PAGO_ACCESS_TOKEN` | **Mercado Pago Developers** | O "Access Token" da sua conta (Produção ou Teste). |
| `NEXT_PUBLIC_APP_URL` | **Seu Domínio** | Ex: `https://edutrack.com.br` (Necessário para os Webhooks). |
| `NEXTAUTH_SECRET` | Gerar via Terminal | Use `openssl rand -base64 32` para gerar uma chave de segurança de login. |

---

## 2. Painel AdmMaster (`/admin-master`)
Para o seu controle diário como dono, sem precisar mexer em código.

*   **Chave PIX:** Insira sua chave (CPF/CNPJ/E-mail) que aparecerá para os usuários no checkout.
*   **Credentials:** Insira o `Client ID` e `Client Secret` do Mercado Pago para reforçar a segurança (opcional, mas recomendado).

---

## 3. Configuração do Webhook (Mercado Pago)
Para que o Premium ative sozinho quando o pai pagar.

1. Vá ao [Painel do Mercado Pago](https://www.mercadopago.com.br/developers/panel/notifications/webhooks).
2. No campo **URL de retorno**, insira:  
   `https://seu-dominio.com/api/payment/webhook`
3. Selecione os eventos: `payment.created` e `payment.updated`.
4. Salve. Agora o EduTrack "ouvirá" cada centavo que entrar!

---

## 4. Banco de Dados (Supabase/SQL)
Para você se tornar o primeiro Administrador Mestre do sistema.

Rode este comando no **SQL Editor** do Supabase para dar permissão total ao seu usuário:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'seu-email-de-cadastro@exemplo.com';
```

---

## 5. Google AI Studio (Gemini)
1. Acesse: [aistudio.google.com](https://aistudio.google.com/)
2. Crie uma **API Key**.
3. Verifique se o modelo `gemini-1.5-flash` está disponível (ele é o mais rápido e barato).

---

### ✅ Checklist de Verificação:
- [ ] Rodei `npm install` para instalar as novas bibliotecas.
- [ ] O banco de dados está sincronizado com `npx prisma db push`.
- [ ] O `.env` tem todas as chaves preenchidas.
- [ ] O Webhook do Mercado Pago está apontando para a minha URL de produção.

**Pronto! Seguindo este manual, seu SaaS está blindado e pronto para o lucro.** 🚀🔥
