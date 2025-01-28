import Joi from "joi";
import { Card } from "../models/index.model.js";

export async function createCard(req, res) {
  // Create body scema
  const schema = Joi.object({
    content: Joi.string().required(), // require = le champ "content" est obligatoire
    position: Joi.number().integer().min(1),
    color: getHexadecimalColorSchema(),
    list_id: Joi.number().integer().min(1).required()
  });
  // Body validation
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message }); // Renvoyer le message d'erreur de Joi
  }
  // Body destructuring
  const { content, position, color, list_id } = req.body;
  // Créer la nouvelle carte
  const createdCard = await Card.create({ content, position, color, list_id });
  // Répondre avec la nouvelle carte et un status 201
  res.status(201).json(createdCard);
}

export async function getAllCards(req, res) {
  // Récupérer les cartes
  const cards = await Card.findAll();
  // Renvoyer du JSON
  res.json(cards);
}

export async function getOneCard(req, res) {
  // Validation de l'ID
  const { error } = Joi.number().integer().greater(0).validate(req.params.id);
  if (error) {
    return res.status(404).json({ error: `Card not found. Verify the provided ID. ${error.message}` });
  }
  
  // Récupérer la carte en BDD
  const card = await Card.findByPk(req.params.id, { });
  // Si la liste n'existe pas
  if (!card) {
    return res.status(404).json({ error: "Card not found." });
  }
  // Envoyer une réponse
  res.json(card);
}

export async function updateCard(req, res) {
  // Récupérer l'ID de la carte à update
  const cardId = parseInt(req.params.id);
  // Valider cet ID
  if (!Number.isInteger(cardId)) {
    return res.status(404).json({ error: `Card not found` });
  }
  const updateCardSchema = Joi.object({
    content: Joi.string().min(1),
    position: Joi.number().integer().min(1),
    list_id: Joi.number().integer().min(1),
    color: getHexadecimalColorSchema()
  }).min(1).message("Missing body parameters. Provide at least 'content' or 'position' or 'list_id' or 'color' properties");

  const { error } = updateCardSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  const { content, position, color } = req.body;

  // Récupérer la carte en BDD
  const card = await Card.findByPk(cardId);
  // Si elle existe pas => 404
  if (!card) {
    return res.status(404).json({ error: `Card not found` });
  }
  // On peut faire l'update
  const updatedCard = await card.update({
    content,
    position,
    color,
  });
  // Renvoie la carte mise à jour
  res.json(updatedCard);
}

export async function deleteCard(req, res) {
  // Récupérer l'Id de la carte à supprimer
  const cardId = parseInt(req.params.id);
  // Validation de l'ID
  if (! Number.isInteger(cardId)) {
    return res.status(404).json({ error: "Card not found" });
  }
  // Récupérer la carte
  const card = await Card.findByPk(cardId);
  // Vérification de l'existance de la carte
  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }
  await card.destroy();
  // Sinon on supprime et on renvoie une 204 avec un body vide.
  res.status(204).end();
}

function getHexadecimalColorSchema() {
  // Fonction utilitaire pour ne pas avoir à se répéter
  return Joi
    .string()
    .pattern(new RegExp('^#([0-9a-fA-F]{3}){1,2}$'))
    .message("\"color\" should be a valid hexadecimal code."); 
}
