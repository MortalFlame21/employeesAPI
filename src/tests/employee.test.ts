import { test, describe, expect, beforeAll } from "vitest";
import supertest from "supertest";
import app from "@/app.js";

import { jsonParseBigInt } from "@/utils/jsonUtils.js";

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

  describe("POST employee", () => {
    const department = {
      index: { id: 600001 },
      salary: {
        employee_id: 500098,
        from_date: "2016-10-01",
      },
      title: {},
      department: {
        employee_id: 500073,
        department_id: "d010",
      },
    };

    // clean up test data in tables, just in case tests were ran before.
    beforeAll(async () => {
      try {
        await req.delete(`${url}`).send(department.index);
        await req.delete(`${url}/salary`).send(department.salary);
        await req.delete(`${url}/department`).send(department.department);
      } catch (e) {
        console.log("POST employee: beforeAll: Error caught.");
        console.log(e);
      }
    });

    test(`Hire Jesse Pinkman as Developer Intern (id ${department.index.id})`, async () => {
      const body = {
        id: department.index.id,
        birth_date: "1984-09-24",
        first_name: "Jesse",
        last_name: "Pinkman",
        gender: "M",
        hire_date: "2019-10-11",
      };
      const res = await req
        .post(`${url}`)
        .send(body)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.new_employee.id).toEqual(department.index.id.toString());
    });

    test("Add existing employee salary table", async () => {
      const new_salary = 130500;
      const body = {
        employee_id: BigInt(department.salary.employee_id),
        amount: new_salary,
        from_date: department.salary.from_date,
        to_date: "9999-01-01",
      };
      const res = await req
        .post(`${url}/salary`)
        .send(jsonParseBigInt(body))
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.new_employee_salary.amount).toEqual(
        new_salary.toString()
      );
    });

    test("Add employee title non-unique composite key", async () => {
      const body = {
        employee_id: 800083,
        title: "Developer Intern",
        from_date: "2024-02-10",
        to_date: "2024-06-10",
      };
      const res = await req.post(`${url}/title`).send(body).expect(400);
      expect(res.body.error_type).toContain("PrismaClientKnownRequestError");
    });

    test("Move Young Thug to _Gaming department", async () => {
      const body = {
        employee_id: department.department.employee_id,
        department_id: department.department.department_id,
        from_date: "2025-09-10",
        to_date: "2030-01-01",
      };
      const res = await req.post(`${url}/department`).send(body).expect(200);
      console.log(res.body.new_employee_department);
      expect(res.body.new_employee_department.employee_id).toEqual(
        body.employee_id.toString()
      );
    });
  });

  describe.todo("PUT employee", () => {});

  describe.todo("DELETE employee", () => {});
});
