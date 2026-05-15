import { useState, useRef, useEffect } from "react";
import styles from "./CustomSelect.module.css";

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
        onClick={() => setOpen((p) => !p)}
      >
        <span className={styles.triggerText}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`${styles.arrow} ${open ? styles.arrowUp : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {options.map((o) => (
            <button
              type="button"
              key={o.value}
              className={`${styles.option} ${value === o.value ? styles.optionSelected : ""}`}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              <span>{o.label}</span>
              {value === o.value && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7L5.5 10.5L12 3.5"
                    stroke="var(--color-primary)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
