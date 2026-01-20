import styles from './StatCard.module.scss';

interface StatCardProps {
  title: string;
  value: string;
  percentage?: string;
}

export function StatCard({ title, value, percentage }: StatCardProps) {
  const isSplitValue = value.includes('/');
  const [mainVal, subVal] = isSplitValue ? value.split('/') : [value, null];

  return (
    <div className={styles.card}>
      <span className={styles.title}>{title}</span>
      
      <div className={styles.statContent}>
        {isSplitValue ? (
          <div className={styles.splitValue}>
            <span className={styles.mainNum}>{mainVal}</span>
            <span className={styles.divider}>/</span>
            <span className={styles.subNum}>{subVal}</span>
          </div>
        ) : (
          <h2 className={styles.value}>{value}</h2>
        )}

        {percentage && (
          <div className={styles.trend}>
            <span className={styles.arrow}>↑</span>
            <span>{percentage}</span>
          </div>
        )}
      </div>
    </div>
  );
}