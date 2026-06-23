import mongoose from 'mongoose';
import getModel from './modelFactory.js';

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['farmer', 'buyer'],
    },
    location: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const mongooseUser = mongoose.model('User', userSchema);
const User = getModel('User', mongooseUser);

export default User;
