import { employee, employee_gender, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedEmployee = Omit<employee, "id">;

async function main() {
  const annaData: SeedEmployee = {
    birth_date: new Date("2000-04-04"),
    first_name: "_anna",
    last_name: "_bando",
    gender: "F",
    hire_date: new Date("2023-03-17"),
  };
  const bobData: SeedEmployee = {
    birth_date: new Date("2005-08-19"),
    first_name: "_bob",
    last_name: "_swagger",
    gender: "M",
    hire_date: new Date("2025-03-17"),
  };

  const anna = await prisma.employee.upsert({
    where: { id: 500001 },
    update: annaData,
    create: annaData,
  });
  const bob = await prisma.employee.upsert({
    where: { id: 500000 },
    update: bobData,
    create: bobData,
  });

  console.log({ anna, bob });
}

try {
  await main();
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
