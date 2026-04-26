import prisma from '@/lib/prisma';

// =========================
// TYPES
// =========================
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
  metadata?: any;
}

// =========================
// MAIN
// =========================
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
  } catch { }

  // =========================
  // CACHE HIT
  // =========================
  const cached = await prisma.aICache.findFirst({
    where: { topic: data.topic },
    orderBy: { createdAt: 'desc' }
  }).catch(() => null);

  if (cached?.content) {
    return cached.content as unknown as AIStudyPackage;
  }

  const prompt = buildPrompt(data);

  // =========================
  // GEMINI
  // =========================
  if (geminiKey) {
    const models = ["gemini-2.0-flash", "gemini-3-flash", "gemini-1.5-flash"];

    for (const model of models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 30000);

          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: controller.signal,
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                  temperature: 0.4,
                  topP: 0.9,
                  topK: 40,
                  response_mime_type: "application/json"
                }
              })
            }
          );

          clearTimeout(timeout);

          const result = await res.json();
          if (result.error) throw new Error(result.error.message);

          const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) throw new Error("Resposta vazia");

          const parsed = parseAIResponse(text);

          await saveCache(data.topic, parsed);

          return parsed;

        } catch (err: any) {
          console.error(`Gemini erro (${model} tentativa ${attempt + 1}):`, err.message);
        }
      }
    }
  }

  // =========================
  // OPENAI FALLBACK
  // =========================
  if (openaiKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
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
          temperature: 0.4
        })
      });

      clearTimeout(timeout);

      const result = await res.json();
      if (result.error) throw new Error(result.error.message);

      const text = result?.choices?.[0]?.message?.content;
      if (!text) throw new Error("Resposta vazia");

      const parsed = parseAIResponse(text);

      await saveCache(data.topic, parsed);

      return parsed;

    } catch (err: any) {
      console.error("OpenAI erro:", err.message);
    }
  }

  return getMockData(data.topic);
};

// =========================
// CHAT
// =========================
export const chatWithAI = async (params: {
  prompt: string,
  history?: any[],
  systemInstruction?: string
}): Promise<string> => {

  const geminiKey = process.env.GEMINI_API_KEY;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: params.systemInstruction || "Assistente educacional." }] },
            ...(params.history || []),
            { role: "user", parts: [{ text: params.prompt }] }
          ]
        })
      }
    );

    const result = await res.json();
    return result?.candidates?.[0]?.content?.parts?.[0]?.text || "Erro IA";

  } catch {
    return "Erro de conexão";
  }
};

// =========================
// PROMPT
// =========================
function buildPrompt(data: any): string {
  return `
Você é um sistema educacional avançado, especialista em ensino adaptativo, pedagogia moderna e explicação profunda.

OBJETIVO:
Gerar um material de estudo COMPLETO, DETALHADO, DIDÁTICO e PROGRESSIVO para o aluno.

DADOS:
Aluno: ${data.studentName}
Matéria: ${data.subject}
Tema: ${data.topic}
Nível: ${data.gradeLevel}
Persona: ${data.persona}
Modo Visual: ${data.visualMode || 'linear'}

---

DIRETRIZES DE QUALIDADE (OBRIGATÓRIO):

- Explique como se estivesse ensinando alguém que NUNCA viu o assunto
- Use linguagem clara, progressiva e sem pular etapas
- Sempre responda:
  - O que é
  - Por que isso existe
  - Como funciona
  - Onde é aplicado na vida real
- Use exemplos práticos e reais
- Use analogias simples quando possível
- Evite respostas curtas ou superficiais
- Evite frases genéricas
- Ensine de forma envolvente

---

CONTEÚDO DEVE TER:

1. Introdução clara ao tema
2. Explicação detalhada passo a passo
3. Exemplos práticos
4. Aplicações reais
5. Possíveis erros comuns
6. Dicas para memorizar
7. Conexões com outros temas

---

AVALIAÇÃO:

- 6 questões obrigatórias:
  - 3 fáceis (conceito básico)
  - 2 médias (interpretação)
  - 1 difícil (raciocínio)
- 2 questões bônus (desafio/reflexão)

Cada questão deve ter:
- Enunciado claro
- 4 alternativas plausíveis
- Apenas 1 correta
- Explicação detalhada da resposta

---

FORMATO JSON OBRIGATÓRIO:

{
  "conteudo": {
    "titulo": "string",
    "explicacao": "explicação EXTREMAMENTE detalhada e didática",
    "resumo": "resumo claro e objetivo"
  },
  "avaliacao": {
    "questoes": [
      {
        "pergunta": "string",
        "alternativas": ["A","B","C","D"],
        "resposta_correta": 0,
        "dificuldade": "EASY|MEDIUM|HARD",
        "explicacao": "explicação completa da resposta"
      }
    ],
    "bonus": [
      {
        "pergunta": "string",
        "resposta_correta_sugerida": "string",
        "explicacao": "explicação do raciocínio"
      }
    ]
  },
  "analise": {
    "acertos": 0,
    "erros": 0,
    "nivel": "iniciante|intermediario|avancado"
  },
  "feedback": {
    "geral": "feedback motivador e explicativo",
    "erros": []
  },
  "plano_estudo": [
    {
      "topico": "string",
      "descricao": "o que estudar",
      "objetivo": "por que estudar isso"
    }
  ],
  "trilha": {
    "modo": "${data.visualMode || 'linear'}",
    "fases": []
  }
}

---

REGRAS FINAIS (CRÍTICO):

- NÃO escrever nada fora do JSON
- NÃO usar markdown
- NÃO resumir demais
- NÃO simplificar demais
- GERAR CONTEÚDO RICO, PROFUNDO E ENSINÁVEL
- GARANTIR QUE O ALUNO CONSIGA APRENDER SÓ COM ESSE MATERIAL
`;
}

// =========================
// PARSER
// =========================
function parseAIResponse(text: string): AIStudyPackage {
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');

    if (start === -1 || end === -1) throw new Error("JSON inválido");

    const json = JSON.parse(cleaned.substring(start, end + 1));

    if (!json.conteudo || !json.avaliacao) {
      throw new Error("Estrutura inválida");
    }

    if ((json.avaliacao.questoes || []).length < 6) {
      throw new Error("Menos de 6 questões");
    }

    return {
      summary: json.conteudo.resumo || "",
      cards: [{
        title: json.conteudo.titulo || "",
        content: json.conteudo.explicacao || ""
      }],
      questions: json.avaliacao.questoes.map((q: any) => ({
        text: q.pergunta || "",
        options: q.alternativas || [],
        correctIndex: Number(q.resposta_correta) || 0,
        difficulty: normalizeDifficulty(q.dificuldade),
        explanation: q.explicacao || ""
      })),
      bonusQuestions: (json.avaliacao.bonus || []).map((b: any) => ({
        text: b.pergunta || "",
        options: ["Ok", "Entendi", "Quase", "Fácil"],
        correctIndex: 0,
        difficulty: "BONUS",
        explanation: b.explicacao || ""
      })),
      metadata: json
    };

  } catch (err) {
    console.error("Parse erro:", err);
    throw err;
  }
}

// =========================
// CACHE
// =========================
async function saveCache(topic: string, data: AIStudyPackage) {
  try {
    await prisma.aICache.create({
      data: {
        topic,
        content: data as any
      }
    });
  } catch (e) {
    console.error("Erro ao salvar cache:", e);
  }
}

// =========================
// NORMALIZER
// =========================
function normalizeDifficulty(level: string): 'EASY' | 'MEDIUM' | 'HARD' | 'BONUS' {
  const map: any = {
    easy: 'EASY',
    medio: 'MEDIUM',
    medium: 'MEDIUM',
    hard: 'HARD',
    dificil: 'HARD'
  };
  return map[(level || '').toLowerCase()] || 'MEDIUM';
}

// =========================
// MOCK
// =========================
function getMockData(topic: string): AIStudyPackage {
  return {
    summary: `Resumo sobre ${topic}`,
    cards: [
      { title: topic, content: "Mock fallback" }
    ],
    questions: Array.from({ length: 6 }).map((_, i) => ({
      text: `Pergunta ${i + 1}`,
      options: ["A", "B", "C", "D"],
      correctIndex: 0,
      difficulty: i < 3 ? 'EASY' : i < 5 ? 'MEDIUM' : 'HARD',
      explanation: ""
    })),
    bonusQuestions: [
      { text: "Bônus", options: ["Ok"], correctIndex: 0, difficulty: 'BONUS', explanation: "" }
    ]
  };
}