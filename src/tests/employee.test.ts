import { test, describe, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import app from "@/app.js";

import { jsonParseBigInt } from "@/utils/jsonUtils.js";
import { title } from "process";

const req = supertest(app);
const url = "/employee" as const;

describe(`${url}`, () => {
  describe("GET", () => {
    test("100 employees after the first 10", async () => {
      const res = await req
        .get(`${url}?limit=100&offset=10`)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.results).toHaveLength(100);
    });

    test("employee id 100 (not-existing)", async () => {
      const res = await req
        .get(`${url}/100`)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body).toBeNull();
    });

    test("employee name JaqueS", async () => {
      const res = await req
        .get(`${url}/firstName/JaqueS`)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.id).toBe("10152");
    });

    test("employee salary by id 100 (not-existing)", async () => {
      const res = await req
        .get(`${url}/100/salary`)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body).toBeNull();
    });

    test("employee title by id 53599", async () => {
      const res = await req
        .get(`${url}/53599/title`)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.employee_id).toBe("53599");
    });

    test("employees with title Senior Engineer", async () => {
      const res = await req
        .get(`${url}/title/Senior Engineer`)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.results.length).toBeGreaterThanOrEqual(0);
    });

    test("first 5 employees having 155000 <= salary <= 999999", async () => {
      const res = await req
        .get(`${url}/salary?&limit=5&min_salary=155000&max_salary=999999`)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.employees).toHaveLength(5);
    });

    test("employees hired after 2015 (different formats of date)", async () => {
      const res = await req
        .get(
          `${url}/hired?&limit=5&start_hire_date=01-01-2015&end_hire_date=9999-01-01`
        )
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.employees).toHaveLength(5);
    });

    test("employees by department that does not exist", async () => {
      const res = await req
        .get(`${url}/department?department_id=d123`)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.employees).toHaveLength(0);
    });
  });

  describe("POST", () => {
    const send = {
      employee: {
        birth_date: "1984-09-24",
        first_name: "Jesse",
        last_name: "Pinkman",
        gender: "M",
        hire_date: "2019-10-11",
        id: 600001,
      },
      salary: {
        employee_id: 500098,
        amount: 135000,
        from_date: "2016-10-01",
        to_date: "9999-01-01",
      },
      department: {
        employee_id: 500073,
        department_id: "d016",
        from_date: "2025-09-10",
        to_date: "2030-01-01",
      },
    };

    // clean up test data in tables, just in case tests were ran before.
    afterAll(async () => {
      try {
        await req.delete(`${url}`).send(send.employee);
        await req.delete(`${url}/salary`).send(send.salary);
        await req.delete(`${url}/department`).send(send.department);
      } catch (e) {
        console.log("POST employee: beforeAll: Error caught.");
        console.log(e);
      }
    });

    test(`Hire Jesse Pinkman as Developer Intern`, async () => {
      const res = await req
        .post(`${url}`)
        .send(send.employee)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.new_employee.id).toEqual(send.employee.id.toString());
    });

    test("Add existing employee salary table", async () => {
      const res = await req
        .post(`${url}/salary`)
        .send(jsonParseBigInt(send.salary))
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.new_employee_salary.amount).toEqual(
        send.salary.amount.toString()
      );
    });

    test("Add employee title non-unique composite key", async () => {
      const body = {
        employee_id: 800083,
        title: "Developer Intern",
        from_date: "2024-02-10",
        to_date: "2024-06-10",
      };
      const res = await req
        .post(`${url}/title`)
        .send(body)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(res.body.error_type).toContain("PrismaClientKnownRequestError");
    });

    test("From 2025-09-10 add Young Thug to _Swagonommetry department", async () => {
      const res = await req
        .post(`${url}/department`)
        .send(send.department)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.new_employee_department.from_date).toEqual(
        new Date(send.department.from_date).toISOString()
      );
    });
  });

  describe("PUT", () => {
    const send = {
      salary: {
        employee_id: 500051,
        from_date: "2023-01-01",
      },
      title: {
        employee_id: 500072,
        title: "Senior Code Dealer",
        from_date: "2024-04-01",
      },
      department: {
        employee_id: 500084,
        department_id: "d019",
      },
    };
    beforeAll(async () => {
      try {
        await req.delete(`${url}/salary`).send(send.salary);
        await req.delete(`${url}/title`).send(send.title);
        await req.delete(`${url}/department`).send(send.department);
      } catch (e) {
        console.log("PUT employee: beforeAll: Error caught.");
        console.log(e);
      }
    });

    test("Update new employee salary", async () => {
      const body = {
        ...send.salary,
        amount: 91500,
        to_date: "2025-01-01",
      };
      const res = await req
        .put(`${url}/salary`)
        .send(body)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.old_salary).not.null;
      expect(res.body.new_salary.from_date).equals(
        new Date(body.from_date).toISOString()
      );
    });

    test("Update employee of non existing title", async () => {
      const body = {
        ...send.title,
        to_date: "9999-01-01",
      };
      const res = await req
        .put(`${url}/title`)
        .send(body)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.old_title).not.null;
      expect(res.body.new_title.to_date).equals(
        new Date(body.to_date).toISOString()
      );
    });

    test("Move John Pork to _Instagram Reels", async () => {
      const body = {
        ...send.department,
        from_date: "2024-03-01",
        to_date: "9999-01-01",
      };
      const res = await req
        .put(`${url}/department`)
        .send(body)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.old_department).not.null;
      expect(res.body.new_department.department_id).equals(
        send.department.department_id
      );
    });
  });

  describe("DELETE", async () => {
    // hard coded value from data_test.json
    // essentially can work for any employee
    const employee = {
      id: 500052,
      birth_date: "1998-02-04",
      first_name: "_Quandale",
      last_name: "_Dingle",
      gender: "M",
      hire_date: "2023-07-11",
      amount: 65581,
      department_id: "d015",
      title: "Developer Intern",
    };

    const send = {
      salary: {
        employee_id: 500077,
        amount: 66545,
        from_date: "2025-03-25",
        to_date: "9999-01-01",
      },
      title: {
        employee_id: 500069,
        title: "Developer Intern",
        from_date: "2025-03-25",
      },
      department: {
        employee_id: 500050,
        department_id: "d_50",
      },
    };

    afterAll(async () => {
      try {
        const send_common = {
          employee_id: employee.id,
          from_date: employee.hire_date,
          to_date: "9999-01-01",
        };
        // undo removal of employee and the data
        await req.post(`${url}`).send(employee);
        // need to fix, can be more cleaner tbh
        await req.post(`${url}/salary`).send({
          ...send_common,
          amount: employee.amount,
        });
        await req.post(`${url}/title`).send({
          ...send_common,
          title: employee.title,
        });
        await req.post(`${url}/department`).send({
          ...send_common,
          department_id: employee.department_id,
        });

        await req.post(`${url}/salary`).send(send.salary);
      } catch (e) {
        console.log("DELETE employee: afterAll: Error caught.");
        console.log(e);
      }
    });

    test("Delete _Quandale _Dingle", async () => {
      const res = await req
        .delete(`${url}`)
        .send({ id: employee.id })
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.deleted_employee.id).equal(employee.id.toString());
    });

    test("Delete Kanye West's Salary", async () => {
      const res = await req
        .delete(`${url}/salary`)
        .send(send.salary)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.deleted_salary.amount).equal(
        send.salary.amount.toString()
      );
    });

    test("Delete Employee title wrong date", async () => {
      const res = await req
        .delete(`${url}/title`)
        .send(send.title)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(res.body.error_type).toContain("PrismaClientKnownRequestError");
    });

    test("Delete _FreakBob _Squarepants from not exist department id d_50 (Krusty Krab)", async () => {
      const res = await req
        .delete(`${url}/department`)
        .send(send.department)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(res.body.error_type).toContain("PrismaClientKnownRequestError");
    });
  });
});
