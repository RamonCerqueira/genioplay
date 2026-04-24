# 🚀 EduTrack - Plano de Desenvolvimento (MVP)

Este documento detalha os próximos passos para a conclusão do EduTrack, abrangendo desde a identidade visual e UI/UX até a arquitetura de backend, automação e deploy.

---

## 🎨 1. Design System e Identidade Visual (UI/UX)
O objetivo do design é transmitir **confiança para os pais** e **engajamento/diversão para as crianças**, sem parecer infantil demais para os alunos mais velhos.

### 1.1. Paleta de Cores
* **Primária (Educação & Foco):** Azul Safira (`#2563EB`) ou Teal (`#0D9488`). Usado em botões principais, cabeçalhos do AdminResp e links.
* **Secundária (Ação & Gamificação):** Laranja Quente (`#F97316`) ou Amarelo Mostarda (`#EAB308`). Usado para as moedas virtuais, botões de "Play" no cronômetro e notificações de conquista.
* **Backgrounds:** Off-white ou Cinza muito claro (`#F8FAFC`) para reduzir o cansaço visual.
* **Alertas (Anti-Cheat):** Vermelho Suave (`#EF4444`) para os avisos de perda de foco.

### 1.2. Tipografia
* **Fonte Principal:** `Nunito` ou `Quicksand` (Google Fonts). Elas possuem bordas levemente arredondadas, o que traz uma característica amigável e pedagógica, mantendo excelente legibilidade em telas pequenas (Mobile).

### 1.3. Iconografia e Imagens
* **Biblioteca Sugerida:** `Lucide React` ou `Phosphor Icons` (traços consistentes e modernos).
* **Ícones Chave:**
    * 🎓 *Capelo/Livro:* Para módulos de estudo e disciplinas.
    * 🛡️ *Escudo:* Para a área de controle parental e relatórios de segurança/foco.
    * 🏆 *Troféu/Estrela:* Para a área de gamificação e recompensas.
    * ⏱️ *Cronômetro:* Para o método Pomodoro e tempo de tela.
* **Imagens:** Utilizar ilustrações estilo "Flat" ou "Isometric" (como as do *unDraw* ou *Freepik*) nas telas de onboarding e empty states (ex: "Nenhuma matéria cadastrada ainda").

### 1.4. Animações e Micro-interações (Framer Motion)
* **Transições de Tela:** Suaves e rápidas (`fade-in` e `slide-up`).
* **Feedback de Ação:** Botões devem ter um efeito de `scale-down` ao serem clicados.
* **Gamificação:** Efeito de *Confetti* (biblioteca `react-confetti`) disparando na tela quando a criança acerta as questões bônus ou finaliza um Pomodoro com foco 100%.

---

## 💻 2. Frontend (Visões do App - Next.js)

### 2.1. Visão `Student` (Aluno)
* [ ] **Dashboard Gamificado:** Mostrar a ofensiva (dias seguidos), saldo de moedas e a próxima matéria do dia logo no topo.
* [ ] **Player de Estudo (Pomodoro):** Interface imersiva (fullscreen mode se possível). Contém o conteúdo da IA em formato de *Cards* deslizantes.
* [ ] **Sistema Anti-Cheat (Frontend):** Implementar um `eventListener` no evento `visibilitychange` do navegador. Se a aba ficar oculta, disparar o evento via WebSocket para o backend pausar o tempo e notificar o pai.
* [ ] **Quiz Interativo:** Interface de múltipla escolha com feedback imediato após o envio.

### 2.2. Visão `AdminResp` (Pais/Responsáveis)
* [ ] **Dashboard de Controle:** Gráficos simples (usando `Recharts`) mostrando horas estudadas na semana vs. meta.
* [ ] **Gerador de Conteúdo:** Formulário onde o pai seleciona o Filho, a Disciplina (ex: Matemática), Assunto (ex: Frações) e a Persona da IA (ex: Professor Divertido).
* [ ] **Lojinha de Recompensas:** CRUD onde os pais cadastram prêmios reais e definem o custo em moedas virtuais.

### 2.3. Visão `Geral / Landing Page` (Marketing)
* [ ] **Landing Page Otimizada:** Foco total em conversão. Estrutura: Hook (dor do pai que trabalha), Solução (vídeo curto do app rodando), Benefícios (anti-cheat, IA alinhada à escola) e Planos (Freemium/Premium).

---

## ⚙️ 3. Backend e Integrações (Regras de Negócio)

### 3.1. Orquestração da IA (OpenAI/Claude)
* [ ] **Engenharia de Prompt Dinâmica:** Criar o serviço que recebe as variáveis do frontend e monta o System Prompt.
* [ ] **Geração Estruturada:** Garantir que a API devolva um objeto JSON estrito contendo: Array de Cards de Estudo, Array de 6 Questões (3 fáceis, 2 médias, 1 difícil) e as 2 Questões Bônus.

### 3.2. Real-Time (Redis + WebSockets/SSE)
* [ ] **Setup do Servidor Real-Time:** Configurar um canal para enviar a notificação instantânea para o ID do `AdminResp` assim que o `Student` clicar no "Play".
* [ ] **Tratamento de Perda de Foco:** Rota que recebe o ping de "Aba minimizada" do frontend da criança e propaga o alerta para o pai.

---

## 🤖 4. Automação de Retaguarda (Background Jobs)
Para não sobrecarregar o Node.js com processos pesados de compilação de PDFs e e-mails:

* [ ] **Integração com n8n:** Criar um webhook no n8n.
* [ ] **Rotina de Sexta-feira:** O Next.js roda um Cron Job (ou via Vercel Cron) que chama o webhook do n8n enviando o JSON com os dados de uso da semana de cada família.
* [ ] **Fluxo n8n:** O n8n pega esse JSON, pede para a IA gerar um resumo em texto do desempenho ("O aluno foi bem em exatas, mas perdeu o foco em biologia"), gera um PDF e envia automaticamente para o e-mail do `AdminResp`.

---

## 🚢 5. Infraestrutura e Deploy (Aprender na Prática)
Evitando os custos imprevisíveis de plataformas serverless para um app com WebSockets e muito tráfego no banco:

* [ ] **Dockerização:** Criar o `Dockerfile` do Next.js e o `docker-compose.yml` contemplando o App, o PostgreSQL e o Redis.
* [ ] **Deploy na VPS (Ubuntu):** Subir o ambiente em uma máquina robusta (como uma VPS Contabo), configurando um reverse proxy (Nginx ou Traefik) com certificados SSL via Let's Encrypt.
* [ ] **Hospedagem do n8n:** Subir uma instância self-hosted do n8n na mesma VPS ou em um container separado para cuidar das automações.

---

## 📈 6. Growth e Aquisição (Próximos Passos após MVP)
* [ ] **SEO Técnico:** Otimizar as tags do Next.js na página pública.
* [ ] **Funil de Vídeos Curtos:** Criar páginas de destino específicas com URLs curtas e amigáveis para direcionar o tráfego orgânico gerado através de vídeos e descrições no Instagram Reels.
* [ ] **Implementação do Viral Loop:** Ativar a tabela de referências no banco para o sistema de indicação.