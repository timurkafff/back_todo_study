import express, { Request, Response } from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Task } from './task';
import cors from 'cors'; // Импортируем cors

const app = express();
const PORT = 3000;
const TASKS_FILE = './task.json';

app.use(cors()); // Разрешаем все origins
app.use(express.json());

// Функция для чтения задач из файла
const readTasks = (): Task[] => {
    const data = fs.readFileSync(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
};

// Функция для записи задач в файл
const writeTasks = (tasks: Task[]) => {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

// 1. Добавить задачу
app.post('/api/tasks', (req: Request, res: Response) => {
    const { title, description, dueDate } = req.body;
    const tasks = readTasks();
    const newTask: Task = {
        id: uuidv4(),
        title,
        description,
        completed: false,
        createdAt: new Date(),
        dueDate: dueDate ? new Date(dueDate) : undefined,
        deleted: false,
        order: 0,
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

// 2. Получить все задачи
app.get('/api/tasks', (req: Request, res: Response) => {
    const tasks = readTasks();
    res.status(200).json(tasks.filter(task => !task.deleted));
});

// 3. Изменить статус задачи
app.patch('/api/tasks/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const tasks = readTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        writeTasks(tasks);
        res.status(200).json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

// 4. Удалить задачу
app.delete('/api/tasks/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].deleted = true;
        writeTasks(tasks);
        res.status(200).json(tasks[taskIndex]);
    } else {
        res.status(404).send('Task not found');
    }
});

// 5. Изменить задачу
app.patch('/api/tasks/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;
    const tasks = readTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
        writeTasks(tasks);
        res.status(200).json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

/// 6. Получить выполненные задачи
app.get('/api/tasks/completed', (req: Request, res: Response) => {
    const tasks = readTasks();
    const completedTasks = tasks.filter(task => task.completed && !task.deleted);
    res.status(200).json(completedTasks);
});

// 7. Получить невыполненные задачи
app.get('/api/tasks/not-completed', (req: Request, res: Response) => {
    const tasks = readTasks();
    const notCompletedTasks = tasks.filter(task => !task.completed && !task.deleted);
    res.status(200).json(notCompletedTasks);
});

// 8. Получить удаленные задачи
app.get('/api/tasks/deleted', (req: Request, res: Response) => {
    const tasks = readTasks();
    const deletedTasks = tasks.filter(task => task.deleted);
    res.status(200).json(deletedTasks);
});

// 9. Изменить порядок задач
app.patch('/api/tasks/order', (req: Request, res: Response) => {
    const { ids }: { ids: string[] } = req.body;
    const tasks = readTasks();
    const orderedTasks = tasks.filter(task => ids.includes(task.id) && !task.deleted);

    // Обновляем порядок задач
    orderedTasks.forEach((task, index) => {
        task.order = index;
    });

    writeTasks(tasks);
    res.status(200).json(orderedTasks);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
