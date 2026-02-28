import { NextApiRequest, NextApiResponse } from "next";
import { productLaunches, ProductLaunch } from "@/data/launches";

type ResponseData =
  | { launches: ProductLaunch[] }
  | { message?: string; error?: string };

// In-memory storage for newly added products (resets on server restart)
const newProducts: ProductLaunch[] = [];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    const { region } = req.query;

    if (!region || typeof region !== "string") {
      return res
        .status(400)
        .json({ error: "Region parameter is required" });
    }

    const validRegions = ["US", "EU", "CN", "JP"];
    if (!validRegions.includes(region.toUpperCase())) {
      return res.status(400).json({
        error: `Invalid region. Must be one of: ${validRegions.join(", ")}`,
      });
    }

    const allLaunches = [...productLaunches, ...newProducts];
    const launches = allLaunches.filter(
      (launch) => launch.region === region.toUpperCase()
    );

    res.status(200).json({ launches });
  } else if (req.method === "POST") {
    const product = req.body as ProductLaunch;

    // Validate required fields
    if (
      !product.productName ||
      !product.baseProductName ||
      !product.category ||
      !product.region ||
      !product.strategyKickoffDate ||
      !product.marketReadoutDate ||
      product.year === undefined ||
      product.month === undefined ||
      product.day === undefined
    ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Validate region
    const validRegions = ["US", "EU", "CN", "JP"];
    if (!validRegions.includes(product.region)) {
      return res.status(400).json({
        error: `Invalid region. Must be one of: ${validRegions.join(", ")}`,
      });
    }

    // Ensure product has an ID
    if (!product.id) {
      product.id = `${product.baseProductName.toLowerCase()}-${product.region.toLowerCase()}-${Date.now()}`;
    }

    // Add to in-memory storage
    newProducts.push(product);

    res.status(201).json({ message: "Product added successfully" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
