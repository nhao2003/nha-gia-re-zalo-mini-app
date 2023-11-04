import React from "react";
import { Box, Button, List, Text } from "zmp-ui";
import { formatNumberWithCommasK } from "../utils/format_money";
import checkCircle from "../../assets-src/icons/check-circle.svg";
import xCircle from "../../assets-src/icons/x-circle.svg";
import packageIcon from "../../assets-src/icons/package-icon.svg";
import MembershipPackage from "../types/membership-packages";
interface ListItemProps {
  title: string;
  is_check: boolean;
}
const ListItem: React.FunctionComponent<ListItemProps> = (props) => {
  return (
    <Box flexDirection="row" py={1}>
      <img
        src={
          props.is_check
            ?checkCircle
            : xCircle
        }
        style={{
          marginRight: 8,
        }}
      />
      <Text>{props.title}</Text>
    </Box>
  );
};

interface PackageCardProps {
  package: MembershipPackage;
  onClick: (id: string) => void;
}

const PackageCard: React.FunctionComponent<PackageCardProps> = (props) => {
  return (
    <div className="section-container">
      <Box flexDirection="column">
        <Box flexDirection="row" py={1}>
          <img src={packageIcon} />
          <Box flexDirection="column" pl={1} justifyContent="space-between">
            <Text.Title
              style={{
                color: "#026D4D",
              }}
              size="xLarge"
            >
              {props.package.name}
            </Text.Title>
            <Box flexDirection="row" alignContent="flex-end">
              <Text.Title
                size="xLarge"
                style={{
                  color: "#026D4D",
                  marginRight: 4,
                }}
              >
                {formatNumberWithCommasK(props.package.price_per_month)}
              </Text.Title>
              <Text
                style={{
                  color: "#026D4D",
                }}
                bold
              >
                VND/Tháng
              </Text>
            </Box>
          </Box>
        </Box>
        <Text>{props.package.description}</Text>
        <List>
          <ListItem
            title={`${props.package.monthy_post_limit} tin đăng/tháng (Hiển thị 14 ngày)`}
            is_check={props.package.monthy_post_limit !== 0}
          />
          <ListItem title="Huy hiệu xác minh" is_check={true} />
          <ListItem
            title="Ưu tiên hiển thị tin đăng"
            is_check={props.package.display_priority_point !== 0}
          />
          <ListItem
            title="Duyệt tin siêu tốc"
            is_check={props.package.post_approval_priority_point !== 0}
          />
        </List>
        <Box mt={3}>
          <Button
            fullWidth
            onClick={() => {
              props.onClick(props.package.id);
            }}
          >
            Mua ngay
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default PackageCard;
