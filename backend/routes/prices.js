import express from 'express';
import PriceIndex from '../models/PriceIndex.js';

const router = express.Router();

// GET /api/prices
router.get('/', async (req, res) => {
  const { search, category } = req.query;

  try {
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'all') {
      filter.category = category;
    }

    const prices = await PriceIndex.find(filter);

    const formatted = prices.map(p => ({
      id: p._id,
      name: p.name,
      category: p.category,
      currentPrice: p.currentPrice,
      unit: p.unit,
      lastMonthPrice: p.lastMonthPrice,
      changePercent: p.changePercent,
      trend: p.trend,
      history: p.history
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Price index query database failure.' });
  }
});

export default router;
