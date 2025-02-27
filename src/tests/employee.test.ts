import { test, describe } from "vitest";
import supertest from "supertest";
import app from "@/app.js";

const req = supertest(app);

describe("Employee Schema Test", () => {
  describe("GET", () => {
    test.todo("employees", ({ expect }) => {});

    test.todo("employee by id", ({ expect }) => {});

    test.todo("employee by firstName", ({ expect }) => {});

    test.todo("employee salary by id", ({ expect }) => {});

    test.todo("employee title by id", ({ expect }) => {});

    test.todo("employees with title", ({ expect }) => {});

    test.todo("employee within salary range", ({ expect }) => {});

    test.todo("employee within hire date", ({ expect }) => {});

    test.todo("employee by department", ({ expect }) => {});
  });

  describe.todo("POST employee", () => {});
  describe.todo("PUT employee", () => {});
  describe.todo("DELETE employee", () => {});
});
