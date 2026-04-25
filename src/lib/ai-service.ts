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
  let geminiKey = process.env.GEMINI_API_KEY;
  let openaiKey = process.env.OPENAI_API_KEY;

  try {
    const config = await prisma.systemConfig.findUnique({ where: { id: 'global' } });
    if (config?.geminiApiKey) geminiKey = config.geminiApiKey;
    if (config?.openaiApiKey) openaiKey = config.openaiApiKey;
  } catch (error) { }

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

  // 1. TENTATIVA COM GEMINI
  if (geminiKey) {
    const models = ["gemini-1.5-flash", "gemini-1.5-pro"];
    for (const modelName of models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 35000);

          const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${geminiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.6, response_mime_type: "application/json" }
            })
          });

          clearTimeout(timeout);
          const result = await response.json();
          if (result.error) {
            console.error(`Gemini Error (${modelName}):`, result.error);
            continue;
          }

          const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) throw new Error("Resposta vazia do Gemini");

          return parseAIResponse(text);
        } catch (error: any) {
          console.error(`Falha no Gemini (${modelName}, tentativa ${attempt + 1}):`, error.message);
        }
      }
    }
  }

  // 2. FALLBACK PARA OPENAI (GPT-4o-mini)
  if (openaiKey) {
    try {
      console.log("Acionando fallback: OpenAI GPT-4o-mini");
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 35000);

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.6
        })
      });

      clearTimeout(timeout);
      const result = await response.json();
      if (result.error) throw new Error(result.error.message);

      const text = result?.choices?.[0]?.message?.content;
      if (!text) throw new Error("Resposta vazia da OpenAI");

      return parseAIResponse(text);
    } catch (error: any) {
      console.error("Falha na OpenAI (Fallback):", error.message);
    }
  }

  return getMockData(data.topic);
};

export const chatWithAI = async (params: {
  prompt: string,
  history?: { role: string, parts: { text: string }[] }[],
  systemInstruction?: string
}): Promise<string> => {
  let geminiKey = process.env.GEMINI_API_KEY;
  let openaiKey = process.env.OPENAI_API_KEY;

  try {
    const config = await prisma.systemConfig.findUnique({ where: { id: 'global' } });
    if (config?.geminiApiKey) geminiKey = config.geminiApiKey;
    if (config?.openaiApiKey) openaiKey = config.openaiApiKey;
  } catch (error) { }

  const fullHistory = params.history || [];
  const systemPrompt = params.systemInstruction || "Você é um assistente educativo de elite.";

  // 1. Gemini Try
  if (geminiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "Entendido. Serei seu assistente educativo de elite. 🚀" }] },
            ...fullHistory,
            { role: "user", parts: [{ text: params.prompt }] }
          ]
        })
      });

      const result = await response.json();
      if (!result.error && result.candidates?.[0]?.content?.parts?.[0]?.text) {
        return result.candidates[0].content.parts[0].text;
      }
      console.error("Gemini Chat Error:", result.error);
    } catch (e: any) {
      console.error("Gemini Chat Exception:", e.message);
    }
  }

  // 2. OpenAI Fallback
  if (openaiKey) {
    try {
      console.log("Chat Fallback: OpenAI GPT-4o-mini");
      const messages = [
        { role: "system", content: systemPrompt },
        ...fullHistory.map(h => ({
          role: h.role === 'model' ? 'assistant' : 'user',
          content: h.parts[0].text
        })),
        { role: "user", content: params.prompt }
      ];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          temperature: 0.7
        })
      });

      const result = await response.json();
      if (result.choices?.[0]?.message?.content) {
        return result.choices[0].message.content;
      }
      console.error("OpenAI Chat Error:", result.error);
    } catch (e: any) {
      console.error("OpenAI Chat Exception:", e.message);
    }
  }

  return "Desculpe, estou com dificuldades técnicas agora e não consegui processar sua mensagem. Por favor, tente novamente em alguns instantes. 🛠️";
};

// Função auxiliar para processar o JSON da IA de forma segura
function parseAIResponse(text: string): AIStudyPackage {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("JSON não encontrado na resposta");
  const rawContent = JSON.parse(match[0]);

  return {
    summary: rawContent.conteudo?.resumo || "Resumo indisponível",
    cards: [
      { 
        title: rawContent.conteudo?.titulo || "Conteúdo do Estudo", 
        content: rawContent.conteudo?.explicacao || "Não foi possível carregar a explicação." 
      }
    ],
    questions: (rawContent.avaliacao?.questoes || []).map((q: any) => ({
      text: q.pergunta,
      options: q.alternativas,
      correctIndex: q.resposta_correta,
      difficulty: q.dificuldade || 'MEDIUM',
      explanation: q.explicacao
    })),
    bonusQuestions: (rawContent.avaliacao?.bonus || []).map((b: any) => ({
      text: b.pergunta,
      options: ["Entendi!", "Interessante", "Mais ou menos", "Fácil!"],
      correctIndex: 0,
      difficulty: 'BONUS',
      explanation: b.explicacao
    })),
    metadata: rawContent
  };
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
