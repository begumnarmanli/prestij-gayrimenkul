import { useState } from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import styles from "./AuthPage.module.css";
import { Helmet } from "react-helmet-async";

function Logo() {
  return (
    <div className={styles.logoBlock}>
      <Helmet>
        <title>Giriş Yap | Prestij Gayrimenkul</title>
        <meta
          name="description"
          content="Prestij Gayrimenkul hesabınıza giriş yapın."
        />
      </Helmet>
      <div className={styles.logoMarkWrap}>
        <div className={styles.logoMark}>
          <span className={styles.logoLetter}>PG</span>
        </div>
        <div className={styles.logoPulse} />
        <div className={styles.logoPulse2} />
      </div>
      <div className={styles.logoText}>
        <span className={styles.logoMain}>PRESTİJ</span>
        <span className={styles.logoSub}>GAYRİMENKUL</span>
      </div>
      <p className={styles.logoTagline}>
        Gaziantep'in en güvenilir
        <br />
        gayrimenkul danışmanlığı
      </p>
      <div className={styles.logoStats}>
        <div className={styles.stat}>
          <span className={styles.statNum}>62+</span>
          <span className={styles.statLabel}>Aktif İlan</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>4</span>
          <span className={styles.statLabel}>Uzman Danışman</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>8</span>
          <span className={styles.statLabel}>Bölge</span>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const location = useLocation();
  const [mode, setMode] = useState(
    location.pathname === "/register" ? "register" : "login",
  );
  const [animating, setAnimating] = useState(false);
  const [flipped, setFlipped] = useState(location.pathname === "/register");

  const switchMode = (newMode) => {
    if (newMode === mode || animating) return;
    setAnimating(true);
    setFlipped(newMode === "register");
    setTimeout(() => {
      setMode(newMode);
      setAnimating(false);
    }, 600);
  };

  const isLogin = mode === "login";

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />
        <div className={styles.bgGrid} />

        {/* SADECE MOBİL LAYOUT */}
        <div className={styles.mobileLayout}>
          <div className={styles.mobileLogoPanel}>
            <Logo />
          </div>

          <div className={styles.mobileFormPanel}>
            <div
              className={`${styles.flipCard} ${flipped ? styles.flipped : ""}`}
            >
              <div className={styles.flipFront}>
                <div className={styles.formHeader}>
                  <h1 className={styles.formTitle}>Hoş Geldiniz</h1>
                  <p className={styles.formSubtitle}>Hesabınıza giriş yapın</p>
                </div>
                <LoginForm />
                <div className={styles.switchText}>
                  Hesabınız yok mu?{" "}
                  <button
                    className={styles.switchBtn}
                    onClick={() => switchMode("register")}
                  >
                    Kayıt Olun
                  </button>
                </div>
              </div>
              <div className={styles.flipBack}>
                <div className={styles.formHeader}>
                  <h1 className={styles.formTitle}>Hesap Oluşturun</h1>
                  <p className={styles.formSubtitle}>Birkaç adımda üye olun</p>
                </div>
                <RegisterForm />
                <div className={styles.switchText}>
                  Zaten üye misiniz?{" "}
                  <button
                    className={styles.switchBtn}
                    onClick={() => switchMode("login")}
                  >
                    Giriş Yapın
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${styles.split} ${isLogin ? styles.splitLogin : styles.splitRegister}`}
        >
          <div className={`${styles.panel} ${styles.panelLeft}`}>
            <div
              className={styles.panelOverlayWhite}
              style={{ opacity: isLogin ? 1 : 0 }}
            />
            <div
              className={styles.panelOverlayDark}
              style={{ opacity: isLogin ? 0 : 1 }}
            />
            <div className={styles.panelInner}>
              {isLogin ? (
                <div
                  className={`${styles.formContainer} ${animating ? styles.fadeOut : styles.fadeIn}`}
                >
                  <div className={styles.formHeader}>
                    <h1 className={styles.formTitle}>Hoş Geldiniz</h1>
                    <p className={styles.formSubtitle}>
                      Hesabınıza giriş yapın
                    </p>
                  </div>
                  <LoginForm />
                  <div className={styles.switchText}>
                    Hesabınız yok mu?{" "}
                    <button
                      className={styles.switchBtn}
                      onClick={() => switchMode("register")}
                    >
                      Kayıt Olun
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`${styles.logoContainer} ${animating ? styles.fadeOut : styles.fadeIn}`}
                >
                  <Logo />
                </div>
              )}
            </div>
          </div>

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <div className={styles.dividerBadge}>
              <span className={styles.dividerText}>veya</span>
            </div>
            <div className={styles.dividerLine} />
          </div>

          <div className={`${styles.panel} ${styles.panelRight}`}>
            <div
              className={styles.panelOverlayWhite}
              style={{ opacity: isLogin ? 0 : 1 }}
            />
            <div
              className={styles.panelOverlayDark}
              style={{ opacity: isLogin ? 1 : 0 }}
            />
            <div className={styles.panelInner}>
              {isLogin ? (
                <div
                  className={`${styles.logoContainer} ${animating ? styles.fadeOut : styles.fadeIn}`}
                >
                  <Logo />
                </div>
              ) : (
                <div
                  className={`${styles.formContainer} ${animating ? styles.fadeOut : styles.fadeIn}`}
                >
                  <div className={styles.formHeader}>
                    <h1 className={styles.formTitle}>Hesap Oluşturun</h1>
                    <p className={styles.formSubtitle}>
                      Birkaç adımda üye olun
                    </p>
                  </div>
                  <RegisterForm />
                  <div className={styles.switchText}>
                    Zaten üye misiniz?{" "}
                    <button
                      className={styles.switchBtn}
                      onClick={() => switchMode("login")}
                    >
                      Giriş Yapın
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
