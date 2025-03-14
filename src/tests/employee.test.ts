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

    test("employee id 100", async () => {
      const res = await req
        .get(`${url}/100`)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body).toBe(null);
    });

    test("employee name JaqueS (existing)", async () => {
      const res = await req
        .get(`${url}/firstName/JaqueS`)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.id).toBe("10152");
    });

    test.todo("employee salary by id", () => {});

    test.todo("employee title by id", () => {});

    test.todo("employees with title", () => {});

    test.todo("employee within salary range", () => {});

    test.todo("employee within hire date", () => {});

    test.todo("employee by department", () => {});
  });

  describe.todo("POST employee", () => {});
  describe.todo("PUT employee", () => {});
  describe.todo("DELETE employee", () => {});
});
