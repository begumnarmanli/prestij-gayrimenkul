import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";
import { toggleFavorite } from "../../redux/auth/authSlice";
import HeartIcon from "../../assets/icons/heart.svg?react";
import styles from "./ListingCard.module.css";

export default function ListingCard({ item, onAttention }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [imgError, setImgError] = useState(false);

  const isFavorite = user?.favorites?.includes(item.id) || false;

  const {
    title,
    type,
    listing_type,
    price,
    area,
    rooms,
    city_district,
    neighborhood,
    floor,
    total_floors,
    building_age,
    images,
    is_featured,
  } = item;

  const handleHeartClick = async () => {
    if (!isAuthenticated) {
      onAttention();
      return;
    }

    dispatch(toggleFavorite(item.id));

    try {
      const userRef = doc(db, "users", user.uid);

      if (isFavorite) {
        await updateDoc(userRef, {
          favorites: arrayRemove(item.id),
        });
        toast.info("Favorilerden çıkarıldı.");
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(item.id),
        });
        toast.success("Favorilere eklendi.", {});
      }
    } catch {
      toast.error("Bir hata oluştu, tekrar deneyin.");
    }
  };

  const formatPrice = (p) => {
    if (!p) return "—";
    if (listing_type === "kiralik") return p.toLocaleString("tr-TR") + " ₺/ay";
    return p.toLocaleString("tr-TR") + " ₺";
  };

  return (
    <li className={styles.card}>
      <div className={styles.imgWrap}>
        {images && images.length > 0 && !imgError ? (
          <img
            src={images[0]}
            alt={title}
            className={styles.img}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.imgPlaceholder}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M24 6L4 22H10V42H20V30H28V42H38V22H44L24 6Z"
                fill="var(--background-color-dark)"
                opacity="0.2"
              />
            </svg>
          </div>
        )}
        <span className={styles.typeBadge}>{type}</span>
        <span
          className={`${styles.listingTypeBadge} ${listing_type === "kiralik" ? styles.kiralik : styles.satilik}`}
        >
          {listing_type === "kiralik" ? "Kiralık" : "Satılık"}
        </span>
        {is_featured && <span className={styles.featuredBadge}>Öne Çıkan</span>}
      </div>

      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.location}>
          {neighborhood}, {city_district}
        </p>

        <div className={styles.info}>
          {rooms && rooms !== "—" && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Oda</span>
              <span className={styles.infoValue}>{rooms}</span>
            </div>
          )}
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Alan</span>
            <span className={styles.infoValue}>{area} m²</span>
          </div>
          {floor > 0 && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Kat</span>
              <span className={styles.infoValue}>
                {floor}/{total_floors}
              </span>
            </div>
          )}
          {building_age > 0 && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Bina Yaşı</span>
              <span className={styles.infoValue}>{building_age}</span>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(price)}</span>
          <div className={styles.actions}>
            <Link
              to={`/listings/${item.id}`}
              className={styles.detailBtn}
              onClick={() => !isAuthenticated && onAttention()}
            >
              Detayları Gör
            </Link>
            <button
              className={`${styles.heartBtn} ${isFavorite ? styles.heartActive : ""}`}
              onClick={handleHeartClick}
              type="button"
            >
              <HeartIcon className={styles.heartIcon} />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
