"use client";

import { AiFillHeart } from "react-icons/ai";
import { ImMusic } from "react-icons/im";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import PostMainLikes from "./PostMainLikes";
import useCreateBucketUrl from "../hooks/useCreateBucketUrl";
import { PostMainCompTypes } from "../types";
import useCreateFollowers from "@/app/hooks/useCreateFollowers";
import useDeleteFollower from "@/app/hooks/useDeleteFollower";
import useGetFollowers from "@/app/hooks/useGetFollowers";
import { useUser } from "@/app/context/user";

export default function PostMain({ post }: PostMainCompTypes) {
    const contextUser = useUser();
    const currentUserId = contextUser?.user?.id;
    
    const profileUserId = post?.profile?.user_id ?? post.user_id;

    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [followersCount, setFollowersCount] = useState<number>(0);

    useEffect(() => {
        const video = document.getElementById(`video-${post?.id}`) as HTMLVideoElement | null;
        const postMainElement = document.getElementById(`PostMain-${post.id}`);

        if (postMainElement && video) {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        video.play();
                    } else {
                        video.pause();
                    }
                },
                { threshold: [0.6] }
            );
            observer.observe(postMainElement);

            return () => {
                observer.disconnect();
            };
        }
    }, [post.id]);

    // Fetch followers and determine if the current user is following
    useEffect(() => {
        const fetchFollowers = async () => {
            if (!profileUserId) return;
            try {
                const followers = await useGetFollowers(profileUserId);
                setFollowersCount(followers.length);
                setIsFollowing(
                    followers.some((follower) => follower.follower_id === currentUserId)
                );
            } catch (error) {
                console.error("Error fetching followers:", error);
            }
        };

        fetchFollowers();
    }, [profileUserId, currentUserId]);

    const handleFollowToggle = useCallback(async () => {
        if (!currentUserId || !profileUserId) return;

        try {
            if (isFollowing) {
                // Unfollow
                await useDeleteFollower(currentUserId, profileUserId);
                setFollowersCount((prev) => Math.max(prev - 1, 0));
            } else {
                // Follow
                await useCreateFollowers(currentUserId, profileUserId);
                setFollowersCount((prev) => prev + 1);
            }
            setIsFollowing((prev) => !prev);
        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    }, [currentUserId, profileUserId, isFollowing]);

    return (
        <div id={`PostMain-${post.id}`} className="flex border-b py-6">
            <div className="cursor-pointer">
                <img
                    className="rounded-full max-h-[60px]"
                    width="60"
                    src={useCreateBucketUrl(post?.profile?.image)}
                    alt="Profile"
                />
            </div>

            <div className="pl-3 w-full px-4">
                <div className="flex items-center justify-between pb-0.5">
                    <Link href={`/profile/${profileUserId}`}>
                        <span className="font-bold hover:underline cursor-pointer">
                            {post?.profile?.name || "Unknown User"}
                        </span>
                    </Link>

                    {/* Subscribe/Unsubscribe Button */}
                    {currentUserId !== profileUserId && (
                        <button
                            onClick={handleFollowToggle}
                            className={`border text-[15px] px-[21px] py-0.5 font-semibold rounded-md ${
                                isFollowing
                                    ? "bg-gray-400 text-white hover:bg-gray-500"
                                    : "border-[#06b967] text-[#069ae1] hover:bg-[#04ba68] hover:text-white"
                            }`}
                        >
                            {isFollowing ? "Unsubscribe" : "Subscribe"}
                        </button>
                    )}
                </div>
                <p className="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px]">
                    {post.text}
                </p>
               
                

                <div className="mt-2.5 flex">
                    <div
                        className="relative min-h-[480px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl cursor-pointer"
                    >
                        <video
                            id={`video-${post.id}`}
                            loop
                            controls
                            muted
                            className="rounded-xl object-cover mx-auto h-full"
                            src={useCreateBucketUrl(post?.video_url)}
                        />
                        <img className="absolute right-2 bottom-10" width="90" src="/images/logo.png" alt="Logo" />
                    </div>

                    <PostMainLikes post={post} />
                </div>
            </div>
        </div>
    );
}
