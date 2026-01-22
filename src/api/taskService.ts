import axios from 'axios';

const API_URL = 'https://clientbasepro.onrender.com/api/UserTask';

export const taskService = {
  // Получить все новые (незанятые) задачи
  getNewTasks: () => axios.get(`${API_URL}/all?pageNumber=1&pageSize=20`),
  
  // Получить задачи в работе
  getActiveTasks: () => axios.get(`${API_URL}/active`),
  
  // Получить завершенные задачи
  getCompletedTasks: () => axios.get(`${API_URL}/completed`),

  // Взять задачу в работу
  takeTask: (taskId: string) => axios.post(`${API_URL}/take/${taskId}`),

  // Завершить задачу
  completeTask: (taskId: string) => axios.patch(`${API_URL}/status/${taskId}`, { status: 'Completed' })
};