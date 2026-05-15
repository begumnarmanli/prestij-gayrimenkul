import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { logout } from "../../redux/auth/authSlice";
import Header from "../../components/Header/Header";
import ModalLogout from "../../components/ModalLogout/ModalLogout";
import EditUserModal from "../../components/EditUserModal/EditUserModal";
import ListingCard from "../../components/ListingCard/ListingCard";
import ChevronDownIcon from "../../assets/icons/chevron-down.svg?react";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const confirmLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  useEffect(() => {
    const fetchFavorites = async () => {
      const favorites = user?.favorites;
      if (!favorites || favorites.length === 0) {
        setFavoriteListings([]);
        return;
      }
      try {
        setIsLoading(true);
        const chunks = [];
        for (let i = 0; i < favorites.length; i += 30) {
          chunks.push(favorites.slice(i, i + 30));
        }
        const results = [];
        for (const chunk of chunks) {
          const q = query(
            collection(db, "listings"),
            where("__name__", "in", chunk),
          );
          const snap = await getDocs(q);
          snap.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
        }
        setFavoriteListings(results);
      } catch {
        // favoriler çekilemedi
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, [user?.favorites]);

  return (
    <div className={styles.pageContainer}>
      <Header variant="light" />

      <div className={styles.page}>
        <main className={styles.main}>
          <aside className={styles.sidebar}>
            <button
              className={styles.mobileToggle}
              onClick={() => setShowDetails((prev) => !prev)}
            >
              <span>Bilgilerimi Gör</span>
              <ChevronDownIcon
                className={`${styles.chevron} ${showDetails ? styles.chevronOpen : ""}`}
              />
            </button>

            <div
              className={`${styles.accordion} ${showDetails ? styles.accordionOpen : ""}`}
            >
              <div className={styles.initialsRow}>
                <div className={styles.initialsCircle}>{initials}</div>
                <div>
                  <div className={styles.userName}>{user?.name || "—"}</div>
                  <div className={styles.userEmail}>{user?.email || "—"}</div>
                </div>
              </div>
              <div className={styles.divider} />
              <div className={styles.fields}>
                <div className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>Ad Soyad</span>
                  <div className={styles.fieldValue}>{user?.name || "—"}</div>
                </div>
                <div className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>E-posta</span>
                  <div className={styles.fieldValue}>{user?.email || "—"}</div>
                </div>
                <div className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>Telefon</span>
                  <div
                    className={`${styles.fieldValue} ${!user?.phone ? styles.fieldEmpty : ""}`}
                  >
                    {user?.phone || "Eklenmedi"}
                  </div>
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.btnEdit}
                  onClick={() => setShowEditModal(true)}
                >
                  Bilgileri Düzenle
                </button>
                <button
                  className={styles.btnLogout}
                  onClick={() => setShowLogoutModal(true)}
                >
                  Çıkış Yap
                </button>
              </div>
            </div>

            <div className={styles.desktopOnly}>
              <div className={styles.initialsRow}>
                <div className={styles.initialsCircle}>{initials}</div>
                <div>
                  <div className={styles.userName}>{user?.name || "—"}</div>
                  <div className={styles.userEmail}>{user?.email || "—"}</div>
                </div>
              </div>
              <div className={styles.divider} />
              <div className={styles.fields}>
                <div className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>Ad Soyad</span>
                  <div className={styles.fieldValue}>{user?.name || "—"}</div>
                </div>
                <div className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>E-posta</span>
                  <div className={styles.fieldValue}>{user?.email || "—"}</div>
                </div>
                <div className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>Telefon</span>
                  <div
                    className={`${styles.fieldValue} ${!user?.phone ? styles.fieldEmpty : ""}`}
                  >
                    {user?.phone || "Eklenmedi"}
                  </div>
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.btnEdit}
                  onClick={() => setShowEditModal(true)}
                >
                  Bilgileri Düzenle
                </button>
                <button
                  className={styles.btnLogout}
                  onClick={() => setShowLogoutModal(true)}
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </aside>

          <section className={styles.content}>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>Favori İlanlarım</h2>
              <span className={styles.contentCount}>
                {favoriteListings.length} ilan
              </span>
            </div>

            {isLoading ? (
              <div className={styles.loadingState}>
                <p className={styles.emptyText}>Yükleniyor...</p>
              </div>
            ) : favoriteListings.length > 0 ? (
              <ul className={styles.favoriteGrid}>
                {favoriteListings.map((item) => (
                  <ListingCard
                    key={item.id}
                    item={item}
                    onAttention={() => {}}
                  />
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <h3 className={styles.emptyTitle}>Henüz favori yok</h3>
                <p className={styles.emptyText}>
                  Beğendiğiniz ilanları favorilerinize ekleyerek buradan kolayca
                  ulaşabilirsiniz.
                </p>
                <Link to="/listings" className={styles.emptyCta}>
                  İlanlara Göz At
                </Link>
              </div>
            )}
          </section>
        </main>
      </div>

      {showEditModal && (
        <EditUserModal onClose={() => setShowEditModal(false)} />
      )}
      {showLogoutModal && (
        <ModalLogout
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  );
}
