import styles from './App.module.scss';
import { Header } from './components/header/Header';
import { ClientsTable } from './components/clients/ClientsTable';
import { TotalClientsStat } from './components/stats/TotalClientsStat';
import { PaymentStatusStat } from './components/stats/PaymentStatusStat';
import { NewClientsStat } from './components/stats/NewClientsStat';
import { TaskBoard } from './components/tasks/TaskBoard';

function App() {
  return (
    <div className={styles.appContainer}>
      <Header />
      <div style={{display: 'flex', gap: '50px', maxWidth: '1900px'}}>
        <div style={{ flex: 1 }}>
          <div className={styles.grid}>
            <TotalClientsStat />  {/* Используем обертку с логикой запроса */}
            <PaymentStatusStat />
            <NewClientsStat />
          </div>
        <ClientsTable />
        </div>
        <div style={{ flex: 2 }}>
          <TaskBoard />
        </div>
      </div>
      
    </div>
    
  );
}

export default App;
