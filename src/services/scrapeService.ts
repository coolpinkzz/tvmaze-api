import axios from "axios";
import { Db } from "mongodb";
import { CastItem, ScrapedShow, Show } from "../model/scrapeModel";

export const scrapeAndSaveShowData = async (
  id: string,
  db: Db
): Promise<void> => {
  try {
    // Parallelize API requests
    const [showResponse, castResponse] = await Promise.all([
      axios.get<Show>(`https://api.tvmaze.com/shows/${id}`),
      axios.get<CastItem[]>(`https://api.tvmaze.com/shows/${id}/cast`),
    ]);

    const showData = showResponse.data;
    const castData = castResponse.data;

    const ScrapedShow: ScrapedShow = {
      id: showData.id,
      name: showData.name,
      cast: castData.map((item) => ({
        id: item.person.id,
        name: item.person.name,
        birthday: item.person.birthday,
      })),
    };

    // Store data in MongoDB
    const collection = db.collection("scrappedtvmaze");

    // Check if the record already exists
    const existingRecord = await collection.findOne({ id: parseInt(id) });

    if (existingRecord) {
      throw new Error(
        `Record with ID ${id} already exists. Skipping insertion.`
      );
    }

    await collection.insertOne(ScrapedShow);
  } catch (error: any) {
    throw new Error(
      `Error fetching or saving data for ID ${id}: ${error.message}`
    );
  }
};
