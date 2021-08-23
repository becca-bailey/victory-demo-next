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
          <Link href="/scatter?count=1000">Scatter</Link>
        </li>
        <li>
          <Link href="/scatter-duplicate?count=1000">Scatter Duplicate</Link>
        </li>
        <li>
          <Link href="/line?count=100&groups=100">Line</Link>
        </li>
        <li>
          <Link href="/bar?count=100&groups=10">Bar</Link>
        </li>
      </ul>
    </div>
  );
}
