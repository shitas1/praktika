import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/tasks', tasksRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
