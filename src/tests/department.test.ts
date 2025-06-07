import { afterAll, describe, expect, test } from "vitest";
import supertest from "supertest";
import app from "@/app.js";

const req = supertest(app);
const url = "/department" as const;

describe("Department", () => {
  describe("GET", () => {
    test("Get 5 departments", async () => {
      const res = await req
        .get(`${url}?limit=5`)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.results).length.greaterThanOrEqual(5);
    });
  });

  describe.todo("PUT", () => {
    afterAll(() => {});

    test("Get 10 departments", () => {});
  });

  describe.todo("DELETE", () => {
    afterAll(() => {});

    test("Delete department", () => {});
  });
});
