import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
      <div className={styles.center}>
        <h1>Comparify</h1>
      </div>
      <div className={styles.center}>
        <form>
          <input className={styles.searchBar}/>
          <button className={styles.searchButton}>Search</button>
        </form>
        </div>
      </div>
    </main>
  );
}
