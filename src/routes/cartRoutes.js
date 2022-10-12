import express from 'express';

let router = express.Router();

router.post("/createSale", async (req, res) => {
    let body = req.body;
    console.log(req.body);
    res.json(body);
});

export default router;
