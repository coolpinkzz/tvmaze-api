import request from "supertest";
import express from "express";
import { scrapeShow } from "../controller/scrapeController";
import { Db, MongoClient } from "mongodb";

// Mock the MongoDB client
const mockDb = {
  collection: jest.fn().mockReturnThis(),
  findOne: jest.fn(),
  insertOne: jest.fn(),
};

// Setup Express app for testing
const app = express();
app.locals.db = mockDb;
app.get("/scrape/:id", scrapeShow);

// Unit test for the scraping API
describe("scrapeShow API", () => {
  it("should scrape and save data if not present in the database", async () => {
    // Mock MongoDB methods
    mockDb.findOne = jest.fn().mockResolvedValue(null); // No existing record
    mockDb.insertOne = jest.fn().mockResolvedValue({ insertedId: "some-id" });

    // Mock axios requests
    jest.mock("axios");
    const axios = require("axios");
    axios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: { id: 1, name: "Test Show" } })
      .mockResolvedValueOnce({
        data: [
          { person: { id: 101, name: "Test Actor", birthday: "1990-01-01" } },
        ],
      });

    const response = await request(app).get("/scrape/1");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Data with ID 1 scraped and saved.");
    expect(mockDb.findOne).toHaveBeenCalledWith({ id: 1 });
  });

  it("should not scrape data if it is already present in the database", async () => {
    // Mock MongoDB methods
    mockDb.findOne = jest.fn().mockResolvedValue({ id: 1 }); // Record exists

    const response = await request(app).get("/scrape/1");

    expect(response.status).toBe(500);
    expect(response.text).toBe(
      "Error fetching or saving data for ID 1: Record with ID 1 already exists. Skipping insertion."
    );
    expect(mockDb.findOne).toHaveBeenCalledWith({ id: 1 });
  });
});
``;
