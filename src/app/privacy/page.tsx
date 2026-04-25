'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import LandingNav from '@/components/layout/LandingNav';
import LandingFooter from '@/components/layout/LandingFooter';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, FileText, Lock, Cookie, ArrowRight } from 'lucide-react';

type TabType = 'terms' | 'privacy' | 'security' | 'cookies';

export default function LegalPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabType) || 'privacy';
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const sections = {
    terms: {
      title: "Termos de Uso",
      icon: FileText,
      updated: "24 de Abril de 2026",
      content: [
        { h: "1. Aceitação do Contrato", p: "Ao utilizar o GênioPlay, você (o Responsável) estabelece um contrato vinculativo conosco. O uso da plataforma por menores de idade deve ser estritamente supervisionado por um adulto responsável." },
        { h: "2. Licença de Uso", p: "Concedemos uma licença limitada, não exclusiva e intransferível para acessar nossos serviços pedagógicos e de gamificação para fins educacionais não comerciais." },
        { h: "3. Assinaturas e Pagamentos", p: "As assinaturas Premium são renovadas automaticamente, a menos que sejam canceladas pelo menos 24 horas antes do final do período atual. O processamento é feito via Mercado Pago." },
        { h: "4. Conduta do Usuário", p: "Não é permitido o uso de scripts, bots ou qualquer forma de engenharia reversa para burlar o sistema de GênioCoins ou o monitoramento de foco (Anti-Cheat)." }
      ]
    },
    privacy: {
      title: "Política de Privacidade",
      icon: ShieldCheck,
      updated: "24 de Abril de 2026",
      content: [
        { h: "1. Coleta de Informações", p: "Coletamos o nome e e-mail do responsável, além do nome e série (ano escolar) do aluno para personalização pedagógica do conteúdo gerado por IA." },
        { h: "2. Processamento por IA", p: "Os temas de estudo são processados anonimamente por nossos modelos de linguagem. Não armazenamos dados biométricos ou conversas privadas fora do escopo educacional." },
        { h: "3. Compartilhamento de Dados", p: "Não vendemos seus dados. Compartilhamos informações apenas com parceiros essenciais como Mercado Pago (pagamentos) e Resend (comunicações oficiais)." },
        { h: "4. Direitos do Titular", p: "Você pode solicitar a exclusão total dos dados da sua família a qualquer momento através da nossa central de suporte." }
      ]
    },
    security: {
      title: "Segurança de Dados",
      icon: Lock,
      updated: "24 de Abril de 2026",
      content: [
        { h: "1. Criptografia de Ponta", p: "Todos os dados em trânsito são protegidos por criptografia SSL/TLS de 256 bits, o padrão utilizado por instituições bancárias." },
        { h: "2. Armazenamento Seguro", p: "Utilizamos infraestrutura de nuvem certificada (Supabase/Postgres) com backups diários e redundância geográfica." },
        { h: "3. Acesso Restrito", p: "O acesso aos dados dos alunos é restrito apenas ao responsável autenticado. Nossa equipe interna não tem visibilidade do conteúdo das lições geradas." }
      ]
    },
    cookies: {
      title: "Política de Cookies",
      icon: Cookie,
      updated: "24 de Abril de 2026",
      content: [
        { h: "1. O que são Cookies?", p: "São pequenos arquivos de texto que ajudam a plataforma a lembrar suas preferências, como o tema escolhido (claro/escuro) e sua sessão de login." },
        { h: "2. Cookies Essenciais", p: "Necessários para o funcionamento do sistema de autenticação e segurança. Sem eles, você não conseguiria acessar o dashboard." },
        { h: "3. Cookies de Desempenho", p: "Utilizamos ferramentas anônimas para entender como os pais utilizam o site e melhorar continuamente a interface." }
      ]
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-500">
      <LandingNav />
      
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-16">
          
          {/* Menu Lateral */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Central Jurídica</h2>
            {(Object.keys(sections) as TabType[]).map((key) => {
              const Icon = sections[key].icon;
              return (
                <button 
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full p-5 rounded-2xl text-left font-black transition-all flex items-center justify-between group ${
                    activeTab === key 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 scale-[1.02]' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon size={20} />
                    {sections[key].title}
                  </div>
                  <ArrowRight size={16} className={`transition-transform ${activeTab === key ? 'translate-x-0' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                </button>
              );
            })}
          </div>

          {/* Conteúdo Dinâmico */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-50/50 dark:bg-slate-900/30 p-10 lg:p-16 rounded-[3rem] border border-slate-100 dark:border-slate-800"
              >
                <div className="mb-12">
                  <h1 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white mb-3 tracking-tighter">
                    {sections[activeTab].title}
                  </h1>
                  <p className="text-sm font-bold text-slate-400">Última revisão: {sections[activeTab].updated}</p>
                </div>

                <div className="space-y-12">
                  {sections[activeTab].content.map((item, i) => (
                    <div key={i} className="space-y-4">
                      <h3 className="text-xl font-black text-slate-700 dark:text-slate-200">{item.h}</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{item.p}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-400 font-medium italic">
                    Dúvidas sobre nossos termos? Entre em contato pelo e-mail <span className="text-blue-600 font-black">juridico@genioplay.com.br</span>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
