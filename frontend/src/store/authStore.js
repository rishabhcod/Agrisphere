import { create } from "zustand";

const STORAGE_KEY = "agrisphere_auth";

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

const stored = loadStored();

export const useAuthStore = create((set) => ({
  token: stored.token,
  user: stored.user, // { userId, fullName, email, role }

  login: (token, user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, user: null });
  },
}));
