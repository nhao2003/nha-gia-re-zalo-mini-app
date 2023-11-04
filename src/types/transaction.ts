import Subscription from "./subscription";
import User from "./user";

type Transaction = {
  id: string;
  user_id: string;
  discount_id: string | null;
  package_id: string;
  num_of_subscription_month: number;
  app_trans_id: string;
  status: "success" | "pending" | "failed"; // Thay các giá trị status bằng các giá trị thực tế
  timestamp: string;
  amount: string;
  user: User;
  subscription: Subscription;
};
export default Transaction;
