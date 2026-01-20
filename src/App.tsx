import styles from './App.module.scss';
import { Header } from './components/header/Header';
import { ClientsTable } from './components/clients/ClientsTable';
import { TotalClientsStat } from './components/stats/TotalClientsStat';
import { PaymentStatusStat } from './components/stats/PaymentStatusStat';
import { NewClientsStat } from './components/stats/NewClientsStat';

function App() {
  return (
    <div className={styles.appContainer}>
      <Header />

      <div className={styles.grid}>
        <TotalClientsStat />  {/* Используем обертку с логикой запроса */}
        <PaymentStatusStat />
        <NewClientsStat />
      </div>
      
      <ClientsTable />
    </div>
  );
}

export default App;
