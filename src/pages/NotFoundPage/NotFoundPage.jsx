import { useNavigate } from "react-router-dom";
import styles from "./NotFoundPage.module.css";
import { Helmet } from "react-helmet-async";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <Helmet>
        <title>Sayfa Bulunamadı | Prestij Gayrimenkul</title>
        <meta name="description" content="Aradığınız sayfa bulunamadı." />
      </Helmet>
      <div className={styles.content}>
        <div className={styles.errorWrapper}>
          <div className={styles.errorContent}>
            <div className={styles.numberWrapper}>
              <span className={styles.number}>4</span>

              <div className={styles.logoCircle}>
                <div className={styles.logoIcon}>
                  <span className={styles.logoLetter}>PG</span>
                </div>
              </div>

              <span className={styles.number}>4</span>
            </div>

            <p className={styles.message}>Aradığınız sayfa bulunamadı :(</p>

            <button className={styles.homeButton} onClick={() => navigate("/")}>
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
