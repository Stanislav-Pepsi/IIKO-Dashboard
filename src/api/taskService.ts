import axios from 'axios';

// 1. Убираем вопрос отсюда. Здесь только чистый путь.
const API_URL = 'https://clientbasepro.onrender.com/api/UserTasks';

export const taskService = {
  // 2. Для получения всех задач (Новые) используем знак вопроса перед параметрами
  getNewTasks: () => axios.get(`${API_URL}?pageNumber=1&pageSize=20`),
  
  // 3. Для остальных методов используем обычный слеш / после названия
  getActiveTasks: () => axios.get(`${API_URL}/active`),
  
  getCompletedTasks: () => axios.get(`${API_URL}/completed`),

  takeTask: (taskId: string) => axios.post(`${API_URL}/take/${taskId}`),

  completeTask: (taskId: string) => axios.patch(`${API_URL}/status/${taskId}`, { status: 'Completed' }),

  deleteTask: (taskId: number) => axios.delete(`${API_URL}/${taskId}`),
  
  createTask: (title: string, description: string, priority: number) => 
  axios.post(API_URL, { title, description, priority }),
};