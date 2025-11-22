//@ts-ignore
import { Request, Response } from "express";
import Product from "../models/Product.js";
import { uploadToS3 } from "../utils/s3Client.js";

interface MulterFile extends Express.Multer.File {}
interface ProductRequest extends Request {
  files: {
    images?: MulterFile[];
    video?: MulterFile[];
  };
}

export const createProduct = async (req: ProductRequest, res: Response) => {
  try {
    const { name, description, price, category, sizes, colors, stock } =
      req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const imagesFiles = req.files?.images || [];
    const videoFile = req.files?.video ? req.files.video[0] : null;

    const imageUrls = await Promise.all(
      imagesFiles.map((file) =>
        uploadToS3(
          file.buffer,
          `images/${Date.now()}-${file.originalname}`,
          file.mimetype
        )
      )
    );

    let videoUrl = "";
    if (videoFile) {
      videoUrl = await uploadToS3(
        videoFile.buffer,
        `videos/${Date.now()}-${videoFile.originalname}`,
        videoFile.mimetype
      );
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      sizes: sizes ? (Array.isArray(sizes) ? sizes : [sizes]) : [],
      colors: colors ? (Array.isArray(colors) ? colors : [colors]) : [],
      stock: stock ? Number(stock) : 0,
      images: imageUrls,
      videoUrl,
    });

    await product.save();

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    res.status(500).json({ error: "Failed to create product", details: error });
  }
};

export const editProduct = async (req: ProductRequest, res: Response) => {
  try {
    const productId = req.params.id;
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const {
      name,
      description,
      price,
      category,
      sizes,
      colors,
      stock,
      removeImages,
    } = req.body;

    if (name) existingProduct.name = name;
    if (description) existingProduct.description = description;
    if (price) existingProduct.price = Number(price);
    if (category) existingProduct.category = category;
    if (sizes) existingProduct.sizes = Array.isArray(sizes) ? sizes : [sizes];
    if (colors)
      existingProduct.colors = Array.isArray(colors) ? colors : [colors];
    if (stock) existingProduct.stock = Number(stock);

    if (removeImages) {
      const removeList = Array.isArray(removeImages)
        ? removeImages
        : [removeImages];
      existingProduct.images = existingProduct.images.filter(
        (img) => !removeList.includes(img)
      );
    }

    const imagesFiles = req.files?.images || [];
    const videoFile = req.files?.video ? req.files.video[0] : null;

    if (imagesFiles.length > 0) {
      const newImageUrls = await Promise.all(
        imagesFiles.map((file) =>
          uploadToS3(
            file.buffer,
            `images/${Date.now()}-${file.originalname}`,
            file.mimetype
          )
        )
      );
      existingProduct.images.push(...newImageUrls);
    }

    if (videoFile) {
      const newVideoUrl = await uploadToS3(
        videoFile.buffer,
        `videos/${Date.now()}-${videoFile.originalname}`,
        videoFile.mimetype
      );
      existingProduct.videoUrl = newVideoUrl;
    }

    await existingProduct.save();

    res
      .status(200)
      .json({ message: "Product updated", product: existingProduct });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product", details: error });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to get product", details: error });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to get products", details: error });
  }
};
