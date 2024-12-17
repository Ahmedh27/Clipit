import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuItemFollow from "./MenuItemFollow";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/user";
import ClientOnly from "@/app/components/ClientOnly";
import { useGeneralStore } from "@/app/stores/general";
import getFollowing from "@/app/hooks/useGetFollowing";
import getRandomUsers from "@/app/hooks/useGetRandomUsers";


interface RandomUsers {
  id: string;
  name: string;
  image: string; 
}

export default function SideNavMain() {
  const { setRandomUsers } = useGeneralStore();
  const contextUser = useUser();
  const pathname = usePathname();

  const [followingUsers, setFollowingUsers] = useState<RandomUsers[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<RandomUsers[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (contextUser?.user?.id) {
          const followingRaw = (await getFollowing(contextUser.user.id)) ?? [];
          const random = (await getRandomUsers()) ?? [];

          const followingIds = followingRaw.map((f) => f.profile.user_id);

          const suggested = random
            .filter((user) => !followingIds.includes(user.id))
            .map((user) => ({
              ...user,
              image: user.image ?? "" 
            }));

          const followingList: RandomUsers[] = followingRaw.map((f) => ({
            id: f.profile.user_id,
            name: f.profile.name,
            image: f.profile.image ?? "" 
          }));

          setFollowingUsers(followingList);
          setSuggestedUsers(suggested);
        } else {
          const random = (await getRandomUsers()) ?? [];
          const suggested = random.map((user) => ({
            ...user,
            image: user.image ?? "" 
          }));
          setSuggestedUsers(suggested);
        }
      } catch (error) {
        console.error("Error fetching data in SideNavMain:", error);
      }
    }

    fetchData();
  }, [contextUser?.user?.id]);

  return (
    <>
      <div
        id="SideNavMain"
        className={`
          fixed z-20 bg-white pt-[70px] h-full lg:border-r-0 border-r w-[75px] overflow-auto
          ${pathname === "/" ? "lg:w-[310px]" : "lg:w-[220px]"}
        `}
      >
        <div className="lg:w-full w-[55px] mx-auto">
          <div className="border-b lg:ml-2 mt-2" />
          <h3 className="lg:block hidden text-xs text-gray-600 font-semibold pt-4 pb-2 px-2">
            Suggested accounts
          </h3>

          <div className="lg:hidden block pt-3" />
          <ClientOnly>
            <div className="cursor-pointer">
              {suggestedUsers.map((user, index) => (
                <MenuItemFollow key={index} user={user} />
              ))}
            </div>
          </ClientOnly>

          <button className="lg:block hidden text-[#fd931c] pt-1.5 pl-2 text-[13px]">
            See all
          </button>

          {contextUser?.user?.id && followingUsers.length > 0 && (
            <div>
              <div className="border-b lg:ml-2 mt-2" />
              <h3 className="lg:block hidden text-xs text-gray-600 font-semibold pt-4 pb-2 px-2">
                Following accounts
              </h3>

              <div className="lg:hidden block pt-3" />
              <ClientOnly>
                <div className="cursor-pointer">
                  {followingUsers.map((f, index) => (
                    <MenuItemFollow key={index} user={f} />
                  ))}
                </div>
              </ClientOnly>

              <button className="lg:block hidden text-[#F02C56] pt-1.5 pl-2 text-[13px]">
                See more
              </button>
            </div>
          )}

          <div className="lg:block hidden border-b lg:ml-2 mt-2" />

          <div className="lg:block hidden text-[11px] text-gray-500">
            <p className="pt-4 px-2">
              Discover Clipit: About Us, Newsroom, Shop, Contact, Careers — Powered by CCNY
            </p>
            <p className="pt-4 px-2">
              "Clipit for Inspiration | Promote Creativity | Empower Developers | Build Trust |
              Clipit Rewards | Explore Clips | Share Seamlessly with Clipit Embeds
            </p>
            <p className="pt-4 px-2">
              "Support | Security | Policies | Creator Hub | Community Standards
            </p>
            <p className="pt-4 px-2">© 2024 Clipit</p>
          </div>

          <div className="pb-14"></div>
        </div>
      </div>
    </>
  );
}
