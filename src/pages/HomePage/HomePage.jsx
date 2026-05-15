import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./HomePage.module.css";
import homeBg from "../../assets/images/home-bg.webp";
import homeBgMobile from "../../assets/images/home-bg-mobile.webp";

export default function HomePage() {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.page}>
        <section className={styles.heroCard}>
          <Header variant="dark" />

          <div className={styles.heroText}>
            <h1 className={styles.title}>MÜKEMMELL&#304;ĞE YATIRIM YAPIN</h1>
          </div>
        </section>

        <div className={styles.imageWrap}>
          <div className={styles.heroIllustration}>
            <picture>
              <source media="(max-width: 768px)" srcSet={homeBgMobile} />
              <img
                src={homeBg}
                alt="Prestij Gayrimenkul Lüks Konut"
                className={styles.houseSvg}
              />
            </picture>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
