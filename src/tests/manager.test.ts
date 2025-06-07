import { afterAll, describe, expect, test } from "vitest";
import supertest from "supertest";
import app from "@/app.js";

const req = supertest(app);
const url = "/manager" as const;

describe("Manager", () => {
  describe("GET", () => {
    test("Get 5 managers", async () => {
      const res = await req
        .get(`${url}?limit=5`)
        .expect("Content-Type", /json/)
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
        await req.delete(`${url}`).send(bodies[0]);
        await req.delete(`${url}`).send(bodies[1]);
      } catch (e) {
        console.log("POST employee: afterAll: Error caught.");
        console.log(e);
      }
    });

    test("Add manager to another department", async () => {
      const res = await req
        .post(`${url}`)
        .send(bodies[0])
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.new_manager.employee_id).equal(
        bodies[0].employee_id.toString()
      );
    });

    test("Add non-manager _Daquavious Pork to _Instagram Reels", async () => {
      const res = await req
        .post(`${url}`)
        .send(bodies[1])
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.new_manager.employee_id).equal(
        bodies[1].employee_id.toString()
      );
    });
  });

  describe("PUT", () => {
    const bodies = [
      {
        employee_id: 500091,
        department_id: "d019",
        from_date: "2030-07-03",
        to_date: "9999-01-01",
      },
      {
        employee_id: 500055,
        department_id: "d016",
        from_date: "2025-06-09",
        to_date: "9999-01-01",
      },
    ] as const;

    afterAll(async () => {
      await req.delete(`${url}`).send(bodies[0]);
      await req.delete(`${url}`).send(bodies[1]);
    });

    test("Change manager to _Procrastination", async () => {
      const res = await req
        .put(`${url}`)
        .send(bodies[0])
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.old_manager).not.null;
      expect(res.body.new_manager.to_date).equal(
        new Date(bodies[1].to_date).toISOString()
      );
    });

    test("Add non-manager _Pinkpantheress to _Swagonometry", async () => {
      const res = await req
        .put(`${url}`)
        .send(bodies[1])
        .expect("Content-Type", /json/)
        .expect(400);
      // UnknownError atm because I don't utilise AggregateError
      expect(res.body.error_type).toContain("UnknownError");
    });
  });

  describe("DELETE", () => {
    const body = {
      employee_id: 500092,
      department_id: "d015",
      from_date: "2014-10-04",
      to_date: "9999-01-01",
    };

    afterAll(async () => {
      try {
        await req.post(`${url}`).send(body);
      } catch (e) {
        console.error("DELETE department_employee: afterAll: Error caught.");
        console.error(e);
      }
    });

    test("Delete manager from _Internship", async () => {
      const res = await req
        .delete(`${url}`)
        .send(body)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.deleted_manager.employee_id).equal(
        body.employee_id.toString()
      );
      expect(res.body.deleted_manager.department_id).equal(body.department_id);
    });
  });
});
