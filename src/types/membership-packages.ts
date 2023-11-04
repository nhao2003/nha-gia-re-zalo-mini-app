type MembershipPackage = {
  id: string;
  name: string;
  description: string;
  price_per_month: number;
  monthy_post_limit: number;
  post_approval_priority_point: number;
  display_priority_point: number;
  created_at: string;
  is_active: boolean;
};
export default MembershipPackage;
