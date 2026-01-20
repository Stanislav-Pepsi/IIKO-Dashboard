import { useState, useEffect } from 'react';
import axios from 'axios';
import { StatCard } from './StatCard';

export function PaymentStatusStat() {
  const [stats, setStats] = useState<string>('.../...');

  useEffect(() => {
    // Запускаем оба запроса одновременно
    const fetchPayments = async () => {
      try {
        const [paidRes, notPaidRes] = await Promise.all([
          axios.get('https://clientbasepro.onrender.com/api/Clients/paid'),
          axios.get('https://clientbasepro.onrender.com/api/Clients/notpaid')
        ]);

        // Собираем строку в формате "Оплачено/Не оплачено"
        // Если сервер возвращает просто число, используем его напрямую
        setStats(`${paidRes.data}/${notPaidRes.data}`);
      } catch (error) {
        console.error("Ошибка при получении статусов оплаты:", error);
        setStats('Error');
      }
    };

    fetchPayments();
  }, []);

  return (
    <StatCard 
      title="Оплачено / Ожидается" 
      value={stats} 
    />
  );
}