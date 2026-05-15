import { useState, useEffect, useRef, useMemo } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Chart,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  ArcElement,
  DoughnutController,
  ScatterController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import styles from "./Statistics.module.css";

Chart.register(
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  ArcElement,
  DoughnutController,
  ScatterController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
);

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

const GRID = "rgba(26,46,90,0.06)";
const TICK = "rgba(26,46,90,0.4)";

const TOOLTIP_OPTS = {
  backgroundColor: "#1A2E5A",
  titleColor: "#b2d0f0",
  bodyColor: "#b2d0f0",
  borderColor: "rgba(59,141,221,0.3)",
  borderWidth: 1,
  cornerRadius: 10,
  padding: 10,
};

const BAR_COLORS = [
  "#3B8DDD",
  "#2E7BC4",
  "#4A9FE8",
  "#1E6BB0",
  "#5AAEEE",
  "#2680CC",
  "#3D94E0",
  "#1A5A99",
];

const DONUT_COLORS = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A855F7", "#FF9F43"];
const DONUT_HOVER = ["#FF4757", "#26D0CE", "#FDD835", "#9333EA", "#FF7F00"];

const destroyChart = (ref) => {
  if (ref.current) {
    ref.current.destroy();
    ref.current = null;
  }
};

const createBarGradient = (ctx, chartArea, color) => {
  const g = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  g.addColorStop(0, color + "99");
  g.addColorStop(1, color + "ff");
  return g;
};

export default function Statistics() {
  const [allListings, setAllListings] = useState([]);
  const [district, setDistrict] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [loading, setLoading] = useState(true);

  const barRef = useRef(null);
  const pieRef = useRef(null);
  const scatterRef = useRef(null);
  const lineRef = useRef(null);

  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const scatterChartRef = useRef(null);
  const lineChartRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "listings"));
        const data = [];
        snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
        setAllListings(data);
      } catch {
        // veri çekme başarısız
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = useMemo(
    () =>
      allListings.filter((l) => {
        if (district && l.city_district !== district) return false;
        if (propertyType && l.type !== propertyType) return false;
        return true;
      }),
    [allListings, district, propertyType],
  );

  const metrics = useMemo(() => {
    const valid = filtered.filter((l) => l.price > 0 && l.area > 0);
    const count = filtered.length;
    const avgM2 =
      valid.length > 0
        ? valid.reduce((s, l) => s + l.price / l.area, 0) / valid.length
        : 0;
    const avgPrice =
      valid.length > 0
        ? valid.reduce((s, l) => s + l.price, 0) / valid.length
        : 0;
    const avgArea =
      valid.length > 0
        ? valid.reduce((s, l) => s + l.area, 0) / valid.length
        : 0;
    return { count, avgM2, avgPrice, avgArea };
  }, [filtered]);

  const neighborhoodStats = useMemo(() => {
    const map = {};
    filtered.forEach((l) => {
      if (!l.neighborhood || !l.price || !l.area) return;
      if (!map[l.neighborhood]) map[l.neighborhood] = { total: 0, count: 0 };
      map[l.neighborhood].total += l.price / l.area;
      map[l.neighborhood].count += 1;
    });
    return Object.entries(map)
      .map(([name, v]) => ({ name, avg: Math.round(v.total / v.count) }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 8);
  }, [filtered]);

  const typeStats = useMemo(() => {
    const map = {};
    filtered.forEach((l) => {
      const t = l.type || "Diğer";
      map[t] = (map[t] || 0) + 1;
    });
    return map;
  }, [filtered]);

  const scatterData = useMemo(
    () =>
      filtered
        .filter((l) => l.price && l.area)
        .map((l) => ({ x: l.area, y: l.price })),
    [filtered],
  );

  useEffect(() => {
    if (loading || !barRef.current) return;
    destroyChart(barChartRef);
    if (neighborhoodStats.length === 0) return;
    barChartRef.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: neighborhoodStats.map((n) => n.name),
        datasets: [
          {
            label: "Ort. m² Fiyatı (₺)",
            data: neighborhoodStats.map((n) => n.avg),
            backgroundColor(ctx) {
              const { ctx: c, chartArea } = ctx.chart;
              if (!chartArea)
                return BAR_COLORS[ctx.dataIndex % BAR_COLORS.length];
              return createBarGradient(
                c,
                chartArea,
                BAR_COLORS[ctx.dataIndex % BAR_COLORS.length],
              );
            },
            hoverBackgroundColor: BAR_COLORS.map((c) => c + "dd"),
            borderRadius: 8,
            borderSkipped: false,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TOOLTIP_OPTS,
            callbacks: {
              label: (ctx) =>
                " " +
                Math.round(ctx.parsed.y).toLocaleString("tr-TR") +
                " ₺/m²",
            },
          },
        },
        scales: {
          x: {
            grid: { color: GRID },
            ticks: { color: TICK, maxRotation: 35, font: { size: 11 } },
          },
          y: {
            grid: { color: GRID },
            ticks: {
              color: TICK,
              font: { size: 11 },
              callback: (v) => v.toLocaleString("tr-TR") + " ₺",
            },
          },
        },
      },
    });
  }, [loading, neighborhoodStats]);

  useEffect(() => {
    if (loading || !pieRef.current) return;
    destroyChart(pieChartRef);
    const labels = Object.keys(typeStats);
    if (labels.length === 0) return;
    pieChartRef.current = new Chart(pieRef.current, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: labels.map((k) => typeStats[k]),
            backgroundColor: labels.map(
              (_, i) => DONUT_COLORS[i % DONUT_COLORS.length],
            ),
            hoverBackgroundColor: labels.map(
              (_, i) => DONUT_HOVER[i % DONUT_HOVER.length],
            ),
            borderWidth: 3,
            borderColor: "#ffffff",
            hoverOffset: 12,
            offset: labels.map((_, i) => (i === 0 ? 8 : 0)),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "58%",
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              color: TICK,
              boxWidth: 12,
              boxHeight: 12,
              padding: 14,
              font: { size: 12 },
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            ...TOOLTIP_OPTS,
            callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed} ilan` },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 800,
          easing: "easeInOutQuart",
        },
      },
    });
  }, [loading, typeStats]);

  useEffect(() => {
    if (loading || !scatterRef.current) return;
    destroyChart(scatterChartRef);
    if (scatterData.length === 0) return;
    scatterChartRef.current = new Chart(scatterRef.current, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "İlanlar",
            data: scatterData,
            backgroundColor: scatterData.map((_, i) => {
              const t = i / Math.max(scatterData.length - 1, 1);
              return `rgba(${Math.round(59 + t * 196)},${Math.round(141 - t * 34)},${Math.round(221 - t * 161)},0.75)`;
            }),
            pointRadius: 7,
            pointHoverRadius: 10,
            borderWidth: 1.5,
            borderColor: scatterData.map((_, i) => {
              const t = i / Math.max(scatterData.length - 1, 1);
              return `rgba(${Math.round(59 + t * 196)},${Math.round(141 - t * 34)},${Math.round(221 - t * 161)},1)`;
            }),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TOOLTIP_OPTS,
            callbacks: {
              label: (ctx) =>
                ` ${ctx.parsed.x} m² — ${Math.round(ctx.parsed.y).toLocaleString("tr-TR")} ₺`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: GRID },
            ticks: {
              color: TICK,
              font: { size: 11 },
              callback: (v) => v + " m²",
            },
            title: {
              display: true,
              text: "Alan (m²)",
              color: TICK,
              font: { size: 11 },
            },
          },
          y: {
            grid: { color: GRID },
            ticks: {
              color: TICK,
              font: { size: 11 },
              callback: (v) =>
                v >= 1_000_000
                  ? (v / 1_000_000).toFixed(1) + "M ₺"
                  : (v / 1000).toFixed(0) + "K ₺",
            },
          },
        },
      },
    });
  }, [loading, scatterData]);

  useEffect(() => {
    if (loading || !lineRef.current) return;

    destroyChart(lineChartRef);

    const timer = setTimeout(() => {
      if (!lineRef.current) return;
      lineChartRef.current = new Chart(lineRef.current, {
        type: "line",
        data: {
          labels: ["Kasım", "Aralık", "Ocak", "Şubat", "Mart", "Nisan"],
          datasets: [
            {
              label: "Ort. m² Fiyatı",
              data: [19200, 20100, 21500, 22800, 23900, 24800],
              borderColor: "#3B8DDD",
              borderWidth: 2.5,
              backgroundColor(ctx) {
                const { ctx: c, chartArea } = ctx.chart;
                if (!chartArea) return "rgba(59,141,221,0.1)";
                const g = c.createLinearGradient(
                  0,
                  chartArea.top,
                  0,
                  chartArea.bottom,
                );
                g.addColorStop(0, "rgba(59,141,221,0.35)");
                g.addColorStop(1, "rgba(59,141,221,0.01)");
                return g;
              },
              fill: true,
              tension: 0.45,
              pointBackgroundColor: "#ffffff",
              pointBorderColor: "#3B8DDD",
              pointBorderWidth: 2.5,
              pointRadius: 5,
              pointHoverRadius: 8,
              pointHoverBackgroundColor: "#3B8DDD",
              pointHoverBorderColor: "#ffffff",
              pointHoverBorderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              ...TOOLTIP_OPTS,
              callbacks: {
                label: (ctx) =>
                  " " +
                  Math.round(ctx.parsed.y).toLocaleString("tr-TR") +
                  " ₺/m²",
              },
            },
          },
          scales: {
            x: {
              grid: { color: GRID },
              ticks: { color: TICK, font: { size: 11 } },
            },
            y: {
              grid: { color: GRID },
              ticks: {
                color: TICK,
                font: { size: 11 },
                callback: (v) => v.toLocaleString("tr-TR") + " ₺",
              },
            },
          },
          animation: { duration: 800, easing: "easeInOutQuart" },
        },
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <div className={styles.pageWrapper}>
      <Header variant="light" />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h2 className={styles.title}>Emlak Analiz Paneli</h2>
            <p className={styles.subtitle}>Gaziantep bölgesi piyasa verileri</p>
            <span className={styles.disclaimer}>
              * Bu sayfadaki veriler simülasyon amaçlıdır, gerçeği yansıtmaz.
            </span>
          </div>

          <div className={styles.filters}>
            <CustomSelect
              value={district}
              onChange={setDistrict}
              options={DISTRICT_OPTIONS}
              placeholder="Tüm İlçeler"
            />
            <CustomSelect
              value={propertyType}
              onChange={setPropertyType}
              options={TYPE_OPTIONS}
              placeholder="Tüm Tipler"
            />
          </div>

          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Veriler yükleniyor...</p>
            </div>
          ) : (
            <>
              <div className={styles.metrics}>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Toplam İlan</span>
                  <span className={styles.metricValue}>{metrics.count}</span>
                  <span className={styles.metricUnit}>Aktif ilan</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Ort. m² Fiyatı</span>
                  <span className={styles.metricValue}>
                    {metrics.avgM2 > 0
                      ? Math.round(metrics.avgM2).toLocaleString("tr-TR")
                      : "—"}
                  </span>
                  <span className={styles.metricUnit}>₺ / m²</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Ort. Fiyat</span>
                  <span className={styles.metricValue}>
                    {metrics.avgPrice > 0
                      ? (metrics.avgPrice / 1_000_000).toFixed(1) + "M"
                      : "—"}
                  </span>
                  <span className={styles.metricUnit}>TL</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Ort. Alan</span>
                  <span className={styles.metricValue}>
                    {metrics.avgArea > 0 ? Math.round(metrics.avgArea) : "—"}
                  </span>
                  <span className={styles.metricUnit}>m²</span>
                </div>
              </div>

              <div className={styles.chartCardFull}>
                <h3 className={styles.chartTitle}>
                  Mahallelere göre ort. m² fiyatı
                </h3>
                <div className={styles.chartWrapBar}>
                  {neighborhoodStats.length > 0 ? (
                    <canvas
                      ref={barRef}
                      role="img"
                      aria-label="Mahallelere göre m² fiyatı"
                    />
                  ) : (
                    <div className={styles.emptyState}>Veri bulunamadı</div>
                  )}
                </div>
              </div>

              <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                  <h3 className={styles.chartTitle}>İlan tipi dağılımı</h3>
                  <div className={styles.chartWrapPie}>
                    {Object.keys(typeStats).length > 0 ? (
                      <canvas
                        ref={pieRef}
                        role="img"
                        aria-label="İlan tipi dağılımı"
                      />
                    ) : (
                      <div className={styles.emptyState}>Veri bulunamadı</div>
                    )}
                  </div>
                </div>
                <div className={styles.chartCard}>
                  <h3 className={styles.chartTitle}>Fiyat — Alan ilişkisi</h3>
                  <div className={styles.chartWrapScatter}>
                    {scatterData.length > 0 ? (
                      <canvas
                        ref={scatterRef}
                        role="img"
                        aria-label="Fiyat-alan scatter"
                      />
                    ) : (
                      <div className={styles.emptyState}>Veri bulunamadı</div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.chartCardFull}>
                <h3 className={styles.chartTitle}>
                  Son 6 ayda ort. m² fiyat trendi
                </h3>
                <div className={styles.chartWrapLine}>
                  <canvas ref={lineRef} role="img" aria-label="Fiyat trendi" />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
