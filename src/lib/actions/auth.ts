import { signIn } from "next-auth/react";

export async function registerAndLogin(
  name: string,
  email: string,
  password: string
) {
  const registerRes = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!registerRes.ok) {
    const errorData = await registerRes.json();
    throw new Error(errorData.error || "Erro ao registrar usuário");
  }

  const loginRes = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });
  if (loginRes?.error) {
    throw new Error(loginRes.error);
  }
  return loginRes;
}
