import { atom, selector } from "recoil";
import { getUserInfo } from "zmp-sdk";
import MembershipPackage from "./types/membership-packages";

export const userState = selector({
  key: "user",
  get: () =>
    getUserInfo({
      avatarType: "normal",
    }),
});

export const displayNameState = atom({
  key: "displayName",
  default: "",
});

type MembershipPackageResponse = {
  status: "success" | "error";
  message: string;
  data: Array<MembershipPackage>;
};
const API = "https://nha-gia-re-server.onrender.com";
// Fetch membership package from backend
// https://nha-gia-re-server.onrender.com/api/v1/membership-package
export const MembershipPackageState = selector({
  key: "membership-package",
  get: async (): Promise<MembershipPackageResponse> => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/membership-package"
      );
      const data = await response.json();
      return {
        status: "success",
        message: "",
        data: data.result,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
        data: [],
      };
    }
  },
});
