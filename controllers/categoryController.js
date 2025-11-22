import Category from "../models/Category.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, description, parentCategory } = req.body;
    const newCategory = new Category({ name, description, parentCategory });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to create category", details: error });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("parentCategory");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to get categories", details: error });
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("parentCategory");
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to get category", details: error });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { name, description, parentCategory } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, parentCategory },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category", details: error });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category", details: error });
  }
};
