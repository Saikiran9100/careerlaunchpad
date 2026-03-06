import mongoose from 'mongoose'; // <-- Use import
import bcrypt from 'bcryptjs';

const clientSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: String, required: true },
  
  // Profile Fields
  profileImage: { type: String, default: 'https://i.imgur.com/6VBx3io.png' },
  companyName: { type: String, default: '' },
  website: { type: String, default: '' },
  bio: { type: String, default: 'Welcome to my profile!' },
  location: { type: String, default: 'Location not set' },
}, {
  timestamps: true
});

clientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
clientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Client = mongoose.model('Client', clientSchema);
export default Client; // <-- Use export default