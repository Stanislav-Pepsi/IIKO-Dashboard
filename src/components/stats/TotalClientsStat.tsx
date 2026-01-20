import { useState, useEffect } from 'react';
import axios from 'axios';
import { StatCard } from './StatCard'; // путь к твоему файлу


export function TotalClientsStat() {
  const [count, setCount] = useState<string>('...');
  
  useEffect(() => {
    axios.get('https://clientbasepro.onrender.com/api/Clients/count')
      .then(response => {
        // Превращаем число в строку, чтобы StatCard принял его как value
        setCount(response.data.toString());
      })
      .catch(error => {
        console.error("Error fetching count:", error);
        setCount('Error');
      });
  }, []);

  return (
    <StatCard 
      title="Total clients" 
      value={count} 
      percentage="11.2%" // если бэкенд отдаст процент, можно и его заменить
    />
  );
}