import mongoose from 'mongoose';
import getModel from './modelFactory.js';

const agroServiceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['borewell', 'motor-repair', 'tractor-repair', 'other'],
    },
    skills: {
      type: [String],
      required: true,
      default: [],
    },
    dailyRate: {
      type: Number,
      required: true,
      default: 0,
    },
    serviceCharge: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      default: 5.0,
    },
    reviews: {
      type: Number,
      required: true,
      default: 0,
    },
    location: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    providerName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const mongooseAgroService = mongoose.model('AgroService', agroServiceSchema);
const AgroService = getModel('AgroService', mongooseAgroService);

export default AgroService;
