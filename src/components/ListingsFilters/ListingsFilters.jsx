import CustomSelect from "../CustomSelect/CustomSelect";
import CloseIcon from "../../assets/icons/close.svg?react";
import styles from "./ListingsFilters.module.css";

const LISTING_TYPE_OPTIONS = [
  { value: "", label: "Tümü" },
  { value: "satilik", label: "Satılık" },
  { value: "kiralik", label: "Kiralık" },
];

export default function ListingsFilters({
  propertyTypes,
  districts,
  filters,
  onFilterChange,
  onReset,
}) {
  const typeOptions = [
    { value: "", label: "Tümü" },
    ...propertyTypes.map((t) => ({ value: t, label: t })),
  ];

  const districtOptions = [
    { value: "", label: "Tümü" },
    ...districts.map((d) => ({ value: d, label: d })),
  ];

  const hasActiveFilter =
    filters.type || filters.city_district || filters.listing_type;

  return (
    <div className={styles.filters}>
      <div className={styles.inputsGrid}>
        <CustomSelect
          value={filters.listing_type}
          onChange={(val) => onFilterChange({ listing_type: val })}
          options={LISTING_TYPE_OPTIONS}
          placeholder="Satılık / Kiralık"
        />

        <CustomSelect
          value={filters.type}
          onChange={(val) => onFilterChange({ type: val })}
          options={typeOptions}
          placeholder="Emlak Tipi"
        />

        <CustomSelect
          value={filters.city_district}
          onChange={(val) => onFilterChange({ city_district: val })}
          options={districtOptions}
          placeholder="İlçe"
        />

        {hasActiveFilter && (
          <button className={styles.resetBtn} onClick={onReset} type="button">
            <CloseIcon className={styles.resetIcon} />
            Filtreleri Temizle
          </button>
        )}
      </div>
    </div>
  );
}
