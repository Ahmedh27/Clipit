"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { account, ID } from "@/libs/AppWriteClient";
import { User, UserContextTypes } from "../types";
import { useRouter } from "next/navigation";
import useGetProfileByUserId from "../hooks/useGetProfileByUserId";
import useCreateProfile from "../hooks/useCreateProfile";

const UserContext = createContext<UserContextTypes | null>(null);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Check for the current user session
  const checkUser = async () => {
    try {
      const currentSession = await account.getSession("current");
      if (!currentSession) return;

      const promise = (await account.get()) as any;
      const profile = await useGetProfileByUserId(promise?.$id);

      setUser({ 
        id: promise?.$id, 
        name: promise?.name, 
        bio: profile?.bio, 
        image: profile?.image 
      });
    } catch (error) {
      setUser(null);
    }
  };

  // On component mount, check for the user session
  useEffect(() => {
    checkUser();
  }, []);

  // Register a new user
  const register = async (name: string, email: string, password: string) => {
    try {
      const promise = await account.create(ID.unique(), email, password, name);
      await account.createEmailSession(email, password);

      await useCreateProfile(
        promise?.$id,
        name,
        String(process.env.NEXT_PUBLIC_PLACEHOLDER_DEAFULT_IMAGE_ID),
        ""
      );

      await checkUser();
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    }
  };

  // Log in a user (Email & Password)
  const login = async (email: string, password: string) => {
    try {
      await account.createEmailSession(email, password);
      await checkUser();
    } catch (error) {
      console.error("Login Error:", error);
      throw error; // Propagate the error to the calling component
    }
  };

  // Log in a user via OAuth (Google or GitHub)
  const loginWithOAuth = async (provider: 'google' | 'github') => {
    const successUrl = window.location.origin;        // Redirect here on success
    const failureUrl = window.location.origin + '/auth/error'; // Redirect here on failure

    try {
      // This will redirect the user to the OAuth provider's login page
      account.createOAuth2Session(provider, successUrl, failureUrl);
    } catch (error) {
      console.error(`OAuth Login Error with ${provider}:`, error);
      throw error;
    }
  };

  // Log out the current user
  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      router.refresh();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, register, login, logout, checkUser, loginWithOAuth }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
