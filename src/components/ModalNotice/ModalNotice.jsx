import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { doc, setDoc, deleteDoc } from "firebase/firestore/lite";
import { db } from "../../firebase";
import { updateUser } from "../../redux/auth/authSlice";
import { toast } from "react-toastify";
import HeartIcon from "../../assets/icons/heart.svg?react";
import CloseIcon from "../../assets/icons/close.svg?react";
import styles from "./ModalNotice.module.css";

export default function ModalNotice({ item, onClose }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const isFavorite = user?.favorites?.includes(item.id);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleFavorite = async () => {
    if (!user?.uid) return;

    const favRef = doc(db, "users", user.uid, "favorites", item.id);
    const newFavorites = isFavorite
      ? user.favorites.filter((id) => id !== item.id)
      : [...(user.favorites || []), item.id];

    try {
      if (isFavorite) {
        await deleteDoc(favRef);
        toast.info("Favorilerden çıkarıldı.");
      } else {
        await setDoc(favRef, { listingId: item.id, addedAt: new Date() });
        toast.success("Favorilere eklendi!");
      }
      dispatch(updateUser({ ...user, favorites: newFavorites }));
      onClose();
    } catch {
      toast.error("Hata oluştu.");
    }
  };

  const formatPrice = (p) => {
    if (!p) return "—";
    if (item.listing_type === "kiralik")
      return p.toLocaleString("tr-TR") + " ₺/ay";
    return p.toLocaleString("tr-TR") + " ₺";
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <CloseIcon className={styles.closeIcon} />
        </button>

        <div className={styles.categoryBadge}>{item.type || "İlan"}</div>

        <div className={styles.imageWrapper}>
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className={styles.image}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  d="M24 6L4 22H10V42H20V30H28V42H38V22H44L24 6Z"
                  fill="#1A2E5A"
                  opacity="0.2"
                />
              </svg>
            </div>
          )}
        </div>

        <h2 className={styles.title}>{item.title}</h2>

        <p className={styles.location}>
          {item.neighborhood}, {item.city_district}
        </p>

        <div className={styles.info}>
          {item.rooms && item.rooms !== "—" && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Oda Sayısı</span>
              <span className={styles.infoValue}>{item.rooms}</span>
            </div>
          )}
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Alan</span>
            <span className={styles.infoValue}>{item.area} m²</span>
          </div>
          {item.floor > 0 && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Kat</span>
              <span className={styles.infoValue}>
                {item.floor}/{item.total_floors}
              </span>
            </div>
          )}
          {item.building_age > 0 && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Bina Yaşı</span>
              <span className={styles.infoValue}>{item.building_age}</span>
            </div>
          )}
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>İlan Tipi</span>
            <span className={styles.infoValue}>
              {item.listing_type === "kiralik" ? "Kiralık" : "Satılık"}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Fiyat</span>
            <span className={styles.infoValue}>{formatPrice(item.price)}</span>
          </div>
        </div>

        {item.description && (
          <p className={styles.comment}>{item.description}</p>
        )}

        <div className={styles.actions}>
          <button
            className={`${styles.favoriteBtn} ${isFavorite ? styles.isFav : ""}`}
            onClick={handleFavorite}
          >
            {isFavorite ? "Favorilerden Kaldır" : "Favoriye Ekle"}
            <HeartIcon className={styles.heartIcon} />
          </button>

          <a
            href={`tel:${item.agentPhone || "+905000000000"}`}
            className={styles.contactBtn}
          >
            Danışmanı Ara
          </a>
        </div>
      </div>
    </div>
  );
}
