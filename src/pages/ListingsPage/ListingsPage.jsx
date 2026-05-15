import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchListings,
  fetchPropertyTypes,
  fetchDistricts,
} from "../../redux/listings/listingsOperations";
import {
  setPage,
  setFilters,
  resetFilters,
} from "../../redux/listings/listingsSlice";

import Loader from "../../components/Loader/Loader";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ListingsFilters from "../../components/ListingsFilters/ListingsFilters";
import ListingCard from "../../components/ListingCard/ListingCard";
import Pagination from "../../components/Pagination/Pagination";
import CloseIcon from "../../assets/icons/close.svg?react";
import styles from "./ListingsPage.module.css";
import { Helmet } from "react-helmet-async";

export default function ListingsPage() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const {
    items,
    page,
    totalPages,
    filters,
    isLoading,
    propertyTypes,
    districts,
  } = useSelector((state) => state.listings);

  const [modalAttention, setModalAttention] = useState(false);

  useEffect(() => {
    dispatch(fetchPropertyTypes());
    dispatch(fetchDistricts());
  }, [dispatch]);

  const handleCloseModal = () => {
    setModalAttention(false);
    document.body.classList.remove("menu-open");
  };

  const handleAttention = () => {
    setModalAttention(true);
    document.body.classList.add("menu-open");
  };

  useEffect(() => {
    dispatch(fetchListings({ page, limit: 9, ...filters }));
  }, [dispatch, page, filters]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") handleCloseModal();
    };
    if (modalAttention) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [modalAttention]);

  const handleFilterChange = (newFilters) => dispatch(setFilters(newFilters));
  const handleReset = () => dispatch(resetFilters());
  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.pageContainer}>
      <Helmet>
        <title>İlan Bul | Prestij Gayrimenkul</title>
        <meta
          name="description"
          content="Gaziantep'te satılık ve kiralık daire, villa, arsa ilanları. Filtreleyerek aradığınız evi bulun."
        />
      </Helmet>
      <Header variant="light" authenticated={isAuthenticated} />
      <div className={styles.page}>
        <main className={styles.main}>
          <h1 className={styles.title}>Hayalindeki Evi Bul</h1>

          <ListingsFilters
            propertyTypes={propertyTypes}
            districts={districts}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />

          {isLoading && <Loader />}

          {!isLoading && (
            <>
              <div className={styles.list}>
                {items.length > 0 ? (
                  items.map((item) => (
                    <ListingCard
                      key={item.id}
                      item={item}
                      onAttention={handleAttention}
                    />
                  ))
                ) : (
                  <p className={styles.noResults}>
                    Aranan kriterlere uygun ilan bulunamadı.
                  </p>
                )}
              </div>

              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </main>
      </div>

      <Footer />

      {modalAttention && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={handleCloseModal}
              type="button"
            >
              <CloseIcon className={styles.closeIcon} />
            </button>
            <div className={styles.logoWrapper}>
              <div className={styles.logoIcon}>
                <span className={styles.logoLetter}>PG</span>
              </div>
              <div className={styles.logoTextWrapper}>
                <span className={styles.logoMainText}>PRESTİJ</span>
                <span className={styles.logoSubText}>GAYRİMENKUL</span>
              </div>
            </div>
            <h2 className={styles.modalTitle}>Sadece Üyelere Özel</h2>
            <p className={styles.modalText}>
              Bu ilanı favorilerinize eklemek ve size özel avantajlardan
              yararlanmak için giriş yapmanız gerekmektedir. Hemen ücretsiz üye
              olun!
            </p>
            <div className={styles.modalActions}>
              <Link to="/login" className={styles.modalBtnLogin}>
                Giriş Yap
              </Link>
              <Link to="/register" className={styles.modalBtnRegister}>
                Üye Ol
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
