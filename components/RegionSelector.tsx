import styles from "@/styles/RegionSelector.module.css";

interface RegionSelectorProps {
  regions: Array<"US" | "EU" | "CN" | "JP">;
  selectedRegion: "US" | "EU" | "CN" | "JP";
  onSelectRegion: (region: "US" | "EU" | "CN" | "JP") => void;
}

export default function RegionSelector({
  regions,
  selectedRegion,
  onSelectRegion,
}: RegionSelectorProps) {
  const regionLabels: Record<string, string> = {
    US: "United States",
    EU: "Europe",
    CN: "China",
    JP: "Japan",
  };

  return (
    <div className={styles.selector}>
      <h2>Select Region</h2>
      <div className={styles.buttons}>
        {regions.map((region) => (
          <button
            key={region}
            className={`${styles.button} ${
              selectedRegion === region ? styles.active : ""
            }`}
            onClick={() => onSelectRegion(region)}
          >
            {regionLabels[region]}
          </button>
        ))}
      </div>
    </div>
  );
}
