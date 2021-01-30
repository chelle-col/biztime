const db = require("../db");
const ExpressError = require("../expressError");

const express = require('express');
const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(
            `SELECT * FROM companies`);
        return res.json(results.rows);
    } catch (e) {
        return next(e);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const {
            code,
            name,
            desc
        } = req.body;
        const results = await db.query(
            `INSERT INTO companies (code, name, description) 
            VALUES ($1, $2, $3) RETURNING *`,
            [code, name, desc]);

        return res.json({
            'company': results.rows
        });
    } catch (e) {
        return next(e);
    }
})

router.get('/:code', async (req, res, next) => {
    try {
        const company = await db.query(
            `SELECT * FROM companies
            WHERE code = $1`,
            [req.params.code]);

        if (company.rows.length === 0) {
            throw new ExpressError('Company Not Found', 404);
        }

        const invoices = await db.query(
            `SELECT * FROM invoices
            WHERE comp_code=$1`,
            [req.params.code]
        )

        return res.json({
            'company': 
                company.rows,
            'invoices': invoices.rows
        });
    } catch (e) {
        return next(e);
    }
})


router.put('/:code', async (req, res, next) => {
    try {
        const {
            name,
            desc
        } = req.body;
        const results = await db.query(
            `UPDATE companies SET name=$1, description=$2
            WHERE code = $3
            RETURNING code, name, description`,
            [name, desc, req.params.code]);

        if (results.rows.length === 0) {
            throw new ExpressError('Company Not Found', 404);
        }

        return res.json({
            'company': results.rows
        });
    } catch (e) {
        return next(e);
    }
})

router.delete('/:code', async (req, res, next) => {
    try {
        const results = await db.query(
            `DELETE FROM companies 
            WHERE code = $1
            RETURNING code`,
            [req.params.code]);

        if (results.rows.length === 0) {
            throw new ExpressError('Company Not Found', 404);
        }
        
        return res.json({
            'message': 'deleted'
        });
    } catch (e) {
        return next(e);
    }
})

module.exports = router;