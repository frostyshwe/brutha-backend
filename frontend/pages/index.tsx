import { useRouter } from "next/router";
import styles from "../styles/home.module.css"; // Importando o CSS

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Painel de Controle</h1>
      
      <div className={styles.grid}>
        <button className={styles.button} onClick={() => router.push("/clientes")}>
          CLIENTES
        </button>
        <button className={styles.button} onClick={() => router.push("/materiais")}>
          MATERIAIS
        </button>
        <button className={styles.button} onClick={() => router.push("/comercial")}>
          COMERCIAL
        </button>
        <button className={styles.button} onClick={() => router.push("/fornecedores")}>
          FORNECEDORES
        </button>
        <button className={styles.button} disabled>VAGO</button>
        <button className={styles.button} disabled>VAGO</button>
      </div>
    </div>
  );
}
