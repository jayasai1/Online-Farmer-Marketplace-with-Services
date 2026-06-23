import mongoose from 'mongoose';
import getModel from './modelFactory.js';

const bookingSchema = mongoose.Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: ['tractor', 'labor', 'agroservice'],
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'serviceModel',
    },
    serviceModel: {
      type: String,
      required: true,
      enum: ['Tractor', 'Labor', 'AgroService'],
    },
    bookerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    startDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    durationType: {
      type: String,
      required: true,
      enum: ['hours', 'days'],
    },
    totalCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Confirmed',
    },
  },
  {
    timestamps: true,
  }
);

const mongooseBooking = mongoose.model('Booking', bookingSchema);
const Booking = getModel('Booking', mongooseBooking);

export default Booking;
