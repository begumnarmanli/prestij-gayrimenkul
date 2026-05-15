import { useEffect, useRef } from "react";
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

export default function ChartEngine({
  neighborhoodStats,
  typeStats,
  scatterData,
}) {
  const barRef = useRef(null);
  const pieRef = useRef(null);
  const scatterRef = useRef(null);
  const lineRef = useRef(null);

  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const scatterChartRef = useRef(null);
  const lineChartRef = useRef(null);

  useEffect(() => {
    if (!barRef.current) return;
    destroyChart(barChartRef);
    barChartRef.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: neighborhoodStats.map((n) => n.name),
        datasets: [
          {
            label: "Ort. m² Fiyatı (₺)",
            data: neighborhoodStats.map((n) => n.avg),
            backgroundColor: BAR_COLORS,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: TOOLTIP_OPTS },
      },
    });
  }, [neighborhoodStats]);

  useEffect(() => {
    if (!pieRef.current) return;
    destroyChart(pieChartRef);
    const labels = Object.keys(typeStats);
    pieChartRef.current = new Chart(pieRef.current, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: labels.map((k) => typeStats[k]),
            backgroundColor: DONUT_COLORS,
            hoverBackgroundColor: DONUT_HOVER,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "58%",
        plugins: { legend: { position: "bottom" } },
      },
    });
  }, [typeStats]);

  useEffect(() => {
    if (!scatterRef.current) return;
    destroyChart(scatterChartRef);
    scatterChartRef.current = new Chart(scatterRef.current, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "İlanlar",
            data: scatterData,
            backgroundColor: "rgba(59, 141, 221, 0.75)",
            pointRadius: 7,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }, [scatterData]);

  useEffect(() => {
    if (!lineRef.current) return;
    destroyChart(lineChartRef);
    lineChartRef.current = new Chart(lineRef.current, {
      type: "line",
      data: {
        labels: ["Kasım", "Aralık", "Ocak", "Şubat", "Mart", "Nisan"],
        datasets: [
          {
            label: "Trend",
            data: [19200, 20100, 21500, 22800, 23900, 24800],
            borderColor: "#3B8DDD",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }, []);

  return (
    <>
      <div className={styles.chartCardFull}>
        <h3 className={styles.chartTitle}>Mahallelere göre ort. m² fiyatı</h3>
        <div className={styles.chartWrapBar}>
          <canvas ref={barRef} />
        </div>
      </div>
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>İlan tipi dağılımı</h3>
          <div className={styles.chartWrapPie}>
            <canvas ref={pieRef} />
          </div>
        </div>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Fiyat — Alan ilişkisi</h3>
          <div className={styles.chartWrapScatter}>
            <canvas ref={scatterRef} />
          </div>
        </div>
      </div>
      <div className={styles.chartCardFull}>
        <h3 className={styles.chartTitle}>Son 6 ayda ort. m² fiyat trendi</h3>
        <div className={styles.chartWrapLine}>
          <canvas ref={lineRef} />
        </div>
      </div>
    </>
  );
}
