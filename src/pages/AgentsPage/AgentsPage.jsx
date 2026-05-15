import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Loader from "../../components/Loader/Loader";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import AgentItem from "../../components/AgentItem/AgentItem";
import styles from "./AgentsPage.module.css";
import ahmetImg from "../../assets/images/ahmet.webp";
import elifImg from "../../assets/images/elif.webp";
import canerImg from "../../assets/images/caner.webp";
import selinImg from "../../assets/images/selin.webp";

const agentImages = {
  "ahmet.webp": ahmetImg,
  "elif.webp": elifImg,
  "caner.webp": canerImg,
  "selin.webp": selinImg,
};

export default function AgentsPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    const fetchAgents = async () => {
      try {
        const snap = await getDocs(collection(db, "agents"));
        const data = snap.docs.map((doc) => {
          const agentData = doc.data();
          return {
            id: doc.id,
            ...agentData,
            image: agentImages[agentData.image] || agentData.image,
          };
        });
        setItems(data);
      } catch {
        // hata sessizce geçildi
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.page}>
        <Header variant="light" authenticated={isAuthenticated} />

        <main className={styles.main}>
          <section className={styles.heroSection}>
            <h1 className={styles.title}>Bölge Uzmanlarımız</h1>
            <p className={styles.subtitle}>
              Gaziantep'in emlak piyasasına yön veren profesyonel danışman
              kadromuzla tanışın.
            </p>
          </section>

          {isLoading && <Loader />}

          {!isLoading && (
            <div className={styles.listWrapper}>
              <ul className={styles.list}>
                {items.map((item, index) => (
                  <AgentItem key={item.id} item={item} index={index} />
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
