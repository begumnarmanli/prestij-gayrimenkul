import styles from "./AgentItem.module.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AgentItem({ item, index }) {
  const { title, url, image, workDays, phone, email } = item;
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;
  const todaySchedule = workDays?.[todayIndex];

  return (
    <li className={styles.card} style={{ animationDelay: `${index * 0.1}s` }}>
      <div className={styles.top}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.logoWrap}
        >
          <img src={image} alt={title} className={styles.logo} />
        </a>
        <div className={styles.headerContent}>
          <div className={styles.titleAndBadge}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.title}
            >
              {title}
            </a>
            <div className={styles.scheduleBadge}>
              {todaySchedule && todaySchedule.isOpen
                ? `${todaySchedule.from} — ${todaySchedule.to}`
                : "7/24 Hizmetinizdeyiz"}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.label}>E-posta:</span>
          {email ? (
            <a href={`mailto:${email}`} className={styles.link}>
              {email}
            </a>
          ) : (
            <span className={styles.textOnly}>—</span>
          )}
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Telefon:</span>
          {phone ? (
            <a href={`tel:${phone}`} className={styles.link}>
              {phone}
            </a>
          ) : (
            <span className={styles.textOnly}>—</span>
          )}
        </div>
      </div>
    </li>
  );
}
