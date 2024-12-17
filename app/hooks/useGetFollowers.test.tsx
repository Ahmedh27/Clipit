import { database, Query } from "@/libs/AppWriteClient";
import useGetFollowers from "./useGetFollowers";
import useGetProfileByUserId from "./useGetProfileByUserId";

jest.mock("@/libs/AppWriteClient", () => ({
  database: {
    listDocuments: jest.fn(),
  },
  Query: {
    equal: jest.fn(),
  },
}));

jest.mock("./useGetProfileByUserId");

describe("useGetFollowers", () => {
  it("should fetch followers and their profiles", async () => {
    const mockUserId = "user123";
    const mockFollowersResponse = {
      documents: [{ $id: "follower1", follower_id: "userA" }],
    };
    const mockProfileResponse = {
      user_id: "userA",
      name: "John Doe",
      image: "image_url",
      bio: "Test Bio",
    };

    (database.listDocuments as jest.Mock).mockResolvedValue(mockFollowersResponse);
    (useGetProfileByUserId as jest.Mock).mockResolvedValue(mockProfileResponse);

    const result = await useGetFollowers(mockUserId);

    expect(database.listDocuments).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_FOLLOWERS,
      [Query.equal("following_id", mockUserId)]
    );

    expect(result).toEqual([
      {
        id: "follower1",
        follower_id: "userA",
        profile: {
          user_id: "userA",
          name: "John Doe",
          image: "image_url",
          bio: "Test Bio",
        },
      },
    ]);
  });

  it("should throw an error if listDocuments fails", async () => {
    (database.listDocuments as jest.Mock).mockRejectedValue(
      new Error("Fetch Failed")
    );

    await expect(useGetFollowers("user123")).rejects.toThrow("Fetch Failed");
  });
});
