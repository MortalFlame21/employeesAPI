import {
  type department,
  type employee,
  employee_gender,
  PrismaClient,
} from "@prisma/client";

import data from "@/_prisma/data.json" assert { type: "json" };

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

type seedEmployeeType = ReturnType<() => (typeof data)["employees"][number]>;

async function main() {
  await seedDepartments();
  await seedEmployees();

  // await seedEmployeeDepartment();
  // await seedEmployeeSalary();
  // await seedEmployeeTitle();
  // await seedEmployeeManager();
}

async function seedDepartments() {
  const newDepartmentData: department[] = data.departments;
  Promise.all(
    newDepartmentData.map((data) =>
      prisma.department.upsert({
        where: { id: data.id },
        update: data,
        create: data,
      })
    )
  );
}

async function seedEmployees() {
  const newEmployeeData: employee[] = data.employees.map(
    ({ id, birth_date, first_name, last_name, gender, hire_date }) => {
      return {
        id: BigInt(id),
        birth_date: new Date(birth_date),
        first_name,
        last_name,
        gender: gender as employee_gender,
        hire_date: new Date(hire_date),
      };
    }
  );

  for (const data of newEmployeeData) {
    await prisma.employee.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
}

async function seedEmployeeDepartment() {}
async function seedEmployeeSalary() {}
async function seedEmployeeTitle() {}
async function seedEmployeeManager() {}

try {
  await main();
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
