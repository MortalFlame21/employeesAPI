import {
  type department,
  type employee,
  type department_employee,
  employee_gender,
  PrismaClient,
} from "@prisma/client";

import data from "@/_prisma/data.json" assert { type: "json" };

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

type seedEmployeeType = ReturnType<() => (typeof data)["employees"][number]>;

async function main() {
  // await seedDepartments();
  // await seedEmployees();
  // await seedEmployeeDepartment();
  // await seedEmployeeSalary();
  await seedEmployeeTitle();
  // await seedEmployeeManager();
}

async function seedDepartments() {
  const newDeptData: department = data.department;
  await prisma.department.upsert({
    where: { id: newDeptData.id },
    update: newDeptData,
    create: newDeptData,
  });
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

  Promise.all(
    newEmployeeData.map((data) =>
      prisma.employee.upsert({
        where: { id: data.id },
        update: data,
        create: data,
      })
    )
  );
}

async function seedEmployeeDepartment() {
  const newDept: department = data.department;
  const newEmployees = data.employees.map(({ id, hire_date }) => {
    return {
      id: BigInt(id),
      hire_date: new Date(hire_date),
    };
  });

  Promise.all(
    newEmployees.map((data) => {
      prisma.department_employee
        .upsert({
          where: {
            employee_id_department_id: {
              employee_id: data.id,
              department_id: newDept.id,
            },
          },
          update: {
            employee_id: data.id,
            department_id: newDept.id,
            from_date: data.hire_date,
            to_date: new Date("9999-01-01"),
          },
          create: {
            employee_id: data.id,
            department_id: newDept.id,
            from_date: data.hire_date,
            to_date: new Date("9999-01-01"),
          },
        })
        // won't work without .then OR .catch ???
        // idk why it works for others
        .then((ret) => {
          console.log(ret);
        })
        .catch((e) => {
          console.log(e);
        });
    })
  );
}

async function seedEmployeeSalary() {
  const newEmployeeSalary = data.employees.map(({ id, salary, hire_date }) => {
    return {
      id: BigInt(id),
      amount: salary,
      hire_date: new Date(hire_date),
    };
  });

  Promise.all(
    newEmployeeSalary.map((data) => {
      prisma.salary
        .upsert({
          where: {
            employee_id_from_date: {
              employee_id: data.id,
              from_date: data.hire_date,
            },
          },
          update: {
            employee_id: data.id,
            amount: data.amount,
            from_date: data.hire_date,
            to_date: new Date("9999-01-01"),
          },
          create: {
            employee_id: data.id,
            amount: data.amount,
            from_date: data.hire_date,
            to_date: new Date("9999-01-01"),
          },
        })
        .then((ret) => {
          console.log(ret);
        })
        .catch((e) => {
          console.log(e);
        });
    })
  );
}
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
