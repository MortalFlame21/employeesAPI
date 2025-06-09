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

  describe("POST", () => {
    const body = {
      id: "d021",
      department_name: "_Swagging",
    };

    afterAll(async () => {
      try {
        await req.delete(`${url}/${body.id}`);
      } catch (e) {
        console.log("POST department: afterAll: Error caught.");
        console.log(e);
      }
    });

    test("Create a new department", async () => {
      const res = await req
        .post(`${url}`)
        .send(body)
        .expect("Content-Type", /json/);
      expect(res.body.new_department.id).equals(body.id);
    });
  });

  describe("DELETE", () => {
    const body = {
      id: "d018",
      department_name: "_OS Development",
    };

    afterAll(async () => {
      try {
        await req.post(`${url}`).send(body);
      } catch (e) {
        console.log("DELETE department: afterAll: Error caught.");
        console.log(e);
      }
    });

    test("Create a new department", async () => {
      const res = await req
        .delete(`${url}/${body.id}`)
        .expect("Content-Type", /json/)
        .expect(200);
      expect(res.body.deleted_department.id).equals(body.id);
    });
  });
});
