import { database, ID } from "@/libs/AppWriteClient";

const useCreateFollowers = async (followerId: string, followingId: string): Promise<void> => {
    try {
        await database.createDocument(
            String(process.env.NEXT_PUBLIC_DATABASE_ID),
            String(process.env.NEXT_PUBLIC_COLLECTION_ID_FOLLOWERS),
            ID.unique(),
            {
                follower_id: followerId,
                following_id: followingId,
            }
        );
    } catch (error) {
        console.error("Error creating follow relationship:", error);
        throw error;
    }
};

export default useCreateFollowers;
