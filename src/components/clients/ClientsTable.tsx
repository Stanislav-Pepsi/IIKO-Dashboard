import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ClientsTable.module.scss';

// Интерфейс для работы во фронтенде (camelCase)
interface Client {
  id: number;
  name: string;
  uid: string;
  phone: string;
  paymentStatus: number; // 0 = Success (Paid), 1 = NotPaid (Unpaid)
}

export function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Поиск и фильтрация
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'paid' | 'unpaid'>('all');

  // Форма добавления
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', uid: '', phone: '' });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://clientbasepro.onrender.com/api/Clients');
      // Маппим данные, если бэкенд присылает их с большой буквы
      const mappedClients = response.data.map((c: any) => ({
        id: c.id || c.Id,
        name: c.name || c.Name,
        uid: c.uid || c.uid || c.UID,
        phone: c.phone || c.Phone,
        paymentStatus: c.paymentStatus ?? c.PaymentStatus ?? 1
      }));
      setClients(mappedClients);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePaid = async (id: number) => {
    const clientToUpdate = clients.find(c => c.id === id);
    if (!clientToUpdate) return;

    const oldStatus = clientToUpdate.paymentStatus;
    const newStatus = oldStatus === 0 ? 1 : 0;

    setClients(prev => prev.map(c => 
      c.id === id ? { ...c, paymentStatus: newStatus } : c
    ));

    try {
      await axios.patch(`https://clientbasepro.onrender.com/api/Clients/payment/${id}`);
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      setClients(prev => prev.map(c => 
        c.id === id ? { ...c, paymentStatus: oldStatus } : c
      ));
      alert("Не удалось сохранить статус.");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ПРИМЕНЯЕМ СТРУКТУРУ ДРУГА (UID, Name, Phone)
      const payload = {
        UID: newClient.uid,
        Name: newClient.name,
        Phone: newClient.phone,
        IikoCloud: "false", 
        IikoSaas: "false",
        MonthlyFee: 0
      };

      const response = await axios.post('https://clientbasepro.onrender.com/api/Clients', payload);
      
      // Превращаем ответ сервера (с большой буквы) в наш интерфейс (с маленькой)
      const s = response.data;
      const clientToAdd: Client = {
        id: s.id || s.Id,
        name: s.name || s.Name,
        uid: s.uid || s.UID,
        phone: s.phone || s.Phone,
        paymentStatus: s.paymentStatus ?? s.PaymentStatus ?? 1
      };

      setClients(prev => [...prev, clientToAdd]);
      setIsModalOpen(false);
      setNewClient({ name: '', uid: '', phone: '' });
      alert("Клиент успешно добавлен!");
    } catch (err: any) {
      console.error("Ошибка сервера:", err.response?.data);
      const errors = err.response?.data?.errors;
      alert("Ошибка: " + JSON.stringify(errors || err.response?.data));
    }
  };

  const filteredClients = clients
    .filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (filterType === 'paid') return a.paymentStatus - b.paymentStatus;
      if (filterType === 'unpaid') return b.paymentStatus - a.paymentStatus;
      return 0;
    });

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.container}>
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>Новый клиент</h3>
            <form onSubmit={handleAddSubmit}>
              <div className={styles.inputGroup}>
                <label>Имя организации</label>
                <input 
                  type="text"
                  placeholder="Напр: ООО Торт" 
                  value={newClient.name} 
                  onChange={e => setNewClient({...newClient, name: e.target.value})} 
                  required 
                />
              </div>
              <div className={styles.inputGroup}>
                <label>UID (до 11 симв.)</label>
                <input 
                  type="text"
                  placeholder="000-000" 
                  value={newClient.uid} 
                  onChange={e => setNewClient({...newClient, uid: e.target.value})} 
                  required 
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Телефон</label>
                <input 
                  type="text"
                  placeholder="+7..." 
                  value={newClient.phone} 
                  onChange={e => setNewClient({...newClient, phone: e.target.value})} 
                  required 
                />
              </div>
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.addBtn}>Создать</button>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.header}>
        <h2 className={styles.tableName}>Clients Dashboard</h2>
        <div className={styles.actions}>
          <div className={`${styles.searchWrapper} ${isSearchOpen ? styles.open : ''}`}>
            <input 
              type="text" 
              placeholder="Поиск..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={styles.searchBtn}>🔍</button>
          </div>

          <select className={styles.filterSelect} onChange={(e) => setFilterType(e.target.value as any)}>
            <option value="all">Все</option>
            <option value="paid">Оплаченные</option>
            <option value="unpaid">Должники</option>
          </select>

          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            <span>+</span> ADD
          </button>
        </div>
      </div>
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>UID</th>
            <th>Phone</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Paid</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.id} className={styles.tableRow}>
              <td>{client.name}</td>
              <td>{client.uid}</td>
              <td>{client.phone}</td>
              <td>
                <span className={client.paymentStatus === 0 ? styles.statusComplete : styles.statusUnpaid}>
                  {client.paymentStatus === 0 ? 'Paid' : 'Unpaid'}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div 
                  className={`${styles.toggle} ${client.paymentStatus === 0 ? styles.toggleOn : ''}`}
                  onClick={() => togglePaid(client.id)}
                >
                  <div className={styles.circle}></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}