const db = require("../db");
const ExpressError = require("../expressError");

const express = require('express');
const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(
            `SELECT * FROM invoices`);
        return res.json(results.rows);
    } catch (e) {
        return next(e);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const {
            comp_code,
            amt
        } = req.body;
        const results = await db.query(
            `INSERT INTO invoices (comp_code, amt) 
            VALUES ($1, $2) RETURNING *`,
            [comp_code, amt]);

        return res.json({
            'invoice': results.rows
        });
    } catch (e) {
        return next(e);
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const {
            amt
        } = req.body;
        const results = await db.query(
            `UPDATE invoices SET amt=$1
            WHERE id = $2
            RETURNING *`,
            [amt, req.params.id]);

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

router.delete('/:id', async (req, res, next) => {
    try {
        const results = await db.query(
            `DELETE FROM invoices 
            WHERE id = $1
            RETURNING id`,
            [req.params.id]);

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