import { create } from "zustand";

interface IUserState {
  token: string | null;
  refreshToken: string | null;
  memberId: string | null;
  imgSrc: string | null;
  isSideBar: boolean;
  screenMode: string;
  setUser: (
    token: string | null,
    refreshToken: string | null,
    memberId: string | null
  ) => void;
  setImgSrc: (imgSrc: string) => void;
  clearUser: () => void; // 로그아웃 처리를 위한 함수 추가
  setIsSideBar: (isSideBar: boolean) => void;
  initializeSideBar: () => void; // 사이드바
  setScreenMode: (mode: string) => void;
  initializeScreenMode: () => void;
}

const useUserStore = create<IUserState>()((set) => ({
  token: null,
  refreshToken: null,
  memberId: null,
  imgSrc: null,
  isSideBar: true,
  screenMode: "light",
  setUser: (token, refreshToken, memberId) =>
    set({ token, refreshToken, memberId }),
  setImgSrc: (imgSrc) => set({ imgSrc }),
  clearUser: () =>
    set({ token: null, refreshToken: null, memberId: null, imgSrc: null }),
  setIsSideBar: (isSideBar) => {
    localStorage.setItem("isSidebar", JSON.stringify(isSideBar));
    set({ isSideBar });
  },
  initializeSideBar: () => {
    const storedIsSidebar = localStorage.getItem("isSidebar");
    if (storedIsSidebar !== null) {
      set({ isSideBar: JSON.parse(storedIsSidebar) });
    }
  },
  setScreenMode: (mode) => {
    localStorage.setItem("screenMode", mode);
    set({ screenMode: mode });
  },
  initializeScreenMode: () => {
    const storedScreenMode = localStorage.getItem("screenMode");
    if (storedScreenMode !== null) {
      set({ screenMode: storedScreenMode as "dark" | "light" });
    }
  },
}));

export default useUserStore;
