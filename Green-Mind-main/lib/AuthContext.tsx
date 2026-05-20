"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

/* ===========================
   Types
=========================== */
import { usePathname } from "next/navigation";

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
  usageTime?: number;
  isLocked?: boolean;
  lockedAt?: number;
}

export interface ChildData {
  id: string;
  childName: string;
  avatar: string;
  age: string;
  mood: string;
  moodMessageIndex?: number;
  moodVideoIndex?: number;
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
  usageTime: number;
  sessionStartTime: number | null;
  isLocked: boolean;
  lockedAt: number;
  unlockChild: () => Promise<void>;
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
  usageTime: 0,
  isLocked: false,
  lockedAt: 0,
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
  usageTime: 0,
  sessionStartTime: null,
  isLocked: false,
  lockedAt: 0,
  unlockChild: async () => {},
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

  // Timer & Lock states
  const [usageTime, setUsageTime] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockedAt, setLockedAt] = useState<number>(0);

  const activeChild = childrenList[activeChildIndex] ?? null;
  const pathname = usePathname() || "";

  const isChildRoute = (path: string) => {
    const childPaths = [
      "/dashboard",
      "/lessons",
      "/lesson-page",
      "/games",
      "/ai-scan",
      "/album",
      "/growth",
      "/quiz"
    ];
    return childPaths.some(p => path === p || path.startsWith(p + "/"));
  };

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
                moodMessageIndex: 0,
                moodVideoIndex: 0,
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

  /* ---------- Sync Lock State from Local Storage / Firestore ---------- */
  useEffect(() => {
    if (loading) return;
    if (!user || !activeChild) {
      setUsageTime(0);
      setSessionStartTime(null);
      setIsLocked(false);
      setLockedAt(0);
      return;
    }

    const key = `child_lock_${user.uid}_${activeChild.id}`;
    const localData = localStorage.getItem(key);
    let initialUsageTime = activeChild.progress?.usageTime || 0;
    let initialIsLocked = !!activeChild.progress?.isLocked;
    let initialLockedAt = activeChild.progress?.lockedAt || 0;

    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        initialUsageTime = parsed.usageTime !== undefined ? parsed.usageTime : initialUsageTime;
        initialIsLocked = parsed.isLocked !== undefined ? parsed.isLocked : initialIsLocked;
        initialLockedAt = parsed.lockedAt !== undefined ? parsed.lockedAt : initialLockedAt;
      } catch (e) {
        console.error("Error parsing local lock data:", e);
      }
    }

    // Check if 12-hour timeout passed
    if (initialIsLocked && initialLockedAt > 0) {
      const elapsed = Date.now() - initialLockedAt;
      if (elapsed >= 12 * 60 * 60 * 1000) {
        initialUsageTime = 0;
        initialIsLocked = false;
        initialLockedAt = 0;
        
        localStorage.setItem(key, JSON.stringify({ usageTime: 0, isLocked: false, lockedAt: 0 }));
        
        // Sync reset to Firestore
        const updated = [...childrenList];
        updated[activeChildIndex] = {
          ...updated[activeChildIndex],
          progress: {
            ...updated[activeChildIndex]?.progress,
            usageTime: 0,
            isLocked: false,
            lockedAt: 0
          }
        };
        const userRef = doc(db, "users", user.uid);
        setDoc(userRef, { children: updated }, { merge: true })
          .then(() => setChildrenList(updated))
          .catch(err => console.error("Error auto-unlocking in Firestore:", err));
      }
    }

    setUsageTime(initialUsageTime);
    setIsLocked(initialIsLocked);
    setLockedAt(initialLockedAt);

    // Persist Session Start Time in local storage per child
    const sessionKey = `session_start_${user.uid}_${activeChild.id}`;
    const localSessionStart = localStorage.getItem(sessionKey);
    if (localSessionStart) {
      setSessionStartTime(parseInt(localSessionStart));
    } else {
      const now = Date.now();
      setSessionStartTime(now);
      localStorage.setItem(sessionKey, now.toString());
    }
  }, [user?.uid, activeChild?.id, loading]);

  /* ---------- Timer Loop ---------- */
  useEffect(() => {
    if (loading || !user || !activeChild || isLocked) return;
    if (!isChildRoute(pathname)) return;

    const intervalId = setInterval(() => {
      // Pause if tab is inactive or document not focused
      if (document.hidden || !document.hasFocus()) {
        return;
      }

      setUsageTime((prev) => {
        const next = prev + 1;
        const key = `child_lock_${user.uid}_${activeChild.id}`;

        // Save to local storage
        localStorage.setItem(key, JSON.stringify({
          usageTime: next,
          isLocked: false,
          lockedAt: 0
        }));

        // Check if 1 hour limit is reached
        if (next >= 3600) {
          clearInterval(intervalId);
          setIsLocked(true);
          const lockTime = Date.now();
          setLockedAt(lockTime);

          const lockState = { usageTime: 3600, isLocked: true, lockedAt: lockTime };
          localStorage.setItem(key, JSON.stringify(lockState));

          updateUserData({
            progress: {
              ...activeChild.progress,
              usageTime: 3600,
              isLocked: true,
              lockedAt: lockTime
            }
          }).catch(err => console.error("Error locking child:", err));
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [user?.uid, activeChild?.id, isLocked, pathname, loading]);

  /* ---------- Periodic Sync to Firestore (every 30s) ---------- */
  useEffect(() => {
    if (loading || !user || !activeChild || isLocked) return;
    if (!isChildRoute(pathname)) return;

    const intervalId = setInterval(() => {
      updateUserData({
        progress: {
          ...activeChild.progress,
          usageTime: usageTime
        }
      }).catch(err => console.error("Error syncing usage time to Firestore:", err));
    }, 30000);

    return () => clearInterval(intervalId);
  }, [user?.uid, activeChild?.id, isLocked, pathname, usageTime, loading]);

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
        moodMessageIndex: 0,
        moodVideoIndex: 0,
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

  /* ---------- manual unlockChild ---------- */
  const unlockChild = async () => {
    if (!user || !activeChild) return;
    const key = `child_lock_${user.uid}_${activeChild.id}`;
    const sessionKey = `session_start_${user.uid}_${activeChild.id}`;
    const now = Date.now();

    localStorage.setItem(key, JSON.stringify({ usageTime: 0, isLocked: false, lockedAt: 0 }));
    localStorage.setItem(sessionKey, now.toString());

    setUsageTime(0);
    setSessionStartTime(now);
    setIsLocked(false);
    setLockedAt(0);

    await updateUserData({
      progress: {
        ...activeChild.progress,
        usageTime: 0,
        isLocked: false,
        lockedAt: 0
      }
    });
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
        usageTime,
        sessionStartTime,
        isLocked,
        lockedAt,
        unlockChild,
      }}
    >
      {reactChildren}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
