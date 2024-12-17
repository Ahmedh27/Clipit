import { database, ID } from "@/libs/AppWriteClient";
import useCreateComment from "./useCreateComment";

jest.mock("@/libs/AppWriteClient", () => ({
  database: {
    createDocument: jest.fn(),
  },
  ID: {
    unique: jest.fn().mockReturnValue("unique-id-123"),
  },
}));

describe("useCreateComment", () => {
  it("should call createDocument with correct parameters", async () => {
    const mockUserId = "user123";
    const mockPostId = "post456";
    const mockComment = "This is a test comment.";

    await useCreateComment(mockUserId, mockPostId, mockComment);

    expect(database.createDocument).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_COMMENT,
      "unique-id-123",
      {
        user_id: mockUserId,
        post_id: mockPostId,
        text: mockComment,
        created_at: expect.any(String),
      }
    );
  });

  it("should throw an error if createDocument fails", async () => {
    (database.createDocument as jest.Mock).mockRejectedValue(
      new Error("Create Failed")
    );

    await expect(
      useCreateComment("user123", "post456", "Test comment")
    ).rejects.toThrow("Create Failed");
  });
});
