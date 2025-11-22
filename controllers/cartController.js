import Cart from "../models/Cart.js";

// Get cart for logged-in user
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product"
    );
    if (!cart) return res.status(200).json({ items: [] });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to get cart", details: error });
  }
};

// Add an item to cart or increase quantity if exists
export const addItemToCart = async (req, res) => {
  try {
    const { product, quantity = 1, size, color } = req.body;
    if (!product) return res.status(400).json({ error: "Product ID required" });

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    // Check if item with same product & attributes exists
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === product &&
        item.size === size &&
        item.color === color
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product, quantity, size, color });
    }

    await cart.save();
    res.status(200).json({ message: "Item added/updated", cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to add item", details: error });
  }
};

// Update cart item quantity or attributes
export const updateCartItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { quantity, size, color } = req.body;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (quantity !== undefined) item.quantity = quantity;
    if (size !== undefined) item.size = size;
    if (color !== undefined) item.color = color;

    await cart.save();
    res.status(200).json({ message: "Cart item updated", cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to update item", details: error });
  }
};

// Remove an item from cart
export const removeCartItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items.id(itemId)?.remove();

    await cart.save();
    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item", details: error });
  }
};

// Clear all items in cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cart", details: error });
  }
};
