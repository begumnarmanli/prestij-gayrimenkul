import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./HomePage.module.css";
import homeBg from "../../assets/images/home-bg.webp";
import homeBgMobile from "../../assets/images/home-bg-mobile.webp";
import { Helmet } from "react-helmet-async";

export default function HomePage() {
  return (
    <div className={styles.pageContainer}>
      <Helmet>
        <title>Prestij Gayrimenkul | Hayalinizdeki Ev</title>
        <meta
          name="description"
          content="Gaziantep'in en prestijli gayrimenkul platformu. Satılık ve kiralık daire, villa, arsa ilanları için Prestij Gayrimenkul."
        />
        {/* RESMİ ÖNDEN YÜKLE (PRELOAD) - Bu hamle LCP süresini çok düşürür */}
        <link
          rel="preload"
          as="image"
          href={homeBg}
          media="(min-width: 769px)"
        />
        <link
          rel="preload"
          as="image"
          href={homeBgMobile}
          media="(max-width: 768px)"
        />
      </Helmet>

      <main className={styles.page}>
        <section className={styles.heroCard}>
          <Header variant="dark" />

          <div className={styles.heroText}>
            <h1 className={styles.title}>MÜKEMMELLİĞE YATIRIM YAPIN</h1>
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
                fetchpriority="high"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
