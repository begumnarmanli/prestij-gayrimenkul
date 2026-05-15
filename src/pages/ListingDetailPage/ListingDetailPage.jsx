import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore/lite";
import { db } from "../../firebase";
import { toggleFavorite } from "../../redux/auth/authSlice";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "leaflet/dist/leaflet.css";
import MapComponent from "../../components/MapComponent/MapComponent";
import { neighborhoodCoords } from "../../data/neighborhoodCoords";
import HeartIcon from "../../assets/icons/heart.svg?react";
import styles from "./ListingDetailPage.module.css";

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [imgError, setImgError] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const isFavorite = user?.favorites?.includes(id) || false;

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchListing();
  }, [id]);

  if (!listing)
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
      </div>
    );

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
    description,
  } = listing;

  const coords = neighborhoodCoords[neighborhood];

  const formatPrice = (p) => {
    if (!p) return "—";
    if (listing_type === "kiralik") return p.toLocaleString("tr-TR") + " ₺/ay";
    return p.toLocaleString("tr-TR") + " ₺";
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    dispatch(toggleFavorite(id));
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        favorites: isFavorite ? arrayRemove(id) : arrayUnion(id),
      });
    } catch {
      // favori güncellenemedi
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header variant="light" />
      <div className={styles.page}>
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
              <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
                <path
                  d="M24 6L4 22H10V42H20V30H28V42H38V22H44L24 6Z"
                  fill="#1A2E5A"
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
          {is_featured && (
            <span className={styles.featuredBadge}>Öne Çıkan</span>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.main}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{title}</h1>
              <span className={styles.price}>{formatPrice(price)}</span>
            </div>

            <p className={styles.location}>
              {neighborhood}, {city_district}
            </p>

            <div className={styles.badges}>
              {rooms && rooms !== "—" && (
                <div className={styles.badge}>
                  <span className={styles.badgeLabel}>Oda</span>
                  <span className={styles.badgeValue}>{rooms}</span>
                </div>
              )}
              <div className={styles.badge}>
                <span className={styles.badgeLabel}>Alan</span>
                <span className={styles.badgeValue}>{area} m²</span>
              </div>
              {floor > 0 && (
                <div className={styles.badge}>
                  <span className={styles.badgeLabel}>Kat</span>
                  <span className={styles.badgeValue}>
                    {floor}/{total_floors}
                  </span>
                </div>
              )}
              {building_age > 0 && (
                <div className={styles.badge}>
                  <span className={styles.badgeLabel}>Bina Yaşı</span>
                  <span className={styles.badgeValue}>{building_age}</span>
                </div>
              )}
            </div>

            {description && (
              <div className={styles.descSection}>
                <h2 className={styles.sectionTitle}>Açıklama</h2>
                <p className={styles.description}>{description}</p>
              </div>
            )}

            <div className={styles.mapSection}>
              <h2 className={styles.sectionTitle}>Konum</h2>
              <div className={styles.mapWrapper}>
                {coords ? (
                  <MapComponent
                    listings={[
                      { ...listing, lat: coords.lat, lng: coords.lng },
                    ]}
                    center={[coords.lat, coords.lng]}
                    zoom={15}
                  />
                ) : (
                  <p className={styles.noCoords}>Konum bilgisi bulunamadı.</p>
                )}
              </div>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.contactCard}>
              <h3 className={styles.contactTitle}>İlan Hakkında Bilgi Alın</h3>
              <p className={styles.contactText}>
                Bu ilan hakkında detaylı bilgi almak için danışmanlarımızla
                iletişime geçebilirsiniz.
              </p>
              <div className={styles.buttonGroup}>
                <a href="tel:+905001234567" className={styles.contactBtn}>
                  Hemen Ara
                </a>
                {isAuthenticated && (
                  <button
                    className={`${styles.favoriteBtn} ${isFavorite ? styles.heartActive : ""}`}
                    onClick={handleFavoriteClick}
                  >
                    <HeartIcon className={styles.heartIcon} />
                    <span>
                      {isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
