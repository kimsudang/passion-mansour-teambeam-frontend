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
  clearUser: () => void; // 로그아웃 처리를 위한 함수 추가
}

const useUserStore = create<IUserState>()((set) => ({
  token: null,
  refreshToken: null,
  memberId: null,
  imgSrc: null,
  setUser: (token, refreshToken, memberId) =>
    set({ token, refreshToken, memberId }),
  setImgSrc: (imgSrc) => set({ imgSrc }),
  clearUser: () =>
    set({ token: null, refreshToken: null, memberId: null, imgSrc: null }),
}));

export default useUserStore;
