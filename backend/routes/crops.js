import express from 'express';
import Crop from '../models/Crop.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to block unauthenticated requests for post actions
const protect = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Session expired. Please log in.' });
  }
};

// GET /api/crops
router.get('/', async (req, res) => {
  const { myListings, myOrders, mySales, search, category, organicOnly } = req.query;
  const user = req.session ? req.session.user : null;

  try {
    if (myListings === 'true') {
      if (!user || user.role !== 'farmer') return res.json([]);
      const crops = await Crop.find({ sellerId: user.id });
      
      // format to match client expectations
      const formatted = crops.map(c => ({
        id: c._id,
        name: c.name,
        category: c.category,
        price: c.price,
        unit: c.unit,
        quantity: c.quantity,
        sellerId: c.sellerId,
        seller: user.username,
        location: user.location,
        isOrganic: c.isOrganic,
        description: c.description,
        image: c.image
      }));
      res.json(formatted);
    } 
    
    else if (myOrders === 'true') {
      if (!user || user.role !== 'buyer') return res.json([]);
      const orders = await Order.find({ buyerId: user.id }).populate('cropId');
      
      const formatted = await Promise.all(orders.map(async (o) => {
        let sellerName = 'Unknown';
        if (o.cropId) {
          const seller = await User.findById(o.cropId.sellerId);
          if (seller) sellerName = seller.username;
        }
        return {
          orderId: o.orderCode,
          cropId: o.cropId ? o.cropId._id : null,
          cropName: o.cropId ? o.cropId.name : 'Unknown Crop',
          seller: sellerName,
          buyerName: user.username,
          quantity: o.quantity,
          unit: o.cropId ? o.cropId.unit : 'kg',
          totalCost: o.totalCost,
          date: o.createdAt ? o.createdAt.toISOString().split('T')[0] : '',
          status: o.status
        };
      }));
      res.json(formatted);
    } 
    
    else if (mySales === 'true') {
      if (!user || user.role !== 'farmer') return res.json([]);
      
      // Find crops owned by this farmer
      const cropsOwned = await Crop.find({ sellerId: user.id });
      const cropIds = cropsOwned.map(c => c._id);
      
      const sales = await Order.find({ cropId: { $in: cropIds } }).populate('cropId buyerId');
      
      const formatted = sales.map(s => ({
        orderId: s.orderCode,
        cropId: s.cropId ? s.cropId._id : null,
        cropName: s.cropId ? s.cropId.name : 'Unknown Crop',
        seller: user.username,
        buyerName: s.buyerId ? s.buyerId.username : 'Unknown Buyer',
        quantity: s.quantity,
        unit: s.cropId ? s.cropId.unit : 'kg',
        totalCost: s.totalCost,
        date: s.createdAt ? s.createdAt.toISOString().split('T')[0] : '',
        status: s.status
      }));
      res.json(formatted);
    } 
    
    else {
      // General marketplace search
      let filter = {};
      
      if (search) {
        filter.name = { $regex: search, $options: 'i' };
      }
      if (category && category !== 'all') {
        filter.category = category;
      }
      if (organicOnly === 'true') {
        filter.isOrganic = true;
      }

      const crops = await Crop.find(filter).populate('sellerId');
      
      const formatted = crops.map(c => ({
        id: c._id,
        name: c.name,
        category: c.category,
        price: c.price,
        unit: c.unit,
        quantity: c.quantity,
        sellerId: c.sellerId ? c.sellerId._id : null,
        seller: c.sellerId ? c.sellerId.username : 'Unknown',
        location: c.sellerId ? c.sellerId.location : 'Unknown',
        isOrganic: c.isOrganic,
        description: c.description,
        image: c.image
      }));
      
      res.json(formatted);
    }
  } catch (err) {
    res.status(500).json({ error: 'Crops fetch database failure.' });
  }
});

// POST /api/crops
router.post('/', protect, async (req, res) => {
  const { action } = req.body;
  const user = req.session.user;

  if (action === 'add') {
    if (user.role !== 'farmer') {
      return res.status(403).json({ success: false, message: 'Access denied. Farmers only.' });
    }

    const { name, category, price, unit, quantity, isOrganic, description } = req.body;

    try {
      // Assign fallback image categories using the actual high-quality Indian PNG assets with leading slash
      let image = '/images/crop_market.png';
      const lowercaseName = name.toLowerCase();
      if (category === 'grains') {
        image = lowercaseName.includes('rice') ? '/images/crop_rice.png' : '/images/crop_wheat.png';
      } else if (category === 'vegetables') {
        image = lowercaseName.includes('onion') ? '/images/crop_onion.png' : '/images/crop_potato.png';
      }

      await Crop.create({
        name,
        category,
        price: parseFloat(price),
        unit,
        quantity: parseFloat(quantity),
        sellerId: user.id,
        isOrganic: isOrganic === 'true' || isOrganic === true,
        description,
        image,
      });

      res.status(201).json({ success: true, message: 'Crop listed successfully.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Crop listing creation database failure.' });
    }
  } 
  
  else if (action === 'buy') {
    if (user.role !== 'buyer') {
      return res.status(403).json({ success: false, message: 'Access denied. Buyers only.' });
    }

    const { cropId, quantity, price } = req.body;

    try {
      const crop = await Crop.findById(cropId);
      if (!crop) {
        return res.status(404).json({ success: false, message: 'Crop listing not found.' });
      }

      const orderQty = parseFloat(quantity);
      if (crop.quantity < orderQty) {
        return res.status(400).json({ success: false, message: 'Purchase failed. Crop might be out of stock.' });
      }

      // Decrement quantity stock
      crop.quantity -= orderQty;
      await crop.save();

      const totalCost = orderQty * parseFloat(price);
      const orderCode = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);

      const order = await Order.create({
        orderCode,
        cropId: crop._id,
        buyerId: user.id,
        quantity: orderQty,
        totalCost,
        status: 'Processing',
      });

      res.json({
        success: true,
        message: 'Purchase order placed!',
        orderCode: order.orderCode,
        totalCost,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Order submission database failure.' });
    }
  } 
  
  else if (action === 'delete') {
    if (user.role !== 'farmer') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const { cropId } = req.body;

    try {
      const crop = await Crop.findOneAndDelete({ _id: cropId, sellerId: user.id });
      if (crop) {
        res.json({ success: true });
      } else {
        res.status(404).json({ success: false, message: 'Delete failed. Listing not found.' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Crop delete database failure.' });
    }
  } 
  
  else {
    res.status(400).json({ success: false, message: 'Invalid action.' });
  }
});

export default router;
