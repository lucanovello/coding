import mongoose from 'mongoose';

const devicesSchema = new mongoose.Schema({
  brand: { type: String },
  models: [{ type: String }],
});

const Devices = mongoose.model('Devices', devicesSchema);
export default Devices;
