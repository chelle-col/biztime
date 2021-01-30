// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");

let testCompany;

beforeEach(async function() {
  let result = await db.query(`
    INSERT INTO
      companies (code, name, description) 
      VALUES ('lime', 'lime tech inc', 'tech company specializing in limes')
      RETURNING code, name, description`);
  testCompany = result.rows[0];
});

describe("GET /companies", function() {
    test("Gets a list of 1 invoice", async ()=> {
      const response = await request(app).get(`/companies`);
      expect(response.statusCode).toEqual(200);
      expect(JSON.stringify(response.body)).toEqual(JSON.stringify({
        'companies': [testCompany]
      }));
    });
  });



afterEach(async ()=> {
    // delete any data created by test
    await db.query("DELETE FROM companies");
  });
  
  afterAll(async ()=> {
    // close db connection
    await db.end();
  });