import styles from "./ModalLogout.module.css";
import CloseIcon from "../../assets/icons/close.svg?react";

export default function ModalLogout({ onConfirm, onCancel }) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onCancel}>
          <CloseIcon className={styles.closeIcon} />
        </button>

        <div className={styles.logoWrapper}>
          <div className={styles.logoIcon}>
            <span className={styles.logoLetter}>PG</span>
            <div className={styles.logoUnderline}></div>
          </div>
          <div className={styles.logoTextWrapper}>
            <span className={styles.logoMainText}>PRESTİJ</span>
            <span className={styles.logoSubText}>GAYRİMENKUL</span>
          </div>
        </div>

        <h2 className={styles.title}>Oturumdan Ayrılıyorsunuz</h2>
        <p className={styles.text}>
          Güvenliğiniz için oturumunuz sonlandırılacaktır. Devam etmek
          istediğinize emin misiniz?
        </p>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Vazgeç
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Oturumu Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
