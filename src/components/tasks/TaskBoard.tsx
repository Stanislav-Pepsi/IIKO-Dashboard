import { useEffect, useState } from 'react';
import { taskService } from '../../api/taskService';
import styles from './TaskBoard.module.scss';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: number;
  executorName?: string;
}

export const TaskBoard = () => {
  const [tasks, setTasks] = useState<{ new: Task[], active: Task[], completed: Task[] }>({
    new: [], active: [], completed: []
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 3 });

  const fetchData = async () => {
    try {
      const [resNew, resActive, resDone] = await Promise.all([
        taskService.getNewTasks(),
        taskService.getActiveTasks(),
        taskService.getCompletedTasks()
      ]);

      setTasks({
        new: Array.isArray(resNew.data.items) ? resNew.data.items : (Array.isArray(resNew.data) ? resNew.data : []),
        active: Array.isArray(resActive.data) ? resActive.data : [],
        completed: Array.isArray(resDone.data) ? resDone.data : []
      });
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await taskService.createTask(newTask.title, newTask.description, newTask.priority);
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', priority: 3 });
      fetchData();
    } catch (error) {
      alert("Ошибка при создании");
    }
  };

  const getPriorityInfo = (priority: number) => {
    switch (priority) {
      case 1: return { label: 'ОБСЛУЖИВАНИЕ', class: styles.priorityCritical };
      case 2: return { label: 'ВАЖНО', class: styles.priorityImportant };
      case 3: return { label: 'НЕ СРОЧНО', class: styles.priorityNormal };
      default: return { label: 'ОБЫЧНАЯ', class: styles.priorityNormal };
    }
  };

  // Функция для отрисовки колонки (чтобы не дублировать код)
  const renderColumn = (title: string, taskList: Task[], type: 'new' | 'active' | 'completed', bgClass: string) => (
    <div className={styles.column}>
      <div className={`${styles.arrowHeader} ${bgClass}`}>
        {title} {type === 'new' && <span className={styles.plus} onClick={() => setIsModalOpen(true)}>+</span>}
      </div>
      <div className={styles.list}>
        {taskList
          .sort((a, b) => a.priority - b.priority) // Сортируем: 1 (высокий) будет сверху
          .map((task) => {
            const pInfo = getPriorityInfo(task.priority);
            return (
              <div key={task.id} className={`${styles.card} ${pInfo.class}Card`}>
                <div className={styles.cardHeader}>
                  <div className={`${styles.badge} ${pInfo.class}`}>{pInfo.label}</div>
                  {/* Кнопка удаления (крестик или корзина) */}
                  <button className={styles.deleteBtn} onClick={() => handleDelete(task.id)}>×</button>
                </div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                {type === 'new' && <button className={styles.actionBtn}>ПРИНЯТЬ</button>}
                {type === 'active' && <button className={styles.actionBtn}>ЗАВЕРШИТЬ</button>}
              </div>
            );
          })}
      </div>
    </div>
  );

  // 1. Функция удаления
const handleDelete = async (taskId: number) => {
  if (!window.confirm("Удалить задачу?")) return;
  try {
    await taskService.deleteTask(taskId);
    fetchData(); // Обновляем список
  } catch (error) {
    alert("Не удалось удалить задачу");
  }
};

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainHeader}>СПИСОК ЗАДАЧ</div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <form className={styles.modalContent} onSubmit={handleCreate}>
            <h3>Новая задача</h3>
            <input 
              placeholder="Заголовок" 
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              required 
            />
            <textarea 
              placeholder="Описание" 
              value={newTask.description}
              onChange={e => setNewTask({...newTask, description: e.target.value})}
            />
            <select 
              value={newTask.priority} 
              onChange={e => setNewTask({...newTask, priority: Number(e.target.value)})}
            >
              <option value={1}>🔥 ОБСЛУЖИВАНИЕ</option>
              <option value={2}>‼️ ВАЖНО</option>
              <option value={3}>☕️ НЕ СРОЧНО</option>
            </select>
            <div className={styles.modalButtons}>
              <button type="submit" className={styles.saveBtn}>Создать</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>Отмена</button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.board}>
        {renderColumn("Новые задачи", tasks.new, 'new', styles.newBg)}
        {renderColumn("В обработке", tasks.active, 'active', styles.activeBg)}
        {renderColumn("Завершены", tasks.completed, 'completed', styles.doneBg)}
      </div>
    </div>
  );
};