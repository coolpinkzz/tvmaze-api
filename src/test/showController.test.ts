import request from "supertest";
import express from "express";
import { Db, MongoClient } from "mongodb";
import { getShows } from "../controller/showsController";

// Mock the MongoDB client
const mockDb = {
  collection: jest.fn().mockReturnThis(),
  findOne: jest.fn(),
  insertOne: jest.fn(),
};

// Setup Express app for testing
const app = express();
app.locals.db = mockDb;
app.get("/shows", getShows);

describe("getScrapedData API", () => {
  it("should return paginated data with sorted cast by birthday in descending order", async () => {
    // Mock MongoDB methods
    mockDb.collection = jest.fn().mockReturnValue({
      aggregate: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([
          {
            id: 1,
            name: "Test Show",
            cast: [
              { id: 101, name: "Actor 1", birthday: "1990-01-01" },
              { id: 102, name: "Actor 2", birthday: "1985-05-05" },
            ],
          },
        ]),
      }),
      countDocuments: jest.fn().mockResolvedValue(1),
    });

    const response = await request(app).get("/shows?page=1&limit=1");
    console.log(response.status);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [
        {
          id: 1,
          name: "Test Show",
          cast: [
            { id: 101, name: "Actor 1", birthday: "1990-01-01" },
            { id: 102, name: "Actor 2", birthday: "1985-05-05" },
          ],
        },
      ],
      total: 1,
      page: 1,
      totalPages: 1,
    });
    expect(mockDb.collection).toHaveBeenCalledWith("scrappedtvmaze");
  });

  it("should return empty array if no data is found", async () => {
    // Mock MongoDB methods
    mockDb.collection = jest.fn().mockReturnValue({
      aggregate: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([]),
      }),
      countDocuments: jest.fn().mockResolvedValue(0),
    });

    const response = await request(app).get("/shows?page=1&limit=1");

    expect(response.status).toBe(200);
  });
});
