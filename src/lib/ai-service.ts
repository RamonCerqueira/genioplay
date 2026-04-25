export interface AICard {
  title: string;
  content: string;
}

export interface AIQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'BONUS';
  explanation: string;
}

export interface AIStudyPackage {
  summary: string;
  cards: AICard[];
  questions: AIQuestion[];
  bonusQuestions: AIQuestion[];
}

import prisma from '@/lib/prisma';

export const generateStudyContent = async (data: {
  studentName: string,
  subject: string,
  topic: string,
  persona: string,
  gradeLevel: string
}): Promise<AIStudyPackage> => {
  // 1. Tenta buscar a chave do Banco de Dados primeiro (Configuração do Admin)
  // 2. Se não houver no banco, usa a variável de ambiente do .env
  let apiKey = process.env.GEMINI_API_KEY;

  try {
    const config = await prisma.systemConfig.findUnique({ where: { id: 'global' } });
    if (config?.geminiApiKey) {
      apiKey = config.geminiApiKey;
    }
  } catch (error) {
    console.error("Erro ao buscar geminiApiKey no banco, usando fallback .env");
  }

  const prompt = `
    Aja como um PROFESSOR ESPECIALISTA em ensino infantil e fundamental com foco em aprendizado real e profundo.
    
    OBJETIVO:
    Criar um material de estudo PROGRESSIVO e EFICAZ para o aluno "${data.studentName}", que está no ${data.gradeLevel}.
    TEMA: "${data.topic}" (${data.subject}).
    PERSONA DO PROFESSOR: "${data.persona}".

    DIRETRIZES PEDAGÓGICAS (OBRIGATÓRIO):
    1. CONSTRUÇÃO DO CONHECIMENTO: Explique de forma clara e progressiva (Simples → Intermediário → Aprofundado).
    2. O "PORQUÊ" É A CHAVE: Não explique apenas "o que" é o assunto, mas "por que" ele funciona e como ele se aplica no mundo real.
    3. EXEMPLOS PRÁTICOS: Use analogias e exemplos do dia a dia da criança na idade do ${data.gradeLevel}.
    4. ANTICIPAÇÃO DE DÚVIDAS: Identifique e esclareça dentro da explicação as dúvidas mais comuns sobre este tema.
    5. SEM INFANTILIZAÇÃO: Use linguagem adequada, mas não subestime a inteligência do aluno. Foque em aprendizado real.

    TAREFA 1: GERAR UM RESUMO PEDAGÓGICO (summary)
    - Uma síntese de 2 a 3 parágrafos que explique a essência do aprendizado de forma motivadora.

    TAREFA 2: GERAR ENTRE 3 A 6 CARDS DE CONTEÚDO (cards)
    - O número de cards deve depender da complexidade do tema.
    - Card 1: Sempre comece com o Conceito básico e uma Analogia forte.
    - Cards intermediários: Desenvolva a teoria com exemplos práticos e o "porquê" das coisas.
    - Card Final: Conclua com aplicação no mundo real, curiosidade e um incentivo ao estudo.

    TAREFA 3: GERAR 6 QUESTÕES (questions)
    - Dificuldade Progressiva: 2 Fáceis (conceito), 2 Médias (entendimento), 2 Difíceis (aplicação).
    - 4 alternativas cada, apenas 1 correta.
    - Alternativas plausíveis (evite absurdas).
    - FOCO: Testar compreensão real, não memorização.

    TAREFA 4: GERAR 2 QUESTÕES BÔNUS (bonusQuestions)
    - Desafios que exijam raciocínio e explicação do porquê.

    VOCÊ DEVE RESPONDER APENAS COM UM OBJETO JSON VÁLIDO.
    FORMATO EXATO:
    {
      "summary": "string síntese",
      "cards": [
        { "title": "string impactante", "content": "explicação densa e didática" }
      ],
      "questions": [
        { 
          "text": "pergunta contextualizada", 
          "options": ["string","string","string","string"], 
          "correctIndex": 0, 
          "difficulty": "EASY/MEDIUM/HARD", 
          "explanation": "explicação do porquê esta é a correta" 
        }
      ],
      "bonusQuestions": [
        { 
          "text": "pergunta desafio", 
          "options": ["string","string","string"], 
          "correctIndex": 0, 
          "difficulty": "BONUS", 
          "explanation": "explicação do raciocínio" 
        }
      ]
    }

    REGRAS CRÍTICAS:
    - Nunca retornar campos vazios.
    - Linguagem da persona: "${data.persona}".
    - Alinhamento total com a BNCC para o ${data.gradeLevel}.
  `;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY não encontrada. Usando dados mockados.");
    return getMockData(data.topic);
  }

  const models = ["gemini-1.5-flash", "gemini-1.5-pro"];
  let lastError = null;

  for (const modelName of models) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json"
          }
        })
      });

      const result = await response.json();
      
      if (result.error) {
        console.warn(`Erro no modelo ${modelName}:`, result.error.message);
        lastError = result.error;
        continue; // Tenta o próximo modelo
      }

      let contentText = result.candidates[0].content.parts[0].text;
      contentText = contentText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const content = JSON.parse(contentText);
      return content as AIStudyPackage;

    } catch (error: any) {
      console.error(`Erro crítico no modelo ${modelName}:`, error.message);
      lastError = error;
    }
  }

  // Se chegou aqui, todos os modelos falharam
  console.error("Falha total na IA após tentar todos os modelos:", lastError);
  return getMockData(data.topic);
};

function getMockData(topic: string): AIStudyPackage {
  return {
    summary: `Esta é uma síntese automática de exemplo sobre ${topic}. No conteúdo real gerado pela IA, você verá aqui uma explicação pedagógica completa e motivadora sobre o tema.`,
    cards: [
      { title: `Introdução a ${topic}`, content: "Este é um conteúdo de exemplo gerado pelo sistema porque a API do Gemini não está configurada ou a chamada falhou." },
      { title: "Ponto importante", content: "Certifique-se de que a GEMINI_API_KEY está correta nas variáveis de ambiente (.env) ou no painel Admin." }
    ],
    questions: [
      { text: `Qual o conceito principal de ${topic}?`, options: ["Opção A", "Opção B", "Opção C", "Opção D"], correctIndex: 0, difficulty: 'EASY', explanation: "A explicação detalhada apareceria aqui." },
      { text: "Pergunta de nível médio?", options: ["A", "B", "C", "D"], correctIndex: 1, difficulty: 'MEDIUM', explanation: "Explicação da média." },
      { text: "Desafio difícil!", options: ["1", "2", "3", "4"], correctIndex: 2, difficulty: 'HARD', explanation: "Explicação da difícil." }
    ],
    bonusQuestions: [
      { text: "Desafio Bônus Final!", options: ["Sim", "Não"], correctIndex: 0, difficulty: 'BONUS', explanation: "Parabéns por chegar até aqui!" }
    ]
  };
}
