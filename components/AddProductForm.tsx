import { useState } from "react";
import type { ProductLaunch } from "@/data/launches";
import styles from "@/styles/AddProductForm.module.css";

interface AddProductFormProps {
  onClose: () => void;
  onSubmit: (product: ProductLaunch) => void;
  // optional initial data when editing an existing launch
  initialData?: ProductLaunch;
  // flag to indicate edit mode (defaults to false)
  isEdit?: boolean;
}

const REGIONS: Array<"US" | "EU" | "CN" | "JP"> = ["US", "EU", "CN", "JP"];

export default function AddProductForm({
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
}: AddProductFormProps) {
  // initialize state from initialData if available (for edit) otherwise blank
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      // convert year/month/day to YYYY-MM-DD string for date inputs
      const pad = (n: number) => n.toString().padStart(2, "0");
      const launchDate = `${initialData.year}-${pad(initialData.month)}-${pad(
        initialData.day
      )}`;
      return {
        productName: initialData.productName,
        baseProductName: initialData.baseProductName,
        launchDate,
        region: initialData.region,
        category: initialData.category,
        description: initialData.description,
        strategyKickoffDate: initialData.strategyKickoffDate,
        marketReadoutDate: initialData.marketReadoutDate,
      };
    }
    return {
      productName: "",
      baseProductName: "",
      launchDate: "",
      region: "US" as const,
      category: "",
      description: "",
      strategyKickoffDate: "",
      marketReadoutDate: "",
    };
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.productName ||
      !formData.baseProductName ||
      !formData.category ||
      !formData.launchDate ||
      !formData.strategyKickoffDate ||
      !formData.marketReadoutDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Parse launchDate (YYYY-MM-DD) into year, month, day
    const [yearStr, monthStr, dayStr] = formData.launchDate.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    const product: ProductLaunch = {
      id:
        initialData?.id ||
        `${formData.baseProductName.toLowerCase()}-${formData.region.toLowerCase()}-${Date.now()}`,
      productName: formData.productName,
      baseProductName: formData.baseProductName,
      year,
      month,
      day,
      region: formData.region,
      category: formData.category,
      description: formData.description,
      strategyKickoffDate: formData.strategyKickoffDate,
      marketReadoutDate: formData.marketReadoutDate,
    };

    onSubmit(product);
  };

  return (
    <div className={styles.formContainer}>
      <h2>{isEdit ? "Edit Product Launch" : "Add New Product Launch"}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="productName">Product Name *</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="e.g., Analytics Pro US"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="baseProductName">Base Product Name *</label>
          <input
            type="text"
            id="baseProductName"
            name="baseProductName"
            value={formData.baseProductName}
            onChange={handleChange}
            placeholder="e.g., Analytics Pro"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="launchDate">Launch Date *</label>
          <input
            type="date"
            id="launchDate"
            name="launchDate"
            value={formData.launchDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="region">Region *</label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
          >
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Category *</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Analytics, Cloud Storage"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={3}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="strategyKickoffDate">Strategy Kickoff Date *</label>
            <input
              type="date"
              id="strategyKickoffDate"
              name="strategyKickoffDate"
              value={formData.strategyKickoffDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="marketReadoutDate">Market Readout Date *</label>
            <input
              type="date"
              id="marketReadoutDate"
              name="marketReadoutDate"
              value={formData.marketReadoutDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn}>
            {isEdit ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
