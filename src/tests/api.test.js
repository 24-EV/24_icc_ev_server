const request = require("supertest");
const app = require("../../index"); // app 객체 export 필요

describe("API 테스트", () => {
  it("GET /api/는 200을 반환해야 한다", async () => {
    const res = await request(app).get("/api/");
    expect(res.statusCode).toBe(200);
  });
});
