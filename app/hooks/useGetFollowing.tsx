import { database, Query } from "@/libs/AppWriteClient";
import useGetProfileByUserId from "./useGetProfileByUserId";
import { Following } from "@/app/types";

const useGetFollowing = async (userId: string): Promise<Following[]> => {
    try {
        const response = await database.listDocuments(
            String(process.env.NEXT_PUBLIC_DATABASE_ID),
            String(process.env.NEXT_PUBLIC_COLLECTION_ID_FOLLOWERS),
            [Query.equal("follower_id", userId)]
        );

        const following = await Promise.all(
            response.documents.map(async (doc) => {
                const profile = await useGetProfileByUserId(doc.following_id);
                return {
                    id: doc.$id,
                    following_id: doc.following_id,
                    profile: {
                        user_id: profile?.user_id,
                        name: profile?.name,
                        image: profile?.image,
                        bio: profile?.bio,
                    },
                };
            })
        );

        return following;
    } catch (error) {
        console.error("Error fetching following:", error);
        throw error;
    }
};

export default useGetFollowing;
