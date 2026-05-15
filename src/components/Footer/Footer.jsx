import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>
          © {currentYear} <span>Prestij Gayrimenkul</span>. Tüm hakları
          saklıdır. |{" "}
          <a
            href="https://github.com/begumnarmanli"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.signature}
          >
            Begüm Narmanlı
          </a>{" "}
          tarafından tasarlanmıştır.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
