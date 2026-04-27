import { NextResponse } from 'next/server';

export function handleApiError(error: any) {
  console.error('[API_ERROR]:', error);

  let message = 'Ocorreu um erro interno. Nossa equipe técnica já foi notificada.';
  let status = 500;

  // Tratamento de erros conhecidos do Prisma
  if (error.code === 'P2002') {
    message = 'Este registro (e-mail, CPF ou usuário) já está em uso.';
    status = 400;
  } else if (error.code === 'P2025') {
    message = 'O registro solicitado não foi encontrado.';
    status = 404;
  } else if (error.message?.includes('Can\'t reach database')) {
    message = 'Estamos com uma instabilidade momentânea na conexão. Tente novamente em 1 minuto.';
    status = 503;
  }

  // Se estiver em desenvolvimento, podemos mostrar o erro real no console do navegador se necessário,
  // mas para o usuário final (UI), sempre mantemos a mensagem amigável.
  
  return NextResponse.json(
    { 
      success: false, 
      error: message,
      // O código técnico pode ser enviado se não for sensível, para facilitar suporte
      technicalCode: process.env.NODE_ENV === 'development' ? error.code : undefined
    }, 
    { status }
  );
}
