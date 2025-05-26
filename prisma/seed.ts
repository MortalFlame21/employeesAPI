import {
  type department,
  type employee,
  type department_employee,
  type salary,
  type department_manager,
  type title,
  type employee_gender,
  PrismaClient,
} from "@prisma/client";

/*
  notes:
  - idk why i need to use .then and then .catch on some, I am thinking for the ones
    with that nested where clause.
  - might need to do add dependency between the async functions.
*/

import data from "@/_prisma/data.json" with { type: "json" };

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  await seedDepartments();
  await seedEmployees();

  await seedEmployeeDepartment();
  await seedEmployeeSalary();
  await seedEmployeeTitle();
  await seedEmployeeManager();
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
  const newDepartment: department = data.department;
  const newEmployees: department_employee[] = data.employees.map(
    ({ id, hire_date }) => {
      return {
        employee_id: BigInt(id),
        department_id: newDepartment.id,
        from_date: new Date(hire_date),
        to_date: new Date("9999-01-01"),
      };
    }
  );

  Promise.all(
    newEmployees.map((data) => {
      prisma.department_employee
        .upsert({
          where: {
            employee_id_department_id: {
              employee_id: data.employee_id,
              department_id: newDepartment.id,
            },
          },
          update: data,
          create: data,
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
  const newEmployeeSalary: salary[] = data.employees.map(
    ({ id, salary, hire_date }) => {
      return {
        employee_id: BigInt(id),
        from_date: new Date(hire_date),
        to_date: new Date("9999-01-01"),
        amount: BigInt(salary),
      };
    }
  );

  Promise.all(
    newEmployeeSalary.map((data) => {
      prisma.salary
        .upsert({
          where: {
            employee_id_from_date: {
              employee_id: data.employee_id,
              from_date: data.from_date,
            },
          },
          update: data,
          create: data,
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

async function seedEmployeeTitle() {
  const newEmployeeTitle: title[] = data.employees.map(
    ({ id, is_manager, hire_date }) => {
      return {
        employee_id: BigInt(id),
        title:
          (is_manager ? data.titles.at(0) : data.titles.at(1)) ??
          "Unknown gamer",
        from_date: new Date(hire_date),
        to_date: new Date("9999-01-01"),
      };
    }
  );

  Promise.all(
    newEmployeeTitle.map((data) => {
      prisma.title
        .upsert({
          where: {
            employee_id_title_from_date: {
              employee_id: data.employee_id,
              title: data.title,
              from_date: data.from_date,
            },
          },
          update: data,
          create: data,
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

async function seedEmployeeManager() {
  const newDepartment: department = data.department;
  const newEmployeeManager: department_manager[] = data.employees
    .filter(({ is_manager }) => is_manager)
    .map(({ id, hire_date }) => {
      return {
        employee_id: BigInt(id),
        department_id: newDepartment.id,
        from_date: new Date(hire_date),
        to_date: new Date("9999-01-01"),
      };
    });

  Promise.all(
    newEmployeeManager.map((data) => {
      prisma.department_manager
        .upsert({
          where: {
            employee_id_department_id: {
              employee_id: data.employee_id,
              department_id: data.department_id,
            },
          },
          update: data,
          create: data,
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

try {
  await main();
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
