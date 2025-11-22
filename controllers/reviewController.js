import Review from "../models/Review.js";

// Add a new review for a product
export const addReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    if (!product || !rating) {
      return res.status(400).json({ error: "Product and rating are required" });
    }

    const existingReview = await Review.findOne({
      product,
      user: req.user.userId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You already reviewed this product" });
    }

    const review = new Review({
      product,
      rating,
      comment,
      user: req.user.userId,
    });

    await review.save();
    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    res.status(500).json({ error: "Failed to add review", details: error });
  }
};

// Get all reviews for a specific product
export const getReviewsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name") // Include user name
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to get reviews", details: error });
  }
};

// Update a user's review by review id
export const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.user.toString() !== req.user.userId)
      return res
        .status(403)
        .json({ error: "Unauthorized to update this review" });

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();
    res.status(200).json({ message: "Review updated", review });
  } catch (error) {
    res.status(500).json({ error: "Failed to update review", details: error });
  }
};

// Delete a user's review
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.user.toString() !== req.user.userId)
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this review" });

    await review.remove();
    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete review", details: error });
  }
};
