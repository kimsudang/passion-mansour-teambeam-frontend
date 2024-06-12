import { create } from "zustand";

interface IUserState {
  token: string | null;
  refreshToken: string | null;
  memberId: string | null;
  imgSrc: string | null;
  setUser: (
    token: string | null,
    refreshToken: string | null,
    memberId: string | null
  ) => void;
  setImgSrc: (imgSrc: string) => void;
}

const useUserStore = create<IUserState>()((set) => ({
  token: null,
  refreshToken: null,
  memberId: null,
  imgSrc: null,
  setUser: (token, refreshToken, memberId) =>
    set({ token, refreshToken, memberId }),
  setImgSrc: (imgSrc) => set({ imgSrc }),
}));

export default useUserStore;
