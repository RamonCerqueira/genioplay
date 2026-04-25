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
  metadata?: any; // Armazena a trilha completa, tabuleiro 3D e análise
}

import prisma from '@/lib/prisma';

export const generateStudyContent = async (data: {
  studentName: string,
  subject: string,
  topic: string,
  persona: string,
  gradeLevel: string,
  visualMode?: 'linear' | 'tabuleiro',
  previousAnswers?: any[],
  gabarito?: any[]
}): Promise<AIStudyPackage> => {
  let apiKey = process.env.GEMINI_API_KEY;

  try {
    const config = await prisma.systemConfig.findUnique({ where: { id: 'global' } });
    if (config?.geminiApiKey) apiKey = config.geminiApiKey;
  } catch (error) {}

  const visualMode = data.visualMode || 'linear';
  const prompt = `
    Aja como um sistema educacional avançado, adaptativo e gamificado com suporte a visualização 2D e 3D.
    PERSONA: "${data.persona}".
    TEMA: "${data.topic}"
    IDADE: ${data.gradeLevel} (Alinhado à BNCC)
    ALUNO: "${data.studentName}"
    MODO_VISUAL: "${visualMode}"
    RESPOSTAS_DO_ALUNO: ${JSON.stringify(data.previousAnswers || [])}
    GABARITO: ${JSON.stringify(data.gabarito || [])}

    OBJETIVO:
    Gerar conteúdo de estudo, avaliação, análise de desempenho, feedback personalizado e trilha de aprendizado.

    --- ESTRUTURA JSON OBRIGATÓRIA ---
    {
      "conteudo": {
        "titulo": "string",
        "explicacao": "Explicação didática, clara e progressiva com exemplos reais e o porquê",
        "resumo": "string curto e objetivo"
      },
      "avaliacao": {
        "questoes": [
          { "pergunta": "string", "alternativas": ["A","B","C","D"], "resposta_correta": 0, "dificuldade": "EASY/MEDIUM/HARD", "explicacao": "string" }
        ],
        "bonus": [
          { "pergunta": "string", "resposta_correta_sugerida": "string", "explicacao": "raciocínio" }
        ]
      },
      "analise": { "acertos": 0, "erros": 0, "nivel": "iniciante/intermediario/avancado" },
      "feedback": { "geral": "string", "erros": [{ "questao": "string", "explicacao": "por que errou", "correcao": "ensino do conceito" }] },
      "plano_estudo": [{ "topico": "string", "descricao": "string", "objetivo": "string" }],
      "trilha": {
        "modo": "${visualMode}",
        "fases": [
          {
            "id": 1, "nome": "string", "descricao": "string", "dificuldade": 1, "status": "disponivel",
            "posicao": { "x": 0, "y": 0, "z": 0 }, "conexoes": [2], "tipo_visual": "ilha/planeta/castelo", "cor": "#hex",
            "teste": [{ "pergunta": "string", "alternativas": ["A","B","C","D"], "resposta_correta": 0 }]
          }
        ]
      }
    }

    REGRAS: Retornar APENAS o JSON. 6 questões na avaliação (3 fáceis, 2 médias, 1 difícil). 2 bônus.
  `;

  if (!apiKey) return getMockData(data.topic);

  const models = ["gemini-1.5-flash", "gemini-1.5-pro"];
  let lastError = null;

  for (const modelName of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.6, responseMimeType: "application/json" }
          })
        });

        clearTimeout(timeout);
        const result = await response.json();
        if (result.error) { lastError = result.error; continue; }

        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Vazio");

        const match = text.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("JSON não encontrado");
        const rawContent = JSON.parse(match[0]);

        // Mapeamento para compatibilidade com o frontend atual
        return {
          summary: rawContent.conteudo.resumo,
          cards: [
            { title: rawContent.conteudo.titulo, content: rawContent.conteudo.explicacao }
          ],
          questions: rawContent.avaliacao.questoes.map((q: any) => ({
            text: q.pergunta,
            options: q.alternativas,
            correctIndex: q.resposta_correta,
            difficulty: q.dificuldade || 'MEDIUM',
            explanation: q.explicacao
          })),
          bonusQuestions: rawContent.avaliacao.bonus.map((b: any) => ({
            text: b.pergunta,
            options: ["Entendi!", "Pode repetir?", "Interessante", "Díficil!"], // Fallback pois o bônus agora é aberto
            correctIndex: 0,
            difficulty: 'BONUS',
            explanation: b.explicacao
          })),
          metadata: rawContent // Salva TUDO (trilha, tabuleiro, análise)
        };

      } catch (error: any) {
        lastError = error;
      }
    }
  }

  return getMockData(data.topic);
};

function getMockData(topic: string): AIStudyPackage {
  return {
    summary: `Conteúdo sobre ${topic}`,
    cards: [{ title: `Estudando ${topic}`, content: "Conteúdo temporário..." }],
    questions: [],
    bonusQuestions: []
  };
}
ptions.length !== 4) throw new Error(`Questão bônus ${i+1} deve ter 4 opções`);
  });
}

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
