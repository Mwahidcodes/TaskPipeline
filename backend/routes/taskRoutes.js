const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware'); // Security layer

// Saare routes ko secure karne ke liye 'auth' middleware lagaya hai

// URL: /api/tasks (Task create karne ke liye)
router.post('/', auth, taskController.createTask);

// URL: /api/tasks (Saare tasks get karne ke liye)
router.get('/', auth, taskController.getTasks);

// URL: /api/tasks/:id (Task ka status update karne ke liye)
router.put('/:id', auth, taskController.updateTaskStatus);

// URL: /api/tasks/:id (Task delete karne ke liye)
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;