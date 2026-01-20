import { useState, useEffect } from 'react';
import axios from 'axios';
import { StatCard } from './StatCard'; // Используем твой шаблон

export function NewClientsStat() {
  const [count, setCount] = useState<number | string>('...');

  useEffect(() => {
    const fetchNewClientsCount = async () => {
      try {
        // Используем Clients во множественном числе, как ты указал
        const response = await axios.get('https://clientbasepro.onrender.com/api/Clients/new/count');
        
        // Если сервер возвращает просто число, записываем его. 
        // Если объект { count: 5 }, то response.data.count
        setCount(response.data); 
      } catch (error) {
        console.error("Ошибка при получении новых клиентов:", error);
        setCount(0);
      }
    };

    fetchNewClientsCount();
  }, []);

  return (
    <StatCard 
      title="Новые клиенты" 
      value={count.toString()}
    />
  );
}