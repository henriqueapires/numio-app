import "./globals.css";
import { Providers } from "./providers";  

export const metadata = {
  title: "Numio",
  description: "Controle suas finanças pessoais",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
