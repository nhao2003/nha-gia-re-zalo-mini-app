import AppConfig from "../constant/app_configs";
import Subscription from "../types/subscription";
import User from "../types/user";

export interface UserWithSubscription {
    user?: User | null;
    subscription?: Subscription | null;
  }
export const findUserWithSubscription = async (
    email: string,
    phone: string
  ): Promise<UserWithSubscription> => {
    console.log(email, phone);
    const Api_URL = `${AppConfig.API_URL}/api/v1/membership-package/user-with-subscription`;
    try {
      const urlSearchParams = new URLSearchParams({
        email,
        phone,
      });
      const res = await fetch(`${Api_URL}?${urlSearchParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      return {
        user: data.result.user,
        subscription: data.result.subscription,
      };
    } catch (error) {
      console.log(error);
      return {
        user: null,
        subscription: null,
      };
    }
  };