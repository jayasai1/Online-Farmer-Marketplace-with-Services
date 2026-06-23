import mongoose from 'mongoose';
import getModel from './modelFactory.js';

const laborSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    crewSize: {
      type: Number,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
      default: [],
    },
    dailyRate: {
      type: Number,
      required: true,
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
    avatar: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const mongooseLabor = mongoose.model('Labor', laborSchema);
const Labor = getModel('Labor', mongooseLabor);

export default Labor;
