"use client";

import { useState } from "react";
import { registerAndLogin } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerAndLogin(name, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao registrar usuário");
      }
      setLoading(false);
    }
  };
  return (
    <div className="grid grid-cols-2 items-center justify-center h-screen bg-background">
      <div className="w-full h-screen flex items-center justify-center p-8 text-white border-r dark:border-slate-900 border-slate-200 ">
        <img
          src="/numio-logo2.png"
          alt="Numio Logo"
          className="w-78 inline-block dark:hidden"
        />
        <img
          src="/numio-logo1.png"
          alt="Numio Logo"
          className="w-78 hidden dark:inline-block"
        />
      </div>
      <Card className="w-full max-w-md m-auto">
        <CardHeader>
          <Button variant="link" asChild className="absolute top-4 left-4">
            <Link href="/auth/signin">Voltar</Link>
          </Button>
          <CardTitle>Registrar no Numio</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="pb-2">
                Nome
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
              />
            </div>
            <div>
              <Label htmlFor="email" className="pb-2">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="pb-2">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="pb-2">
                Confirmar Senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                onChange={(e) => {
                  if (e.target.value !== password) {
                    setError("As senhas não coincidem");
                  } else {
                    setError(null);
                  }
                }}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !!error}
            >
              {loading ? "Registrando..." : "Registrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
