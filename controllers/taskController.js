import crypto from 'crypto';
import Task from '../models/task.js';
import redis from '../lib/redis.js';

const TASKS_CACHE_KEY = 'tasks:all';

// export const getAllTasks = async (req, res) => {
//   try {
//     const { category } = req.query;
//     const cacheKey = category ? `tasks:${category}` : 'tasks:all';
//     const catchedTasks = await redis.get(cacheKey);
//     if(catchedTasks){
//       return res.json(JSON.parse(catchedTasks));
//     }
//     const filter = category ? { category } : {};
//     const tasks = await Task.find(filter).sort('order');

//     await redis.set(cacheKey, JSON.stringify(tasks), 'EX', 300); // Cache for 5 min
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const getAllTasks = async (req, res) => {
  try {
    const { category, completed, search, page = 1, limit = 5 } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 5;

    if (pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ message: 'Page and limit must be positive integers' });
    }

    const filter = {};
    if (category) filter.category = category;
    if (typeof completed !== 'undefined') filter.completed = completed === 'true';
    if (search) filter.$text = { $search: search };

    const skip = (pageNum - 1) * limitNum;

    // 🔐 Create a unique cache key based on query
    const rawKey = JSON.stringify({ filter, skip, limit: limitNum });
    const hash = crypto.createHash('md5').update(rawKey).digest('hex');
    const cacheKey = `tasks:query:${hash}`;

    // ⚡ Try Redis cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('🔁 From cache:', cacheKey);
      return res.json(JSON.parse(cached));
    }

    // 🧠 If not cached, fetch from DB
    const tasks = await Task.find(filter)
      .sort('order')
      .skip(skip)
      .limit(limitNum);

    const total = await Task.countDocuments(filter);

    const response = {
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: total,
      items: tasks,
    };

    await redis.set(cacheKey, JSON.stringify(response), 'EX', 300); // Cache for 5 mins
    console.log('💾 Set cache:', cacheKey);

    res.json(response);
  } catch (error) {
    console.error('Error:', error);
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
