import { database, Query } from "@/libs/AppWriteClient";
import useGetProfileByUserId from "./useGetProfileByUserId";

jest.mock("@/libs/AppWriteClient", () => ({
  database: {
    listDocuments: jest.fn(),
  },
  Query: {
    equal: jest.fn(),
  },
}));

describe("useGetProfileByUserId", () => {
  const mockUserId = "user123";

  it("should return the correct profile data when userId is provided", async () => {
    const mockResponse = {
      documents: [
        {
          $id: "profile123",
          user_id: mockUserId,
          name: "John Doe",
          image: "profile_image_url",
          bio: "This is a test bio",
        },
      ],
    };

    // Mocking listDocuments to return the above response
    (database.listDocuments as jest.Mock).mockResolvedValue(mockResponse);

    const result = await useGetProfileByUserId(mockUserId);

    expect(database.listDocuments).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE,
      [Query.equal("user_id", mockUserId)]
    );

    expect(result).toEqual({
      id: "profile123",
      user_id: mockUserId,
      name: "John Doe",
      image: "profile_image_url",
      bio: "This is a test bio",
    });
  });

  it("should throw an error when listDocuments fails", async () => {
    const mockError = new Error("Fetch Failed");

    // Mocking listDocuments to throw an error
    (database.listDocuments as jest.Mock).mockRejectedValue(mockError);

    await expect(useGetProfileByUserId(mockUserId)).rejects.toThrow("Fetch Failed");
  });

  it("should return undefined fields when no documents are found", async () => {
    const mockEmptyResponse = { documents: [] };

    (database.listDocuments as jest.Mock).mockResolvedValue(mockEmptyResponse);

    const result = await useGetProfileByUserId(mockUserId);

    expect(database.listDocuments).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE,
      [Query.equal("user_id", mockUserId)]
    );

    expect(result).toEqual({
      id: undefined,
      user_id: undefined,
      name: undefined,
      image: undefined,
      bio: undefined,
    });
  });
});
