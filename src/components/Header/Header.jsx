import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/auth/authSlice";
import ModalLogout from "../ModalLogout/ModalLogout";
import BurgerIcon from "../../assets/icons/hamburger.svg?react";
import CloseIcon from "../../assets/icons/close.svg?react";
import HeartIcon from "../../assets/icons/heart.svg?react";
import styles from "./Header.module.css";
export default function Header({ variant = "dark" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isAuthenticated: authenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const openMenu = () => {
    setDrawerVisible(true);
    setMenuOpen(true);
  };
  const closeMenu = () => {
    setClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setDrawerVisible(false);
      setClosing(false);
    }, 300);
  };
  const handleLogout = () => {
    setShowLogoutModal(true);
  };
  const confirmLogout = () => {
    dispatch(logout());
    navigate("/");
    setShowLogoutModal(false);
  };
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);
  const isLight = variant === "light";
  return (
    <>
      <header
        className={`${styles.header} ${isLight ? styles.headerLight : ""}`}
      >
        <Link to="/" className={styles.logoLink}>
          <div className={styles.logoIcon}>
            <span className={styles.logoLetter}>PG</span>
            <div className={styles.logoUnderline}></div>
          </div>
          <div className={styles.logoTextWrapper}>
            <span className={styles.logoMainText}>PRESTİJ</span>
            <span className={styles.logoSubText}>GAYRİMENKUL</span>
          </div>
        </Link>
        <nav className={styles.navMobile}>
          {authenticated && (
            <Link to="/profile" className={styles.profileLink}>
              <HeartIcon className={styles.profileIcon} />
            </Link>
          )}
          {!authenticated && (
            <>
              <Link to="/login" className={styles.navMobileLogin}>
                GİRİŞ YAP
              </Link>
              <Link to="/register" className={styles.navMobileRegister}>
                KAYIT OL
              </Link>
            </>
          )}
          <button
            className={`${styles.iconBtn} ${isLight ? styles.iconBtnDark : ""}`}
            onClick={openMenu}
          >
            <BurgerIcon className={styles.burgerIcon} />
          </button>
        </nav>
        <nav className={styles.navDesktop}>
          <ul className={styles.navLinks}>
            <li>
              <Link
                to="/statistics"
                className={`${styles.navLink} ${isLight ? styles.navLinkLight : ""}`}
              >
                PİYASA VERİLERİ
              </Link>
            </li>
            <li>
              <Link
                to="/listings"
                className={`${styles.navLink} ${isLight ? styles.navLinkLight : ""}`}
              >
                İLAN BUL
              </Link>
            </li>
            <li>
              <Link
                to="/agents"
                className={`${styles.navLink} ${isLight ? styles.navLinkLight : ""}`}
              >
                DANIŞMANLARIMIZ
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.navActions}>
          {authenticated ? (
            <>
              <Link to="/profile" className={styles.profileLinkDesktop}>
                <HeartIcon className={styles.profileIconDesktop} />
                Favorilerim
              </Link>
              <button className={styles.btnLogout} onClick={handleLogout}>
                ÇIKIŞ YAP
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${styles.btnLogin} ${isLight ? styles.btnLoginLight : ""}`}
              >
                GİRİŞ YAP
              </Link>
              <Link
                to="/register"
                className={`${styles.btnRegister} ${isLight ? styles.btnRegisterLight : ""}`}
              >
                KAYIT OL
              </Link>
            </>
          )}
        </div>
      </header>
      {drawerVisible && <div className={styles.overlay} onClick={closeMenu} />}
      {drawerVisible && (
        <div
          className={`${styles.drawer} ${isLight ? styles.drawerLight : ""} ${closing ? styles.drawerClosing : ""}`}
        >
          <button
            className={styles.closeBtn}
            onClick={closeMenu}
            aria-label="Kapat"
          >
            <CloseIcon className={styles.closeIcon} />
          </button>
          <ul className={styles.drawerLinks}>
            <li>
              <Link
                to="/statistics"
                className={`${styles.drawerLink} ${isLight ? styles.drawerLinkDark : ""}`}
                onClick={closeMenu}
              >
                Piyasa Verileri
              </Link>
            </li>
            <li>
              <Link
                to="/listings"
                className={`${styles.drawerLink} ${isLight ? styles.drawerLinkDark : ""}`}
                onClick={closeMenu}
              >
                İlan Bul
              </Link>
            </li>
            <li>
              <Link
                to="/agents"
                className={`${styles.drawerLink} ${isLight ? styles.drawerLinkDark : ""}`}
                onClick={closeMenu}
              >
                Danışmanlarımız
              </Link>
            </li>
          </ul>
          <div className={styles.drawerActions}>
            {authenticated ? (
              <button
                className={styles.drawerBtnLogout}
                onClick={() => {
                  setShowLogoutModal(true);
                  closeMenu();
                }}
              >
                ÇIKIŞ YAP
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${styles.drawerBtnLogin} ${isLight ? styles.drawerBtnLoginDark : ""}`}
                  onClick={closeMenu}
                >
                  GİRİŞ YAP
                </Link>
                <Link
                  to="/register"
                  className={`${styles.drawerBtnRegister} ${isLight ? styles.drawerBtnRegisterDark : ""}`}
                  onClick={closeMenu}
                >
                  KAYIT OL
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      {showLogoutModal && (
        <ModalLogout
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}
