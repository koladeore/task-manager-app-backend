import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, enum: ['Work', 'Personal', 'Urgent'], required: true, index: true },
  completed: { type: Boolean, default: false, index: true },
  deadline: { type: Date, required: true },
  order: { type: Number, default: 0, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

taskSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
taskSchema.index({ title: 'text', description: 'text' });

const Task = mongoose.model('Task', taskSchema);
export default Task;
