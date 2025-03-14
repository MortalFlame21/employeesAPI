import { test, describe, expect } from "vitest";
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

    test.todo("employee within hire date", () => {});

    test.todo("employee by department", () => {});
  });

  describe.todo("POST employee", () => {});
  describe.todo("PUT employee", () => {});
  describe.todo("DELETE employee", () => {});
});
