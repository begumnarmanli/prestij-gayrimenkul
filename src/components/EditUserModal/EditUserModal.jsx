import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { updateUser } from "../../redux/auth/authSlice";
import CloseIcon from "../../assets/icons/close.svg?react";
import styles from "./EditUserModal.module.css";

export default function EditUserModal({ onClose }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      };
      await updateDoc(doc(db, "users", user.uid), payload);
      dispatch(updateUser({ ...user, ...payload }));
      toast.success("Profil başarıyla güncellendi!");
      onClose();
    } catch {
      toast.error("Profil güncellenemedi, tekrar deneyin.");
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <CloseIcon />
        </button>

        <h2 className={styles.title}>Bilgileri Düzenle</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ad Soyad"
            className={styles.input}
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (
                !/[\d+\s\-()\]]/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Delete" &&
                e.key !== "Tab" &&
                e.key !== "ArrowLeft" &&
                e.key !== "ArrowRight"
              ) {
                e.preventDefault();
              }
            }}
            placeholder="Telefon"
            className={styles.input}
          />
          <button type="submit" className={styles.saveBtn}>
            Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
