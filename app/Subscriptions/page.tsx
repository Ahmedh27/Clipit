"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/user";
import useGetFollowing from "@/app/hooks/useGetFollowing";
import useGetPostsByUserId from "@/app/hooks/useGetPostsByUserId";
import PostMain from "@/app/components/PostMain"; // Reusable PostMain component
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

                // Fetch followed users with their profiles
                const followedUsers = await useGetFollowing(currentUserId);
                setFollowing(followedUsers);

                // Fetch posts for all followed users
                const postsPromises = followedUsers.map((user) =>
                    useGetPostsByUserId(user.following_id)
                );

                const postsResults = await Promise.all(postsPromises);

                // Filter out posts with missing fields
                const filteredPosts = postsResults
                    .flat()
                    .filter((post) => post.user_id && post.text && post.video_url);

                // Attach corresponding profile info to each post
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
        <div className="p-6 min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <nav className="w-full flex justify-between items-center border-b pb-2 mb-4">
                <h1 className="text-3xl font-bold">Your Subscriptions</h1>
                <Link href="/" className="text-blue-500 font-semibold hover:underline">
                    Home
                </Link>
            </nav>

            {/* Subscription Content */}
            <div className="flex flex-col items-center justify-center flex-1">
                <p className="mt-2 text-gray-600">Content from people you are subscribed to:</p>

                {loading ? (
                    <p className="mt-4 text-gray-500">Loading...</p>
                ) : posts.length > 0 ? (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
                        {posts.map((post) => (
                            <PostMain key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <p className="mt-4 text-gray-500">You are not subscribed to anyone yet.</p>
                )}
            </div>
        </div>
    );
}
