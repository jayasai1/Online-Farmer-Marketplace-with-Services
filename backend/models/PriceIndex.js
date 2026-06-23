import mongoose from 'mongoose';
import getModel from './modelFactory.js';

const priceIndexSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['seeds', 'pesticides', 'fertilizers'],
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    lastMonthPrice: {
      type: Number,
      required: true,
    },
    changePercent: {
      type: Number,
      required: true,
    },
    trend: {
      type: String,
      required: true,
      enum: ['up', 'down', 'flat'],
    },
    history: {
      type: [Number],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const mongoosePriceIndex = mongoose.model('PriceIndex', priceIndexSchema);
const PriceIndex = getModel('PriceIndex', mongoosePriceIndex);

export default PriceIndex;
