import mongoose from 'mongoose';
import getModel from './modelFactory.js';

const cropSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['grains', 'vegetables', 'fruits', 'others'],
    },
    price: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      default: 'kg',
    },
    quantity: {
      type: Number,
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    isOrganic: {
      type: Boolean,
      required: true,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const mongooseCrop = mongoose.model('Crop', cropSchema);
const Crop = getModel('Crop', mongooseCrop);

export default Crop;
