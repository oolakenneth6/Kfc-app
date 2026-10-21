const { Router } = require("express");
const Menu = require("../model/menuSchema");
const searchRouter = Router();

searchRouter.get("/item", async (req, res) => {
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";

  if (!search) {
    return res.json([]);
  }

  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  try {
    const items = await Menu.find({
      title: { $regex: escapedSearch, $options: "i" },
    });
    return res.json(items);
  } catch (error) {
    console.error("Menu search failed:", error);
    return res.status(500).json({ error: "Menu search failed" });
  }
});
module.exports = searchRouter;
