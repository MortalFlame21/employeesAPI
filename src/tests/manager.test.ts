import { describe, expect, test } from "vitest";
import supertest from "supertest";
import app from "@/app.js";

import { jsonParseBigInt } from "@/utils/jsonUtils.js";

const req = supertest(app);
const url = "/manager" as const;

describe("Manager", () => {
  describe("GET", () => {
    test("Get 5 managers", async () => {
      const res = await req
        .get(`${url}?limit=5`)
        .expect("Content-type", /json/)
        .expect(200);
      expect(res.body.results).length.greaterThanOrEqual(5);
    });
  });

  describe("POST", () => {
    test("Change manager to _department", () => {});
  });

  describe("PUT", () => {
    test("Add new manager to _department", () => {});
  });

  describe("DELETE", () => {
    test("Delete manager from _department", () => {});
  });
});
