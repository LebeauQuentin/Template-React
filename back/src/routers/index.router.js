import { Router } from "express";
import * as cardController from "../controllers/cardController.js";
import { controllerWrapper as cw } from "../middlewares/index.middleware.js";

export const router = Router();


// == Routes des cartes ==
router.get("/cards", cw(cardController.getAllCards));
router.get("/cards/:id", cw(cardController.getOneCard));
router.post("/cards", cw(cardController.createCard));
router.patch("/cards/:id", cw(cardController.updateCard));
router.delete("/cards/:id", cw(cardController.deleteCard));

// Middleware 404
router.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
