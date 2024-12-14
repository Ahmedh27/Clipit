import { database, Query } from "@/libs/AppWriteClient";
import useGetProfileByUserId from "./useGetProfileByUserId";
import { Follower } from "@/app/types";

const useGetFollowers = async (userId: string): Promise<Follower[]> => {
    try {
        const response = await database.listDocuments(
            String(process.env.NEXT_PUBLIC_DATABASE_ID),
            String(process.env.NEXT_PUBLIC_COLLECTION_ID_FOLLOWERS),
            [Query.equal("following_id", userId)]
        );

        const followers = await Promise.all(
            response.documents.map(async (doc) => {
                const profile = await useGetProfileByUserId(doc.follower_id);
                return {
                    id: doc.$id,
                    follower_id: doc.follower_id,
                    profile: {
                        user_id: profile?.user_id,
                        name: profile?.name,
                        image: profile?.image,
                        bio: profile?.bio,
                    },
                };
            })
        );

        return followers;
    } catch (error) {
        console.error("Error fetching followers:", error);
        throw error;
    }
};

export default useGetFollowers;
