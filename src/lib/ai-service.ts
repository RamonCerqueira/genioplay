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
  trilha?: {
    modo: string;
    fases: any[];
  };
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

  const prompt = data.visualMode === 'tabuleiro' ? buildBoardPrompt(data) : buildLinearPrompt(data);

  // =========================
  // GEMINI
  // =========================
  if (geminiKey) {
    const models = ["gemini-flash-latest", "gemini-2.0-flash", "gemini-3-flash", "gemini-1.5-flash"];

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

      const prompt = data.visualMode === 'tabuleiro' ? buildBoardPrompt(data) : buildLinearPrompt(data);
      
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`,
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
// PROMPTS ESPECIALIZADOS
// =========================

function buildLinearPrompt(data: any): string {
  return `
Você é um Tutor Senior. Gere uma lição LINEAR e PROFUNDA.
Foco: Explicação textual rica e sequência de flashcards.

TEMA: ${data.topic}
ALUNO: ${data.studentName} (${data.gradeLevel})
PERSONA: ${data.persona}

ESTRUTURA JSON:
{
  "summary": "resumo",
  "conteudo": { "titulo": "string", "explicacao": "longa", "resumo": "curto" },
  "avaliacao": { "questoes": [], "bonus": [] },
  "trilha": { "modo": "linear", "fases": [] }
}
(Siga as diretrizes de profundidade pedagógica)`;
}

function buildBoardPrompt(data: any): string {
  return `
Você é um Game Designer Educacional. Gere um TABULEIRO DE AVENTURA.
Foco: Transformar o tema "${data.topic}" em uma jornada com fases.

DADOS: ${data.studentName}, ${data.gradeLevel}, Persona: ${data.persona}

REGRAS DO TABULEIRO:
- Crie de 3 a 5 fases no campo "fases".
- Cada fase deve ser um sub-tópico do tema principal.
- Use coordenadas X, Y entre -2 e 2 para espalhar no mapa.
- tipos_visuais permitidos: 'ilha', 'planeta', 'plataforma', 'castelo'.

ESTRUTURA JSON:
{
  "summary": "resumo da aventura",
  "conteudo": { "titulo": "Nome do Mundo", "explicacao": "Intro", "resumo": "" },
  "avaliacao": { "questoes": [], "bonus": [] },
  "trilha": { 
     "modo": "tabuleiro", 
     "fases": [
       { "id": 1, "nome": "Subtópico", "posicao": {"x":0,"y":0,"z":0}, "tipo_visual": "ilha", "conexoes": [2], "teste": [] }
     ] 
  }
}
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
      metadata: json,
      trilha: json.trilha || { modo: 'linear', fases: [] }
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