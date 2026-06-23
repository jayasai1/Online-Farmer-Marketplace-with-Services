import mongoose from 'mongoose';
import getModel from './modelFactory.js';

const tractorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    hp: {
      type: Number,
      required: true,
    },
    rentPerHour: {
      type: Number,
      required: true,
    },
    rentPerDay: {
      type: Number,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    location: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 5.0,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const mongooseTractor = mongoose.model('Tractor', tractorSchema);
const Tractor = getModel('Tractor', mongooseTractor);

export default Tractor;
