import React, { useEffect, useState } from 'react';
import { taskService } from '../../api/taskService';
import styles from './TaskBoard.module.scss';

export const TaskBoard = () => {
  const [tasks, setTasks] = useState({ new: [], active: [], completed: [] });

  const fetchData = async () => {
    try {
      const [resNew, resActive, resDone] = await Promise.all([
        taskService.getAllTasks(),
        taskService.getActiveTasks(),
        taskService.getCompletedTasks()
      ]);
      setTasks({
        new: resNew.data.items || [], // У друга в GetAllTasks обычно возвращается объект с полем items
        active: resActive.data || [],
        completed: resDone.data || []
      });
    } catch (error) {
      console.error("Ошибка загрузки задач:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className={styles.wrapper}>
      {/* Главный заголовок сверху */}
      <div className={styles.mainHeader}>СПИСОК ЗАДАЧ</div>

      <div className={styles.board}>
        {/* Колонки будут всегда, даже пустые */}
        
        {/* КОЛОНКА 1: НОВЫЕ */}
        <div className={styles.column}>
          <div className={`${styles.arrowHeader} ${styles.newBg}`}>
            Новые задачи <span className={styles.plus}>+</span>
          </div>
          <div className={styles.list}>
            {tasks.new.map((task: any) => (
              <div key={task.id} className={styles.card}>
                <div className={`${styles.badge} ${styles.priorityRed}`}>{task.priority}</div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <button className={styles.actionBtn}>ПРИНЯТЬ В ОБРАБОТКУ</button>
              </div>
            ))}
          </div>
        </div>

        {/* КОЛОНКА 2: В ОБРАБОТКЕ */}
        <div className={styles.column}>
          <div className={`${styles.arrowHeader} ${styles.activeBg}`}>В обработке</div>
          <div className={styles.list}>
            {tasks.active.map((task: any) => (
              <div key={task.id} className={styles.card}>
                <div className={styles.executorBadge}>👤 Исполнитель: {task.executorName || 'Dias'}</div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <button className={styles.actionBtn}>ЗАВЕРШИТЬ</button>
              </div>
            ))}
          </div>
        </div>

        {/* КОЛОНКА 3: ЗАВЕРШЕНЫ */}
        <div className={styles.column}>
          <div className={`${styles.arrowHeader} ${styles.doneBg}`}>Завершены</div>
          <div className={styles.list}>
            {tasks.completed.map((task: any) => (
              <div key={task.id} className={styles.card}>
                <div className={styles.completedBadge}>👤 Выполнил: {task.executorName}</div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <button className={styles.secondaryBtn}>Вернуть в обработку</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};