// connect to right DB --- set before loading db.js
process.env.NODE_ENV = "test";

// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");

let testInvoice;
let testCompany;

beforeEach(async function () {
    const result = await Promise.all([
        db.query(`
            INSERT INTO
            companies (code, name, description)
            VALUES ('lime', 'Lime Company Inc', 'Selling the best limes')
            RETURNING *`),
        db.query(`
            INSERT INTO
            invoices (comp_code, amt) VALUES ('lime', 300)
            RETURNING *`)
    ])

    testInvoice = result[1].rows[0];
    testCompany = result[0].rows[0];
});

describe("GET /invoices", function () {
    test("Gets a list of 1 invoice", async () => {
        const response = await request(app).get(`/invoices`);
        // console.log(response)
        expect(response.statusCode).toEqual(200);
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify({
            'invoices': [testInvoice]
        }));
    });
});



afterEach(async () => {
    // delete any data created by test
    await db.query("DELETE FROM invoices");
    await db.query("DELETE FROM companies")
});

afterAll(async () => {
    // close db connection
    await db.end();
});