import { database } from "@/libs/AppWriteClient";
import useDeleteComment from "./useDeleteComment";

// Properly mock AppWrite database with jest.fn()
jest.mock("@/libs/AppWriteClient", () => ({
  database: {
    deleteDocument: jest.fn(),
  },
}));

describe("useDeleteComment", () => {
  it("should call deleteDocument with correct parameters", async () => {
    const mockId = "comment123";
    await useDeleteComment(mockId);

    expect(database.deleteDocument).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_COLLECTION_ID_COMMENT,
      mockId
    );
  });

  it("should throw an error if deleteDocument fails", async () => {
    // Ensure deleteDocument rejects with an error
    (database.deleteDocument as jest.Mock).mockRejectedValue(
      new Error("Delete Failed")
    );

    await expect(useDeleteComment("comment123")).rejects.toThrow("Delete Failed");
  });
});
