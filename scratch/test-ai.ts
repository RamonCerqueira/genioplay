import { generateStudyContent } from '../src/lib/ai-service';

async function testFallback() {
  console.log("🚀 Iniciando teste de IA...");
  
  // Simulando dados do aluno
  const testData = {
    studentName: "Ramon Teste",
    subject: "Ciências",
    topic: "Ciclo da Água",
    persona: "Professor Divertido",
    gradeLevel: "5º Ano"
  };

  try {
    console.log("📡 Chamando generateStudyContent...");
    const result = await generateStudyContent(testData);
    
    console.log("\n✅ SUCESSO!");
    console.log("-----------------------------------");
    console.log("Título:", result.cards[0].title);
    console.log("Resumo:", result.summary);
    console.log("Questões geradas:", result.questions.length);
    console.log("-----------------------------------");
    
    if (result.summary.includes("exemplo") || result.summary.includes("síntese automática")) {
      console.log("⚠️ AVISO: O sistema retornou dados de MOCK. Verifique as chaves no .env.");
    } else {
      console.log("✨ A IA respondeu com conteúdo real!");
    }

  } catch (error: any) {
    console.error("❌ ERRO NO TESTE:", error.message);
  }
}

testFallback();
