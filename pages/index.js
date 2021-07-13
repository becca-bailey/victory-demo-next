import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <ul>
        <li>
          <Link href="/population">Population</Link>
        </li>
        <li>
          <Link href="/scatter">Scatter</Link>
        </li>
      </ul>
    </div>
  );
}
