import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "henrique@example.com";
  const password = "123456";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Henrique",
      email,
      passwordHash,
      monthlyLimit: null,
    },
  });

  console.log(`Usuário pronto: ${email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
