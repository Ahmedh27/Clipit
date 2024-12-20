"use client"
import PostUser from "@/app/components/profile/PostUser"
import MainLayout from "@/app/layouts/MainLayout"
import { BsPencil } from "react-icons/bs"
import { useEffect, useState, useCallback } from "react"
import { useUser } from "@/app/context/user"
import ClientOnly from "@/app/components/ClientOnly"
import { User, Follower, Following, Post } from "@/app/types"
import { usePostStore } from "@/app/stores/post"
import { useProfileStore } from "@/app/stores/profile"
import { useGeneralStore } from "@/app/stores/general"
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl"
import useCreateFollowers from "@/app/hooks/useCreateFollowers"
import useDeleteFollower from "@/app/hooks/useDeleteFollower"
import useGetFollowers from "@/app/hooks/useGetFollowers"
import useGetFollowing from "@/app/hooks/useGetFollowing"
import useGetLikedPostsByUserId from "@/app/hooks/useGetLikedPostsByUserId"  // The new hook we created above

export default function Profile({ params }: { params: { id: string } }) {
    const contextUser = useUser()
    const { postsByUser, setPostsByUser } = usePostStore()
    const { setCurrentProfile, currentProfile } = useProfileStore()
    const { isEditProfileOpen, setIsEditProfileOpen } = useGeneralStore()

    const [followers, setFollowers] = useState<Follower[]>([])
    const [following, setFollowing] = useState<Following[]>([])
    const [isFollowing, setIsFollowing] = useState<boolean>(false)

    const [showFollowers, setShowFollowers] = useState<boolean>(false)
    const [showFollowing, setShowFollowing] = useState<boolean>(false)

    const [likedPosts, setLikedPosts] = useState<Post[]>([]) // State to hold liked posts

    // 'videos' or 'liked'
    const [selectedTab, setSelectedTab] = useState<"videos" | "liked">("videos")

    const currentUserId = contextUser?.user?.id
    const profileUserId = params.id

    useEffect(() => {
        if (!profileUserId) return

        // Set current profile and posts
        setCurrentProfile(profileUserId)
        setPostsByUser(profileUserId)

        const fetchData = async () => {
            try {
                const fetchedFollowers = await useGetFollowers(profileUserId)
                setFollowers(fetchedFollowers)

                const fetchedFollowing = await useGetFollowing(profileUserId)
                setFollowing(fetchedFollowing)
            } catch (error) {
                console.error("Error fetching followers/following:", error)
            }
        }

        fetchData()
    }, [profileUserId, setCurrentProfile, setPostsByUser])

    useEffect(() => {
        if (currentUserId && followers.length > 0) {
            const userIsFollowing = followers.some((follower) => follower.follower_id === currentUserId)
            setIsFollowing(userIsFollowing)
        } else {
            setIsFollowing(false)
        }
    }, [currentUserId, followers])

    const handleFollowToggle = useCallback(async () => {
        if (!currentUserId || !profileUserId) return

        try {
            if (isFollowing) {
                await useDeleteFollower(currentUserId, profileUserId)
            } else {
                await useCreateFollowers(currentUserId, profileUserId)
            }

            const updatedFollowers = await useGetFollowers(profileUserId)
            setFollowers(updatedFollowers)

        } catch (error) {
            console.error("Error toggling follow:", error)
        }
    }, [currentUserId, profileUserId, isFollowing])

    // Fetch liked posts once the profile is loaded
    useEffect(() => {
        const fetchLikedPosts = async () => {
            if (!profileUserId) return
            try {
                const userLikedPosts = await useGetLikedPostsByUserId(profileUserId)
                setLikedPosts(userLikedPosts)
            } catch (error) {
                console.error("Error fetching liked posts:", error)
            }
        }
        fetchLikedPosts()
    }, [profileUserId])

    return (
        <MainLayout>
            <div className="pt-[90px] ml-[90px] 2xl:pl-[185px] lg:pl-[160px] lg:pr-0 w-[calc(100%-90px)] pr-3 max-w-[1800px] 2xl:mx-auto">

                <div className="flex w-[calc(100vw-230px)]">
                    <ClientOnly>
                        {currentProfile ? (
                            <img 
                                className="w-[120px] min-w-[120px] rounded-full" 
                                src={useCreateBucketUrl(currentProfile?.image)} 
                                alt="Profile Image"
                            />
                        ) : (
                            <div className="min-w-[150px] h-[120px] bg-gray-200 rounded-full" />
                        )}
                    </ClientOnly>

                    <div className="ml-5 w-full">
                        <ClientOnly>
                            {(currentProfile as User)?.name ? (
                                <div>
                                    <p className="text-[30px] font-bold truncate">{currentProfile?.name}</p>
                                    <p className="text-[18px] truncate">{currentProfile?.name}</p>
                                </div>
                            ) : (
                                <div className="h-[60px]" />
                            )}
                        </ClientOnly>

                        {contextUser?.user?.id === profileUserId ? (
                            <button 
                                onClick={() => setIsEditProfileOpen(!isEditProfileOpen)}
                                className="flex item-center rounded-md py-1.5 px-3.5 mt-3 text-[15px] font-semibold border hover:bg-gray-100"
                            >
                                <BsPencil className="mt-0.5 mr-1" size="18"/>
                                <span>Edit profile</span>
                            </button>
                        ) : (
                            <button 
                                onClick={handleFollowToggle}
                                className={`flex item-center rounded-md py-1.5 px-8 mt-3 text-[15px] text-white font-semibold ${isFollowing ? 'bg-gray-400' : 'bg-[#03b869]'}`}
                            >
                                {isFollowing ? 'Unsubscribe' : 'Subscribe'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center pt-4">
                    <div className="mr-4 cursor-pointer" onClick={() => setShowFollowing(true)}>
                        <span className="font-bold">{following.length}</span>
                        <span className="text-gray-500 font-light text-[15px] pl-1.5">Subscriptions</span>
                    </div>
                    <div className="mr-4 cursor-pointer" onClick={() => setShowFollowers(true)}>
                        <span className="font-bold">{followers.length}</span>
                        <span className="text-gray-500 font-light text-[15px] pl-1.5">Subscribers</span>
                    </div>
                </div>

                {showFollowers && (
                    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-[400px]">
                            <h2 className="text-xl font-bold mb-4">Subscribers</h2>
                            <ul>
                                {followers.map((follower) => (
                                    <li key={follower.id} className="flex items-center mb-2">
                                        <img
                                            src={useCreateBucketUrl(follower.profile.image)}
                                            alt={follower.profile.name}
                                            className="w-8 h-8 rounded-full mr-2"
                                        />
                                        <span>{follower.profile.name}</span>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => setShowFollowers(false)} className="mt-4 text-blue-500 font-semibold">
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {showFollowing && (
                    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-[400px]">
                            <h2 className="text-xl font-bold mb-4">Subscriptions</h2>
                            <ul>
                                {following.map((follow) => (
                                    <li key={follow.id} className="flex items-center mb-2">
                                        <img
                                            src={useCreateBucketUrl(follow.profile.image)}
                                            alt={follow.profile.name}
                                            className="w-8 h-8 rounded-full mr-2"
                                        />
                                        <span>{follow.profile.name}</span>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => setShowFollowing(false)} className="mt-4 text-blue-500 font-semibold">
                                Close
                            </button>
                        </div>
                    </div>
                )}

                <ClientOnly>
                    <p className="pt-4 mr-4 text-gray-500 font-light text-[15px] pl-1.5 max-w-[500px]">
                        {currentProfile?.bio}
                    </p>
                </ClientOnly>

                {/* Tabs for Videos and Liked */}
                <ul className="w-full flex items-center pt-4 border-b">
                    <li 
                        className={`w-60 text-center py-2 text-[17px] font-semibold cursor-pointer ${selectedTab === 'videos' ? 'border-b-2 border-b-black' : 'text-gray-500'}`}
                        onClick={() => setSelectedTab('videos')}
                    >
                        Videos
                    </li>
                    <li 
                        className={`w-60 text-center py-2 text-[17px] font-semibold cursor-pointer ${selectedTab === 'liked' ? 'border-b-2 border-b-black' : 'text-gray-500'}`}
                        onClick={() => setSelectedTab('liked')}
                    >
                        Liked
                    </li>
                </ul>

                <ClientOnly>
                    {selectedTab === "videos" ? (
                        <div className="mt-4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
                            {postsByUser?.map((post, index) => (
                                <PostUser key={index} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
                            {likedPosts?.map((post, index) => (
                                <PostUser key={index} post={post} />
                            ))}
                        </div>
                    )}
                </ClientOnly>

                <div className="pb-20" />
            </div>
        </MainLayout>
    )
}
