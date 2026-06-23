import express from 'express';
import Tractor from '../models/Tractor.js';
import Labor from '../models/Labor.js';
import AgroService from '../models/AgroService.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

const router = express.Router();

// Protect middleware
const protect = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Session expired. Please log in.' });
  }
};

// GET /api/services
router.get('/', async (req, res) => {
  const { bookings, type, search, hpFilter, skillFilter, categoryFilter } = req.query;
  const user = req.session ? req.session.user : null;

  try {
    if (bookings === 'true') {
      if (!user) return res.json([]);
      
      const list = await Booking.find({ bookerId: user.id }).populate('serviceId');
      
      const formatted = await Promise.all(list.map(async (b) => {
        let serviceName = 'Unknown Service';
        let providerName = 'Unknown Provider';
        let crewSize = 1;

        if (b.serviceId) {
          serviceName = b.serviceId.name;
          if (b.serviceType === 'tractor') {
            crewSize = 1;
            const ownerUser = await User.findById(b.serviceId.ownerId);
            providerName = ownerUser ? ownerUser.username : 'Unknown Owner';
          } else if (b.serviceType === 'labor') {
            crewSize = b.serviceId.crewSize;
            providerName = b.serviceId.name; // Labor crew name
          } else if (b.serviceType === 'agroservice') {
            crewSize = 1;
            providerName = b.serviceId.providerName || b.serviceId.name;
          }
        }

        return {
          bookingId: b.bookingCode,
          serviceType: b.serviceType,
          serviceId: b.serviceId ? b.serviceId._id : null,
          tractorName: serviceName, // Client maps tractorName
          laborName: serviceName, // Client maps laborName
          serviceName: serviceName, // General service name
          crewSize,
          owner: providerName,
          startDate: b.startDate ? b.startDate.toISOString().split('T')[0] : '',
          durationType: b.durationType,
          durationValue: b.duration,
          durationDays: b.duration,
          totalCost: b.totalCost,
          status: b.status
        };
      }));

      res.json(formatted);
    } 
    
    else {
      if (type === 'tractor') {
        let filter = {};
        if (search) {
          filter.name = { $regex: search, $options: 'i' };
        }
        if (hpFilter && hpFilter !== 'all') {
          if (hpFilter === 'low') {
            filter.hp = { $lt: 50 };
          } else if (hpFilter === 'high') {
            filter.hp = { $gte: 50 };
          }
        }

        const tractors = await Tractor.find(filter).populate('ownerId');
        
        const formatted = tractors.map(t => ({
          id: t._id,
          name: t.name,
          hp: t.hp,
          rentPerHour: t.rentPerHour,
          rentPerDay: t.rentPerDay,
          owner: t.ownerId ? t.ownerId.username : 'Gurdev',
          location: t.location,
          rating: t.rating,
          description: t.description,
          image: t.image,
          specifications: t.specifications instanceof Map ? Object.fromEntries(t.specifications) : t.specifications
        }));

        res.json(formatted);
      } 
      
      else if (type === 'labor') {
        let filter = {};
        if (search) {
          filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } }
          ];
        }
        if (skillFilter && skillFilter !== 'all') {
          // Check if skill tags include skillFilter (regex matching)
          filter.skills = { $regex: skillFilter, $options: 'i' };
        }

        const labors = await Labor.find(filter);
        res.json(labors.map(l => ({
          id: l._id,
          name: l.name,
          size: l.crewSize,
          dailyRate: l.dailyRate,
          rating: l.rating,
          reviews: l.reviews,
          location: l.location,
          experience: l.experience,
          avatar: l.avatar,
          skills: l.skills
        })));
      } 
      
      else if (type === 'agroservice') {
        // Brand New AgroServices Listing Fetch endpoint!
        let filter = {};
        if (search) {
          filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
            { providerName: { $regex: search, $options: 'i' } }
          ];
        }
        if (categoryFilter && categoryFilter !== 'all') {
          filter.category = categoryFilter;
        }

        const agroServices = await AgroService.find(filter);
        res.json(agroServices.map(s => ({
          id: s._id,
          name: s.name,
          category: s.category,
          skills: s.skills,
          dailyRate: s.dailyRate,
          serviceCharge: s.serviceCharge,
          rating: s.rating,
          reviews: s.reviews,
          location: s.location,
          experience: s.experience,
          providerName: s.providerName,
          avatar: s.avatar
        })));
      } 
      
      else {
        res.status(400).json({ error: 'Invalid type specification.' });
      }
    }
  } catch (err) {
    res.status(500).json({ error: 'Services query database failure.' });
  }
});

// POST /api/services - Book a service
router.post('/', protect, async (req, res) => {
  const { action } = req.body;
  const user = req.session.user;

  if (action === 'book') {
    const { serviceType, serviceId, startDate, duration, durationType, rate } = req.body;

    try {
      const dur = parseInt(duration);
      const rt = parseFloat(rate);
      const totalCost = dur * rt;

      // Determine the correct service model string for polymorphic ref
      let serviceModel = 'Tractor';
      let codePrefix = 'TRAC-';

      if (serviceType === 'labor') {
        serviceModel = 'Labor';
        codePrefix = 'LABR-';
      } else if (serviceType === 'agroservice') {
        serviceModel = 'AgroService';
        codePrefix = 'AGRO-';
      }

      const bookingCode = codePrefix + Math.floor(Math.random() * 900000 + 100000);

      const booking = await Booking.create({
        bookingCode,
        serviceType,
        serviceId,
        serviceModel,
        bookerId: user.id,
        startDate: new Date(startDate),
        duration: dur,
        durationType,
        totalCost,
        status: 'Confirmed'
      });

      res.status(201).json({
        success: true,
        message: 'Booking successful!',
        bookingCode: booking.bookingCode,
        totalCost
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Reservation database registration failed.' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid action.' });
  }
});

export default router;
