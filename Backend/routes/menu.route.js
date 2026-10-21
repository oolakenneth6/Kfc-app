const { Router } = require("express");
const Menu = require("../model/menuSchema");
const requireAdmin = require("../middleware/requireAdmin");
const menuRouter = Router();
const menuFields = ["image", "title", "desc", "price", "type"];

function getMenuInput(body, partial = false) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be an object" };
  }

  const entries = Object.entries(body);
  if (entries.length === 0) {
    return { error: "Menu item data is required" };
  }

  const invalidField = entries.find(
    ([field, value]) =>
      !menuFields.includes(field) ||
      typeof value !== "string" ||
      !value.trim()
  );
  if (invalidField) {
    return { error: "Menu fields must be valid strings" };
  }

  const menuItem = Object.fromEntries(
    entries.map(([field, value]) => [field, value.trim()])
  );

  if (!partial) {
    const missingField = menuFields.find((field) => !menuItem[field]);
    if (missingField) {
      return { error: `${missingField} is required` };
    }
  }

  return { menuItem };
}

menuRouter.get("/menu", async (req, res) => {
  let query = req.query;
  let items = await Menu.find(query);
  res.json(items);
});

menuRouter.get("/menu/:id", async (req, res) => {
  let { id } = req.params;
  let only = await Menu.find({ _id: id });
  return res.json(only);
});

menuRouter.post("/menu", requireAdmin, async (req, res) => {
  const { menuItem, error } = getMenuInput(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const item = await Menu.create(menuItem);
    return res.status(201).json(item);
  } catch (createError) {
    console.error("Menu item creation failed:", createError);
    return res.status(500).json({ error: "Menu item creation failed" });
  }
});

menuRouter.put("/menu/:id", requireAdmin, async (req, res) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
    return res.status(400).json({ error: "Invalid menu item ID" });
  }

  const { menuItem, error } = getMenuInput(req.body, true);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const item = await Menu.findByIdAndUpdate(req.params.id, menuItem, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    return res.json(item);
  } catch (updateError) {
    console.error("Menu item update failed:", updateError);
    return res.status(500).json({ error: "Menu item update failed" });
  }
});

menuRouter.delete("/menu/:id", requireAdmin, async (req, res) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
    return res.status(400).json({ error: "Invalid menu item ID" });
  }

  try {
    const item = await Menu.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    return res.json({ message: "Menu item deleted" });
  } catch (deleteError) {
    console.error("Menu item deletion failed:", deleteError);
    return res.status(500).json({ error: "Menu item deletion failed" });
  }
});

module.exports = menuRouter;