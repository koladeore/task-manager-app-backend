import Task from '../models/task.js';
import redis from '../lib/redis.js';

const TASKS_CACHE_KEY = 'tasks:all';

export const getAllTasks = async (req, res) => {
  try {
    const catchedTasks = await redis.get(TASKS_CACHE_KEY);
    if(catchedTasks){
      return res.json(JSON.parse(catchedTasks));
    }
    const tasks = await Task.find().sort('order');
    await redis.set(TASKS_CACHE_KEY, JSON.stringify(tasks), 'EX', 300); // Cache for 5 min
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const lastTask = await Task.findOne().sort('-order');
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = new Task({ ...req.body, order });
    const newTask = await task.save();
    await redis.del(TASKS_CACHE_KEY); // Invalidate cache
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await redis.del(TASKS_CACHE_KEY); // Invalidate cache
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await redis.del(TASKS_CACHE_KEY); // Invalidate cache
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body;
    for (const task of tasks) {
      await Task.findByIdAndUpdate(task._id, { order: task.order });
    }
    await redis.del(TASKS_CACHE_KEY); // Invalidate cache
    res.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
