import { database, Query } from "@/libs/AppWriteClient";

const useDeleteFollower = async (followerId: string, followingId: string): Promise<void> => {
    try {
        const response = await database.listDocuments(
            String(process.env.NEXT_PUBLIC_DATABASE_ID),
            String(process.env.NEXT_PUBLIC_COLLECTION_ID_FOLLOWERS),
            [
                Query.equal("follower_id", followerId),
                Query.equal("following_id", followingId),
            ]
        );

        if (response.documents.length > 0) {
            await database.deleteDocument(
                String(process.env.NEXT_PUBLIC_DATABASE_ID),
                String(process.env.NEXT_PUBLIC_COLLECTION_ID_FOLLOWERS),
                response.documents[0].$id
            );
        } else {
            throw new Error("Follow relationship not found");
        }
    } catch (error) {
        console.error("Error deleting follow relationship:", error);
        throw error;
    }
};

export default useDeleteFollower;
