import SliderOne from "../../assets/icons/slider-1.svg?react";
import SliderTwo from "../../assets/icons/slider-2.svg?react";
import styles from "./Pagination.module.css";

export default function Pagination({ page, totalPages, onPageChange }) {
  const getPages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <div className={styles.pagination}>
      <button
        className={styles.btn}
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        aria-label="First page"
      >
        <SliderTwo className={styles.iconFlip} width="16" height="16" />
      </button>

      <button
        className={styles.btn}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <SliderOne className={styles.iconFlip} width="16" height="16" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className={styles.dots}>
            ...
          </span>
        ) : (
          <button
            key={p}
            className={`${styles.btn} ${p === page ? styles.active : ""}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ),
      )}

      <button
        className={`${styles.btn} ${styles.btnFlip}`}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <SliderOne width="16" height="16" />
      </button>

      <button
        className={`${styles.btn} ${styles.btnFlip}`}
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
        aria-label="Last page"
      >
        <SliderTwo width="16" height="16" />
      </button>
    </div>
  );
}
