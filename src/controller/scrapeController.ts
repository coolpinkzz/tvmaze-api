import { Request, Response } from "express";
import { scrapeAndSaveShowData } from "../services/scrapeService";

export const scrapeShow = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;
  const db = req.app.locals.db;

  try {
    await scrapeAndSaveShowData(id, db);
    res.status(200).send(`Data with ID ${id} scraped and saved.`);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
