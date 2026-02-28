import { useMemo, useState } from "react";
import type { ProductLaunch } from "@/data/launches";
import styles from "@/styles/Timeline.module.css";
import Modal from "./Modal";
import dynamic from "next/dynamic";
// product timeline uses recharts which is browser-only, disable SSR
const ProductTimeline = dynamic(() => import("./ProductTimeline"), {
  ssr: false,
});

interface TimelineProps {
  launches: ProductLaunch[];
  region: string;
}

interface TimelineGroupedByYear {
  [year: number]: ProductLaunch[];
}

export default function Timeline({ launches, region }: TimelineProps) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const groupedByYear = useMemo(() => {
    const grouped: Record<string, ProductLaunch[]> = {};
    launches.forEach((launch) => {
      const yearKey = launch.year >= 2030 ? "2030+" : String(launch.year);
      if (!grouped[yearKey]) {
        grouped[yearKey] = [];
      }
      grouped[yearKey].push(launch);
    });
    return grouped;
  }, [launches]);

  const sortedYears = useMemo(() => {
    const keys = Object.keys(groupedByYear);
    // separate special 2030+ bucket
    const normal = keys.filter((k) => k !== "2030+").map((k) => Number(k)).sort((a, b) => a - b);
    if (keys.includes("2030+")) {
      normal.push(2030); // placeholder for label
    }
    return normal;
  }, [groupedByYear]);

  // Get all launches for the selected product across all regions
  const selectedProductLaunches = useMemo(() => {
    if (!selectedProduct) return [];
    return launches.filter(
      (l) => l.baseProductName === selectedProduct
    );
  }, [selectedProduct, launches]);

  if (launches.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No launches found for this region.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.timeline}>
        <div className={styles.timelineContainer}>
          {sortedYears.map((year) => {
            const yearKey = year === 2030 && groupedByYear["2030+"] ? "2030+" : String(year);
            const yearDisplay = year === 2030 ? "2030+" : year;
            return (
            <div key={year} className={styles.yearGroup}>
              <div className={styles.yearLabel}>
                <h3>{yearDisplay}</h3>
              </div>
              <div className={styles.launches}>
                {groupedByYear[yearKey] && groupedByYear[yearKey].map((launch) => (
                  <div
                    key={launch.id}
                    className={styles.launchCard}
                    onClick={() => setSelectedProduct(launch.baseProductName)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedProduct(launch.baseProductName);
                      }
                    }}
                  >
                    <div className={styles.cardHeader}>
                      <h4>{launch.productName}</h4>
                      <span className={styles.category}>{launch.category}</span>
                    </div>
                    <div className={styles.cardBody}>
                      <p className={styles.description}>{launch.description}</p>
                      <div className={styles.meta}>
                        <span className={styles.month}>
                          {new Date(launch.year, launch.month - 1).toLocaleString(
                            "en-US",
                            {
                              month: "long",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                    <div className={styles.clickPrompt}>
                      Click to see regional launches
                    </div>
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        title={`${selectedProduct} - Global Launch Timeline`}
      >
        <ProductTimeline
          launches={selectedProductLaunches}
          baseProductName={selectedProduct || ""}
        />
      </Modal>
    </>
  );
}
