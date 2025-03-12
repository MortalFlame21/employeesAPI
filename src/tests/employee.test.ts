import { test, describe } from "vitest";
import supertest from "supertest";
import app from "@/app.js";

const req = supertest(app);

describe("Employee Schema Test", () => {
  describe("GET", () => {
    test("employees", async () => {
      await req
        .get("/employee?limit=100&offset=10")
        .expect("Content-Type", /json/)
        .expect(200);
    });

    test.todo("employee by id", () => {});

    test.todo("employee by firstName", () => {});

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
