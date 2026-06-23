import mongoose from 'mongoose';
import getModel from './modelFactory.js';

const orderSchema = mongoose.Schema(
  {
    orderCode: {
      type: String,
      required: true,
      unique: true,
    },
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Crop',
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Processing',
    },
  },
  {
    timestamps: true,
  }
);

const mongooseOrder = mongoose.model('Order', orderSchema);
const Order = getModel('Order', mongooseOrder);

export default Order;
