import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore/lite";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import styles from "./Statistics.module.css";

// YENİ: Ağır bileşeni tembel yüklüyoruz
const ChartEngine = lazy(() => import("./ChartEngine"));

const DISTRICT_OPTIONS = [
  { value: "", label: "Tüm İlçeler" },
  { value: "Şahinbey", label: "Şahinbey" },
  { value: "Şehitkamil", label: "Şehitkamil" },
];

const TYPE_OPTIONS = [
  { value: "", label: "Tüm Tipler" },
  { value: "Daire", label: "Daire" },
  { value: "Villa", label: "Villa" },
  { value: "Arsa", label: "Arsa" },
  { value: "Ofis", label: "Ofis" },
];

export default function Statistics() {
  const [allListings, setAllListings] = useState([]);
  const [district, setDistrict] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "listings"));
        const data = [];
        snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
        setAllListings(data);
      } catch {
        // hata yönetimi
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filtreleme ve veri hazırlama (useMemo kısımları)
  const filtered = useMemo(() => allListings.filter((l) => {
    if (district && l.city_district !== district) return false;
    if (propertyType && l.type !== propertyType) return false;
    return true;
  }), [allListings, district, propertyType]);

  const metrics = useMemo(() => {
    const valid = filtered.filter((l) => l.price > 0 && l.area > 0);
    return {
      count: filtered.length,
      avgM2: valid.length > 0 ? valid.reduce((s, l) => s + l.price / l.area, 0) / valid.length : 0,
      avgPrice: valid.length > 0 ? valid.reduce((s, l) => s + l.price, 0) / valid.length : 0,
      avgArea: valid.length > 0 ? valid.reduce((s, l) => s + l.area, 0) / valid.length : 0
    };
  }, [filtered]);

  const neighborhoodStats = useMemo(() => {
    const map = {};
    filtered.forEach((l) => {
      if (!l.neighborhood || !l.price || !l.area) return;
      if (!map[l.neighborhood]) map[l.neighborhood] = { total: 0, count: 0 };
      map[l.neighborhood].total += l.price / l.area;
      map[l.neighborhood].count += 1;
    });
    return Object.entries(map).map(([name, v]) => ({ name, avg: Math.round(v.total / v.count) })).sort((a, b) => b.avg - a.avg).slice(0, 8);
  }, [filtered]);

  const typeStats = useMemo(() => {
    const map = {};
    filtered.forEach((l) => { const t = l.type || "Diğer"; map[t] = (map[t] || 0) + 1; });
    return map;
  }, [filtered]);

  const scatterData = useMemo(() => filtered.filter((l) => l.price && l.area).map((l) => ({ x: l.area, y: l.price })), [filtered]);

  return (
    <div className={styles.pageWrapper}>
      <Header variant="light" />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h2 className={styles.title}>Emlak Analiz Paneli</h2>
            <p className={styles.subtitle}>Gaziantep bölgesi piyasa verileri</p>
          </div>

          <div className={styles.filters}>
            <CustomSelect value={district} onChange={setDistrict} options={DISTRICT_OPTIONS} placeholder="Tüm İlçeler" />
            <CustomSelect value={propertyType} onChange={setPropertyType} options={TYPE_OPTIONS} placeholder="Tüm Tipler" />
          </div>

          {loading ? (
            <div className={styles.loadingState}><div className={styles.spinner} /></div>
          ) : (
            <>
              {/* Metric Kartları aynı kalıyor... */}
              <div className={styles.metrics}>
                <div className={styles.metricCard}><span className={styles.metricLabel}>Toplam İlan</span><span className={styles.metricValue}>{metrics.count}</span></div>
                <div className={styles.metricCard}><span className={styles.metricLabel}>Ort. m² Fiyatı</span><span className={styles.metricValue}>{Math.round(metrics.avgM2).toLocaleString("tr-TR")} ₺</span></div>
              </div>

              {/* YENİ: Grafik motorunu Suspense ile çağırıyoruz */}
              <Suspense fallback={<div className={styles.loadingState}>Grafikler yükleniyor...</div>}>
                <ChartEngine 
                   neighborhoodStats={neighborhoodStats} 
                   typeStats={typeStats} 
                   scatterData={scatterData} 
                />
              </Suspense>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}