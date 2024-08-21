import express, { Request, Response } from "express";
import { connectToDatabase, disconnectFromDatabase } from "./db";
import dotenv from "dotenv";
import { scrapeShow } from "./controller/scrapeController";
import { getShows } from "./controller/showsController";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to connect to the database
app.use(async (req: Request, res: Response, next) => {
  try {
    const db = await connectToDatabase();
    req.app.locals.db = db; // Store db instance in locals
    next();
  } catch (error) {
    res.status(500).send("Failed to connect to the database");
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.get("/scrape/:id", scrapeShow);

app.get("/shows", getShows);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await disconnectFromDatabase();
  process.exit(0);
});
