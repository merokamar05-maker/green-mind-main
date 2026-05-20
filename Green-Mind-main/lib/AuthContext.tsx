"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

/* ===========================
   Types
=========================== */
export interface ChildProgress {
  scansCount: number;
  lessonsCompleted: string[];
  quizScores: Record<string, number>;
  gamesProgress: { puzzle: number; memory: number; matching: number };
  treeLevel: number;
  weeklyProgress: number[];
  waterCount: number;
  sunCount: number;
  xp?: number;
  watchedVideos?: string[];
  lastWateredTime?: number;
  lastLoginDate?: string;
}

export interface ChildData {
  id: string;
  childName: string;
  avatar: string;
  age: string;
  mood: string;
  progress: ChildProgress;
}

interface AuthContextType {
  user: User | null;
  /** Active child data — backward compatible with old userData usage */
  userData: ChildData | null;
  parentData: any | null;
  activeChildIndex: number;
  childrenList: ChildData[];
  loading: boolean;
  updateUserData: (newData: Partial<ChildData>) => Promise<void>;
  addChild: (childData: Partial<ChildData>) => Promise<void>;
  switchChild: (index: number) => Promise<void>;
}

/* ===========================
   Defaults
   =========================== */
export const defaultProgress: ChildProgress = {
  scansCount: 0,
  lessonsCompleted: [],
  quizScores: {},
  gamesProgress: { puzzle: 0, memory: 0, matching: 0 },
  treeLevel: 1,
  weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
  waterCount: 0,
  sunCount: 0,
  xp: 0,
  watchedVideos: [],
  lastWateredTime: 0,
  lastLoginDate: "",
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  parentData: null,
  activeChildIndex: 0,
  childrenList: [],
  loading: true,
  updateUserData: async () => {},
  addChild: async () => {},
  switchChild: async () => {},
});

/* ===========================
   Provider
=========================== */
export const AuthProvider = ({ children: reactChildren }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [parentData, setParentData] = useState<any | null>(null);
  const [childrenList, setChildrenList] = useState<ChildData[]>([]);
  const [activeChildIndex, setActiveChildIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const activeChild = childrenList[activeChildIndex] ?? null;

  /* ---------- Auth listener ---------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            /* --- Auto-migrate old single-child format --- */
            if (!data.children) {
              const migratedChild: ChildData = {
                id: "child_0",
                childName: data.childName || "My Child",
                avatar: data.avatar || "/SCreen/cute.png",
                age: data.age || "7 Years",
                mood: data.mood || "Calm",
                progress: { ...defaultProgress, ...(data.progress || {}) },
              };
              const newDoc = { activeChildIndex: 0, children: [migratedChild] };
              await setDoc(docRef, newDoc, { merge: true });
              setChildrenList([migratedChild]);
              setActiveChildIndex(0);
              setParentData({ ...data, ...newDoc });
            } else {
              const idx = data.activeChildIndex ?? 0;
              setChildrenList(data.children ?? []);
              setActiveChildIndex(idx);
              setParentData(data);
            }
          } else {
            console.warn("No user profile in Firestore.");
            setChildrenList([]);
            setParentData(null);
          }
        } catch (err: any) {
          console.error("Firestore Error:", err.message);
          setChildrenList([]);
          setParentData(null);
        }
      } else {
        setUser(null);
        setChildrenList([]);
        setParentData(null);
        setActiveChildIndex(0);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /* ---------- updateUserData — updates active child ---------- */
  const updateUserData = async (newData: Partial<ChildData>) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      const updated = [...childrenList];
      updated[activeChildIndex] = {
        ...updated[activeChildIndex],
        ...newData,
        // Deep-merge progress so waterCount/sunCount etc. are preserved
        progress: newData.progress
          ? { ...updated[activeChildIndex]?.progress, ...newData.progress }
          : updated[activeChildIndex]?.progress,
      };
      await setDoc(userRef, { children: updated }, { merge: true });
      setChildrenList(updated);
    } catch (err: any) {
      console.error("Update Error:", err.message);
      throw err;
    }
  };

  /* ---------- addChild — max 3 children ---------- */
  const addChild = async (childData: Partial<ChildData>) => {
    if (!user) return;
    if (childrenList.length >= 3) throw new Error("Maximum 3 children allowed");
    try {
      const userRef = doc(db, "users", user.uid);
      const newChild: ChildData = {
        id: `child_${Date.now()}`,
        childName: childData.childName || "My Child",
        avatar: childData.avatar || "/SCreen/cute.png",
        age: childData.age || "7 Years",
        mood: "Calm",
        progress: { ...defaultProgress },
      };
      const updated = [...childrenList, newChild];
      await setDoc(userRef, { children: updated }, { merge: true });
      setChildrenList(updated);
    } catch (err: any) {
      console.error("Add Child Error:", err.message);
      throw err;
    }
  };

  /* ---------- switchChild ---------- */
  const switchChild = async (index: number) => {
    if (!user || index >= childrenList.length) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { activeChildIndex: index }, { merge: true });
      setActiveChildIndex(index);
    } catch (err: any) {
      console.error("Switch Child Error:", err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData: activeChild,
        parentData,
        activeChildIndex,
        childrenList,
        loading,
        updateUserData,
        addChild,
        switchChild,
      }}
    >
      {reactChildren}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
