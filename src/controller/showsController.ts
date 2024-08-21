import { Request, Response } from "express";
import { getAllShows } from "../services/showService";

export const getShows = async (req: Request, res: Response): Promise<void> => {
  const db = req.app.locals.db;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const result = await getAllShows(db, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving paginated data:", error);
    res.status(500).send("An error occurred while retrieving data.");
  }
};
