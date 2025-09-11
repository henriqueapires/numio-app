import { Suspense } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  return (
    <div className="grid md:grid-cols-2 items-center justify-center md:h-screen bg-background">
      <div className="w-full md:flex items-center justify-center p-8 text-white border-r dark:border-slate-900 md:border-slate-200">
        <Image
          src="/numio-logo2.png"
          alt="Numio Logo"
          className="dark:hidden block"
          width={312}
          height={96}
        />
        <Image
          src="/numio-logo1.png"
          alt="Numio Logo"
          className="hidden dark:block"
          width={312}
          height={96}
        />
      </div>

      <Card className="w-full max-w-md m-auto">
        <CardHeader>
          <CardTitle>Entrar no Numio</CardTitle>
        </CardHeader>

        <CardContent>
          <Suspense
            fallback={
              <div className="text-sm text-muted-foreground">Carregando…</div>
            }
          >
            <SignInForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
