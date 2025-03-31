import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: true,

  fetchUserData: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ loading: false });
      return;
    }

    set({ loading: true });

    try {
      const response = await axios.post(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/findbodybytoken",
        { token }
      );

      if (response.data && response.data.data) {
        const userData = JSON.parse(response.data.data); // JSON 문자열을 객체로 변환
        localStorage.setItem("user", JSON.stringify(userData));
        set({ user: userData, loading: false });
      } else {
        console.error("유효하지 않은 응답 데이터:", response.data);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error("유저 정보를 불러오는 데 실패했습니다.", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ user: null, loading: false });
    }
  },

  setUser: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData });
  },
}));

useAuthStore.getState().fetchUserData();