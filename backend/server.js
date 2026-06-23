import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Models for Seeding
import User from './models/User.js';
import Crop from './models/Crop.js';
import Tractor from './models/Tractor.js';
import Labor from './models/Labor.js';
import AgroService from './models/AgroService.js';
import PriceIndex from './models/PriceIndex.js';

// Routes
import authRoutes from './routes/auth.js';
import cropRoutes from './routes/crops.js';
import serviceRoutes from './routes/services.js';
import priceRoutes from './routes/prices.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  seedDatabase();
});

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Session Configuration (mimicking HttpSession)
app.use(session({
  secret: process.env.SESSION_SECRET || 'agromarket_secret_session_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    secure: false, // Set to true if using HTTPS
    sameSite: 'lax'
  }
}));

// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/prices', priceRoutes);

app.get('/', (req, res) => {
  res.send('AgroMarket Pro MERN API Server Running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Internal Error.' });
});

// Auto-seeding routine
async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has data. Skipping self-seeding.');
      return;
    }

    console.log('Seeding Database with sample data...');

    // 1. Seed Users
    const seededUsers = await User.insertMany([
      { username: 'Rajender Singh', email: 'rajender@agromarket.com', phone: '+91 94140 12345', role: 'farmer', location: 'Ludhiana, Punjab', password: 'password123' },
      { username: 'Harpreet Mann', email: 'harpreet@agromarket.com', phone: '+91 94140 54321', role: 'farmer', location: 'Ambala, Haryana', password: 'password123' },
      { username: 'Ramesh Patel', email: 'ramesh@agromarket.com', phone: '+91 98250 99887', role: 'farmer', location: 'Anand, Gujarat', password: 'password123' },
      { username: 'Dev Patel', email: 'dev@agromarket.com', phone: '+91 98980 11223', role: 'buyer', location: 'Mumbai, Maharashtra', password: 'password123' },
      { username: 'Suresh Yadav', email: 'suresh@agromarket.com', phone: '+91 88120 77665', role: 'farmer', location: 'Nasik, Maharashtra', password: 'password123' }
    ]);

    const rajender = seededUsers[0];
    const harpreet = seededUsers[1];
    const ramesh = seededUsers[2];
    const suresh = seededUsers[4];

    // 2. Seed Crops with absolute leading slash image paths
    await Crop.insertMany([
      { name: 'Premium Wheat Grain', category: 'grains', price: 32.00, unit: 'kg', quantity: 1200.00, sellerId: rajender._id, isOrganic: false, description: 'High-yield Sharbati wheat, freshly harvested from Ludhiana. Sun-dried and graded for maximum milling quality.', image: '/images/crop_wheat.png' },
      { name: 'Organic Basmati Rice', category: 'grains', price: 85.00, unit: 'kg', quantity: 500.00, sellerId: harpreet._id, isOrganic: true, description: 'Traditional aromatic long-grain Basmati rice. Cultivated organically using neem cake and compost in Ambala.', image: '/images/crop_rice.png' },
      { name: 'Fresh Red Potatoes', category: 'vegetables', price: 18.00, unit: 'kg', quantity: 2500.00, sellerId: ramesh._id, isOrganic: false, description: 'Firm, freshly dug red potatoes. Ideal for table consumption and processing in Anand, Gujarat.', image: '/images/crop_potato.png' },
      { name: 'Organic Yellow Maize (Corn)', category: 'grains', price: 24.00, unit: 'kg', quantity: 800.00, sellerId: harpreet._id, isOrganic: true, description: 'Excellent quality yellow corn, GMO-free. Highly suitable for poultry feed or organic milling.', image: '/images/crop_market.png' },
      { name: 'Fresh Red Onions', category: 'vegetables', price: 22.00, unit: 'kg', quantity: 1500.00, sellerId: suresh._id, isOrganic: false, description: 'High-grade Nasik onions, well-cured with dried skins. Long shelf life and sharp flavor.', image: '/images/crop_onion.png' }
    ]);

    // 3. Seed Tractors
    await Tractor.insertMany([
      { name: 'John Deere 5050D', hp: 50, rentPerHour: 450.00, rentPerDay: 3500.00, ownerId: rajender._id, location: 'Ludhiana, PB', rating: 4.80, description: 'Highly efficient 4WD heavy-duty tractor. Perfect for deep ploughing and transport.', image: '/images/tractor_johndeere.png', specifications: { 'Cylinders': '3', 'Engine HP': '50 HP', 'Brakes': 'Oil Immersed Brakes', 'Lift Capacity': '1600 Kg' } },
      { name: 'Mahindra Arjun Novo 605', hp: 57, rentPerHour: 500.00, rentPerDay: 4000.00, ownerId: harpreet._id, location: 'Karnal, HR', rating: 4.90, description: 'Advanced tractor with high lift capacity (2200 KG). Perfect for modern rotavators.', image: '/images/tractor_mahindra.png', specifications: { 'Cylinders': '4', 'Engine HP': '57 HP', 'Clutch': 'Dual Diaphragm', 'Transmission': 'Synchromesh' } },
      { name: 'Kubota MU4501', hp: 45, rentPerHour: 400.00, rentPerDay: 3200.00, ownerId: ramesh._id, location: 'Satara, MH', rating: 4.70, description: 'Super smooth Japanese engine with incredible fuel economy. Easy weeding operations.', image: '/images/tractor_kubota.png', specifications: { 'Cylinders': '4', 'Engine HP': '45 HP', 'Fuel Tank': '60 Litres', 'Gear Box': '8 Forward + 4 Reverse' } }
    ]);

    // 4. Seed Labors
    await Labor.insertMany([
      { name: 'Ramesh Kumar & Group', crewSize: 5, skills: ['Harvesting', 'Crop Cutting', 'Loading'], dailyRate: 450.00, rating: 4.90, reviews: 24, location: 'Uttar Pradesh (Willing to travel)', experience: '8+ years in grain harvesting, fast work rate, brings own sickle tools.', avatar: '/images/labor_group.png' },
      { name: 'Sunil Yadav & Group', crewSize: 8, skills: ['Paddy Sowing', 'Ploughing', 'Weeding'], dailyRate: 500.00, rating: 4.80, reviews: 18, location: 'Bihar (Available in Punjab/Haryana)', experience: 'Expert team for water-logged paddy transplantation. Speed and alignment guaranteed.', avatar: '/images/labor_group.png' },
      { name: 'Amit Patel', crewSize: 1, skills: ['Tractor Driving', 'Equipment Operation', 'Drip Setup'], dailyRate: 600.00, rating: 5.00, reviews: 32, location: 'Anand, Gujarat', experience: 'Certified commercial tractor driver. Proficient in operating rotavators and precision levelers.', avatar: '/images/labor_group.png' }
    ]);

    // 5. Seed NEW AgroServices (Specialized repair & drilling professionals!)
    await AgroService.insertMany([
      {
        name: 'Sharma Borewell & Drillers',
        category: 'borewell',
        skills: ['Borewell Drilling', 'Submersible installation', 'Bore Flushing', 'Bore repair'],
        dailyRate: 750.00,
        serviceCharge: 1200.00,
        rating: 4.90,
        reviews: 41,
        location: 'Ludhiana, Punjab',
        experience: 'Over 12 years of professional borewell drilling. Equipped with heavy-duty rig trucks, deep bore cleaners, and state-of-the-art compressor machines.',
        providerName: 'Satish Sharma',
        avatar: '/images/service_borewell.png'
      },
      {
        name: 'Punjab Electrical Motor Repairs',
        category: 'motor-repair',
        skills: ['Submersible Pump Rewinding', 'Capacitor Fitting', 'Starter Box Fixes', 'Monoblock Repair'],
        dailyRate: 450.00,
        serviceCharge: 350.00,
        rating: 4.80,
        reviews: 29,
        location: 'Karnal, Haryana',
        experience: 'Expert technician for single-phase and three-phase agricultural copper wiring motors. Fixes water lifting issues and starter panel short circuits rapidly.',
        providerName: 'Gurpreet Singh',
        avatar: '/images/service_motor.png'
      },
      {
        name: 'Master Tractor Mechanics & Spares',
        category: 'tractor-repair',
        skills: ['Engine Tuning', 'Hydraulics Overhaul', 'Clutch Plate Replacement', 'Tractor Servicing'],
        dailyRate: 650.00,
        serviceCharge: 500.00,
        rating: 4.95,
        reviews: 53,
        location: 'Anand, Gujarat',
        experience: 'Specialized mechanics for John Deere, Mahindra, Sonalika, and Massey Ferguson tractors. Brings own diagnostic kits and guarantees engine overhauls.',
        providerName: 'Kishore Bhai Patel',
        avatar: '/images/service_mechanic.png'
      },
      {
        name: 'Krishna Drip & Pipe Irrigation Technical',
        category: 'other',
        skills: ['Drip Layout Setup', 'Micro Sprinkler Fitting', 'Filter Cleaning', 'Venturi Assembly Repair'],
        dailyRate: 500.00,
        serviceCharge: 400.00,
        rating: 4.75,
        reviews: 22,
        location: 'Nasik, Maharashtra',
        experience: 'Professional agricultural plumbing technician. Specializes in designing custom water flow layouts, clearing pressure blocks, and installing sand filters.',
        providerName: 'Sanjay Yadav',
        avatar: '/images/borewell_repair.png'
      }
    ]);

    // 6. Seed PriceIndex
    await PriceIndex.insertMany([
      { name: 'High-Yield Wheat Seed (HD-2967)', category: 'seeds', currentPrice: 42.00, unit: 'kg', lastMonthPrice: 40.00, changePercent: 5.00, trend: 'up', history: [35, 36, 38, 37, 40, 42] },
      { name: 'Hybrid Tomato Seeds (F1 Shaktiman)', category: 'seeds', currentPrice: 380.00, unit: '10g', lastMonthPrice: 410.00, changePercent: -7.30, trend: 'down', history: [450, 430, 420, 420, 410, 380] },
      { name: 'Neem Oil Organic Pesticide', category: 'pesticides', currentPrice: 280.00, unit: 'Litre', lastMonthPrice: 275.00, changePercent: 1.80, trend: 'up', history: [265, 270, 270, 275, 275, 280] },
      { name: 'Granular Organic Compost', category: 'fertilizers', currentPrice: 15.00, unit: 'kg', lastMonthPrice: 16.00, changePercent: -6.20, trend: 'down', history: [18, 18, 17, 16, 16, 15] },
      { name: 'Glyphosate Weedicide 41% SL', category: 'pesticides', currentPrice: 450.00, unit: 'Litre', lastMonthPrice: 420.00, changePercent: 7.10, trend: 'up', history: [390, 400, 410, 430, 420, 450] }
    ]);

    console.log('Database Seeding Completed Successfully!');
  } catch (error) {
    console.error('Seeding Failed:', error);
  }
}

// Listen
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
