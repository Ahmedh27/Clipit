import { database, Query } from "@/libs/AppWriteClient";
import { Post } from "@/app/types";

const useGetLikedPostsByUserId = async (userId: string): Promise<Post[]> => {
    try {
        const likesResponse = await database.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_COLLECTION_ID_LIKE!,
            [Query.equal("user_id", userId)]
        );

        const likedPostIds = likesResponse.documents.map((doc: any) => doc.post_id);

        if (likedPostIds.length === 0) {
            return []; 
        }

        const postsPromises = likedPostIds.map((id) =>
            database.getDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID!,
                process.env.NEXT_PUBLIC_COLLECTION_ID_POST!, 
                id
            )
        );

        const postsResponses = await Promise.allSettled(postsPromises);
        const likedPosts: Post[] = postsResponses
            .filter((result) => result.status === "fulfilled")
            .map((result: any) => {
                const post = result.value;
                return {
                    id: post?.$id || "",
                    user_id: post?.user_id || "",
                    text: post?.text || "",
                    video_url: post?.video_url || "",
                    image: post?.image || "",
                    created_at: post?.$createdAt || new Date().toISOString(), // Add default created_at
                };
            });

        return likedPosts;
    } catch (error) {
        console.error("Error fetching liked posts by user:", error);
        return [];
    }
};

export default useGetLikedPostsByUserId;
