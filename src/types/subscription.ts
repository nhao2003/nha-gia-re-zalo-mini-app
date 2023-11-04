import MembershipPackage from "./membership-packages";

interface Subscription {
  id: string;
  user_id: string;
  package_id: string;
  transaction_id: string;
  starting_date: Date;
  expiration_date: Date;
  is_active: boolean;
  membership_package: MembershipPackage;
}
export default Subscription;
