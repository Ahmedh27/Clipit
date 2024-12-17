import { database, Query } from "@/libs/AppWriteClient";
import useSearchProfilesByName from "./useSearchProfilesByName";

jest.mock("@/libs/AppWriteClient", () => ({
  database: {
    listDocuments: jest.fn(),
  },
  Query: {
    limit: jest.fn(),
    search: jest.fn(),
  },
}));

describe("useSearchProfilesByName", () => {
  it("should return profiles matching the search name", async () => {
    const mockName = "John";
    const mockProfilesResponse = {
      documents: [
        { user_id: "user1", name: "John Doe", image: "image1" },
        { user_id: "user2", name: "Johnny Smith", image: "image2" },
      ],
    };

    (database.listDocuments as jest.Mock).mockResolvedValue(mockProfilesResponse);

    const result = await useSearchProfilesByName(mockName);

    expect(database.listDocuments).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE,
      [Query.limit(5), Query.search("name", mockName)]
    );

    expect(result).toEqual([
      { id: "user1", name: "John Doe", image: "image1" },
      { id: "user2", name: "Johnny Smith", image: "image2" },
    ]);
  });

  it("should return undefined if an error occurs", async () => {
    (database.listDocuments as jest.Mock).mockRejectedValue(
      new Error("Search Failed")
    );

    const result = await useSearchProfilesByName("John");

    expect(result).toBeUndefined();
    expect(console.log).toHaveBeenCalled(); // Check if error is logged
  });
});
