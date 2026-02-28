import { useState, useEffect } from "react";
import type { ProductLaunch } from "@/data/launches";
import dynamic from "next/dynamic";
// Timeline component uses recharts through ProductTimeline; load it client-side only
const Timeline = dynamic(() => import("@/components/Timeline"), { ssr: false });
const AddProductForm = dynamic(
  () => import("@/components/AddProductForm"),
  { ssr: false }
);
import RegionSelector from "@/components/RegionSelector";
import styles from "@/styles/index.module.css";

const REGIONS: Array<"US" | "EU" | "CN" | "JP"> = ["US", "EU", "CN", "JP"];

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<"US" | "EU" | "CN" | "JP">("US");
  const [launches, setLaunches] = useState<ProductLaunch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchLaunches(selectedRegion);
  }, [selectedRegion]);

  const fetchLaunches = async (region: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/launches?region=${region}`);
      if (!response.ok) {
        throw new Error("Failed to fetch launches");
      }
      const data = await response.json();
      setLaunches(data.launches);
    } catch (err) {
      setError("Error loading launches. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (product: ProductLaunch) => {
    try {
      const response = await fetch("/api/launches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      // Refresh launches for current region
      await fetchLaunches(selectedRegion);
      setShowAddForm(false);
      alert("Product added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding product. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>Product Launch Tracker</h1>
            <p>Track product launches across regions over time</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className={styles.addButton}
          >
            + Add Product
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <RegionSelector
          regions={REGIONS}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        {loading && <p className={styles.loading}>Loading launches...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && (
          <Timeline launches={launches} region={selectedRegion} />
        )}
      </main>

      {showAddForm && (
        <div className={styles.modalOverlay} onClick={() => setShowAddForm(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <AddProductForm
              onClose={() => setShowAddForm(false)}
              onSubmit={handleAddProduct}
            />
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <p>&copy; 2024 Launch Tracker Tool. All rights reserved.</p>
      </footer>
    </div>
  );
}
