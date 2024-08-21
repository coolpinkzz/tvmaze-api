import { Db } from "mongodb";
import { ScrapedShow } from "../model/scrapeModel";

export const getAllShows = async (
  db: Db,
  page: number,
  limit: number
): Promise<{
  data: ScrapedShow[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const collection = db.collection<ScrapedShow>("scrappedtvmaze");

  // Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  // Retrieve the paginated data and total count
  const [data, total] = await Promise.all([
    collection
      .aggregate([
        {
          $project: {
            id: 1,
            name: 1,
            cast: {
              $sortArray: {
                input: "$cast",
                sortBy: { birthday: -1 },
              },
            },
          },
        },
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray() as Promise<ScrapedShow[]>,
    collection.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    totalPages,
  };
};
