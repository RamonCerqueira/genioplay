import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { NotificationProvider } from "@/components/ui/NotificationSystem";

export const metadata: Metadata = {
  title: "GênioPlay | Seu aliado na jornada educacional do seu filho.",
  description: "Gamificação e IA para foco escolar inteligente. Transforme o tempo de tela em tempo de aprendizado.",
  keywords: ["educação", "foco", "estudo", "IA", "gamificação", "controle parental"],
  openGraph: {
    title: "GênioPlay | Foco Escolar Inteligente",
    description: "A plataforma que garante que seu filho está estudando de verdade.",
    type: "website",
    locale: "pt_BR",
    url: "https://genioplay.com.br",
  },
  twitter: {
    card: "summary_large_image",
    title: "GênioPlay | Foco Escolar Inteligente",
    description: "Transforme o estudo do seu filho com IA e gamificação.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GênioPlay",
  },
  icons: {
    icon: "/icons/icon-512x512.png",
    apple: "/icons/icon-512x512.png",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased selection:bg-blue-500/30">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
        >
          <NextAuthProvider>
            <NotificationProvider>
              <div className="animate-in fade-in duration-1000">
                {children}
              </div>
            </NotificationProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
