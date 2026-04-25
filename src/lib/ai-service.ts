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
  cards: AICard[];
  questions: AIQuestion[];
  bonusQuestions: AIQuestion[];
}

export const generateStudyContent = async (data: {
  studentName: string,
  subject: string,
  topic: string,
  persona: string,
  gradeLevel: string
}): Promise<AIStudyPackage> => {
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `
    Você é um tutor acadêmico de nível sênior com a persona: "${data.persona}".
    Sua missão é criar um material de estudo PROFUNDO e ABRANGENTE para o aluno "${data.studentName}", que está no ${data.gradeLevel}.
    O assunto é "${data.topic}" (${data.subject}).

    REGRAS PEDAGÓGICAS CRÍTICAS:
    - O conteúdo DEVE ser alinhado à BNCC para o ${data.gradeLevel}.
    - Adapte a complexidade da linguagem e dos exemplos para a idade típica de um aluno do ${data.gradeLevel}.
    - NUNCA dê explicações genéricas ou curtas.
    - Cada card informativo deve conter a teoria explicada de forma clara, seguida de pelo menos 2 exemplos práticos do mundo real adequados à série.
    - Use analogias para facilitar a compreensão de conceitos complexos.

    VOCÊ DEVE RESPONDER APENAS COM UM OBJETO JSON VÁLIDO.
    O JSON deve seguir EXATAMENTE este formato:
    {
      "cards": [
        { "title": "...", "content": "Explicação teórica densa + Analogia + Exemplos 1, 2 e 3" }
      ],
      "questions": [
        { "text": "Pergunta contextualizada", "options": ["A", "B", "C", "D"], "correctIndex": 0, "difficulty": "EASY", "explanation": "Explicação detalhada de por que esta é a resposta correta e por que as outras estão erradas." }
      ],
      "bonusQuestions": [
        { "text": "Desafio de aplicação real", "options": ["A", "B", "C"], "correctIndex": 0, "difficulty": "BONUS", "explanation": "..." }
      ]
    }

    Regras:
    - Gere 3 cards explicativos.
    - Gere 6 questões (3 fáceis, 2 médias, 1 difícil).
    - Gere 2 questões bônus.
    - Use a linguagem da persona.
  `;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY não encontrada. Usando dados mockados.");
    return getMockData(data.topic);
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
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
          temperature: 0.7
        }
      })
    });

    const result = await response.json();
    
    if (result.error) {
      console.error("Erro retornado pelo Gemini:", result.error);
      return getMockData(data.topic);
    }

    const contentText = result.candidates[0].content.parts[0].text;
    const content = JSON.parse(contentText);
    return content as AIStudyPackage;

  } catch (error) {
    console.error("Erro crítico na chamada do Gemini:", error);
    return getMockData(data.topic);
  }
};

function getMockData(topic: string): AIStudyPackage {
  return {
    cards: [
      { title: `Introdução a ${topic}`, content: "Este é um conteúdo de exemplo gerado pelo sistema porque a API do Gemini não está configurada ou a chamada falhou." },
      { title: "Ponto importante", content: "Certifique-se de que a GEMINI_API_KEY está correta nas variáveis de ambiente (.env)." }
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
