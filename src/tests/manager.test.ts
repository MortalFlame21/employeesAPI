import { afterAll, describe, expect, test } from "vitest";
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
    const bodies = [
      {
        employee_id: 500097,
        from_date: "2024-05-13",
        to_date: "9999-01-01",
        department_id: "d017",
      },
      {
        employee_id: 500088,
        from_date: "2025-03-10",
        to_date: "9999-01-01",
        department_id: "d019",
      },
    ] as const;

    afterAll(async () => {
      try {
        await req
          .delete(`${url}`)
          .send({ ...bodies[0], department_id: "d015" });
        await req.delete(`${url}`).send(bodies[1]);
      } catch (e) {
        console.log("POST employee: afterAll: Error caught.");
        console.log(e);
      }
    });

    test("Change manager to _department", async () => {
      const res = await req
        .post(`${url}`)
        .send(bodies[0])
        .expect("Content-type", /json/)
        .expect(200);
      expect(res.body.old_manager).not.null;
      expect(res.body.new_manager.employee_id).equal(
        bodies[0].employee_id.toString()
      );
    });

    test("Change non-manager _Daquavious Pork to _Instagram Reels", async () => {
      const res = await req
        .post(`${url}`)
        .send(bodies[1])
        .expect("Content-type", /json/)
        .expect(400);
      console.log(res.body);
      // UnknownError atm because I don't utilise AggreggateError
      expect(res.body.error_type).toContain("UnknownError");
    });
  });

  describe.todo("PUT", () => {
    afterAll(() => {
      // delete
    });
    test.todo("Add new manager to _department", async () => {});
  });

  describe.todo("DELETE", () => {
    afterAll(() => {
      // put
    });

    test.todo("Delete manager from _department", async () => {});
  });
});
