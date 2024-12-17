"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/user";
import useGetFollowing from "@/app/hooks/useGetFollowing";
import useGetPostsByUserId from "@/app/hooks/useGetPostsByUserId";
import PostMain from "@/app/components/PostMain";
import Link from "next/link";

export default function Subscriptions() {
    const contextUser = useUser();
    const currentUserId = contextUser?.user?.id;

    const [following, setFollowing] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            if (!currentUserId) return;

            try {
                setLoading(true);

                const followedUsers = await useGetFollowing(currentUserId);
                setFollowing(followedUsers);

                const postsPromises = followedUsers.map((user) =>
                    useGetPostsByUserId(user.following_id)
                );

                const postsResults = await Promise.all(postsPromises);

                const filteredPosts = postsResults
                    .flat()
                    .filter((post) => post.user_id && post.text && post.video_url);

                const postsWithProfile = filteredPosts.map((post) => {
                    const userProfile = followedUsers.find((f) => f.following_id === post.user_id)?.profile;
                    return { ...post, profile: userProfile };
                });

                setPosts(postsWithProfile);
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, [currentUserId]);

    return (
        <div className="bg-neutral-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 selection:bg-teal-300">
            <div className="max-w-6xl mx-auto space-y-6 bg-white shadow-xl rounded-2xl overflow-hidden">
                {/* Unique Navigation */}
                <nav className="bg-gradient-to-r from-teal-50 to-white px-6 py-4 flex items-center justify-between border-b border-neutral-100">
                    <h1 className="text-2xl font-extralight tracking-tight text-neutral-800">
                        Subscriptions
                    </h1>
                    <Link 
                        href="/" 
                        className="text-teal-600 hover:text-teal-800 transition-colors duration-300 font-medium"
                    >
                        Home
                    </Link>
                </nav>

                {/* Content Area */}
                <div className="p-6">
                    <p className="text-center text-neutral-500 mb-6 text-sm italic">
                        Discover content from creators you follow
                    </p>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-pulse text-neutral-400">Loading...</div>
                        </div>
                    ) : posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                            {posts.map((post) => (
                                <div 
                                    key={post.id} 
                                    className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                                >
                                    <PostMain post={post} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-neutral-50 rounded-xl">
                            <p className="text-neutral-500">
                                You haven't subscribed to any creators yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}