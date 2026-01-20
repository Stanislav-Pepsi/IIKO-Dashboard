import styles from './Header.module.scss';
import logo from '../../assets/logo.png'

export function Header() {
  return (
    <header className={styles.header}>
      <a href="/" className={styles.logoLink}>
        <img src={logo} alt="На главную" className={styles.logo} />
      </a>
    </header>
  );
}