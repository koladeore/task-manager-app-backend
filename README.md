# Task Management Application

A robust backend for the Task Management Application, built with Node.js, Express, and MongoDB.

![Task Management App](https://source.unsplash.com/random/1200x630/?productivity,task)

## Features

- ✨ RESTful API for task management
- 🌓 CRUD operations for tasks
- ✅ Task reordering with persistent storage
- 🔍 Error handling
- 🏷️ CORS support for cross-origin requests
- 🎯 Task completion tracking
- 📅 Deadline management
- 🔄 Drag and drop task reordering


## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS for cross-origin support

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running locally
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/koladeore/task-manager-app-backend
cd task-management-app
```

2. Install dependencies
```bash
npm install
```

PORT=5000```env
MONGODB
```
# start the frontend
npm run dev
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/tasks/reorder` - Reorder tasks

## Project Structure

```
task-management-backend/
├── src/
│   ├── controllers/       # Controller functions for handling requests
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
└── server.js              # Entry point of the application
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [Node.js](https://nodejs.org/en)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)