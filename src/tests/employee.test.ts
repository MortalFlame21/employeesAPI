import { test, describe, expect, beforeAll } from "vitest";
import supertest from "supertest";
import app from "@/app.js";

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
    const id = 600001;

    beforeAll(async () => {
      try {
        await req.delete(`${url}`).send({ id: id });
      } catch (e) {
        console.log("POST employee: beforeAll: Error caught.");
        console.log(e);
      }
    });

    test(`Hire Jesse Pinkman as Developer Intern (id ${id})`, async () => {
      const body = {
        id: id,
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
      expect(res.body.new_employee.id).toEqual(id.toString());
    });

    test.todo("Add Walter White income to table (exists)", async () => {
      const res = await req.post(`${url}/salary`).expect(400);
    });

    test.todo("Add employee title Walter White", async () => {
      const res = await req.post(`${url}/title`).expect(200);
    });

    test.todo("Add Gus Fring to new department", async () => {
      const res = await req.post(`${url}/department`).expect(200);
    });
  });

  describe.todo("PUT employee", () => {});

  describe.todo("DELETE employee", () => {});
});
