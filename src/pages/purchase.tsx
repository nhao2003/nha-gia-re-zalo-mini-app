import React, { useEffect, useState } from "react";
import { Box, Button, List, Page, Radio, Text, useSnackbar } from "zmp-ui";
import { formatNumberWithCommas } from "../utils/format_money";
import { useLocation, useNavigate } from "react-router-dom";
import User from "../types/user";
import MembershipPackage from "../types/membership-packages";
import { Payment } from "zmp-sdk";
import AppConfig from "../constant/app_configs";
import { events, EventName } from "zmp-sdk/apis";
interface PurchaseItem {
  title: string;
  price: number;
  numOfMonth: number;
}

interface PurchaseItemProps {
  item: PurchaseItem;
  isCheck: boolean;
  onClick: (item: number) => void;
}

const ListItem: React.FunctionComponent<PurchaseItemProps> = ({
  item,
  isCheck,
  onClick,
}) => {
  const handleItemClick = () => {
    onClick(item.numOfMonth);
  };

  return (
    <Box
      flexDirection="row"
      p={2}
      my={3}
      style={{
        border: "1px solid #026D4D",
        borderRadius: 8,
      }}
      onClick={handleItemClick}
    >
      <Radio name="radio" checked={isCheck} onChange={handleItemClick} />
      <Box>
        <Text.Title style={{ color: "#026D4D" }}>
          {`Gói ${item.numOfMonth} tháng`}
        </Text.Title>
        <Text>{formatNumberWithCommas(item.numOfMonth * item.price)} VND</Text>
      </Box>
    </Box>
  );
};

const PurchasePage: React.FC = () => {
  const [selectedNumOfMonth, setSelectedNumOfMonth] = useState<number | null>(
    null
  );
  const location = useLocation();
  const memberShipPackage = location.state.package as MembershipPackage;
  const user = location.state.user as User;
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  events.on(EventName.OpenApp, (data) => {
    const params = data?.path;
    console.log("RedirectPath", params);
    console.log("Data: ", data);
    if (params.includes("/result")) {
      Payment.checkTransaction({
        data: params,
        success: (rs) => {
          if (rs.resultCode !== 0) {
            const { orderId } = rs;
            navigate("/result/" + orderId.toString());
          }
        },
        fail: (err) => {},
      });
    }
  });
  const handlePayment = async () => {
    if (selectedNumOfMonth) {


      try {
        const response = await fetch(
          `${AppConfig.API_URL}/api/v1/membership-package/create-mini-app-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              package_id: memberShipPackage.id,
              num_of_subscription_month: selectedNumOfMonth,
              user_id: user.id,
            }),
          }
        );

        const data = await response.json();
        const result = data.result;
        if (data.status === "error" || data.status === "fail") {
          snackbar.openSnackbar({
            duration: 3000,
            text: "Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau.",
            type: "error",
          });
          setLoading(false);
          return;
        }
        await Payment.createOrder({
          desc: result.desc,
          item: result.item,
          amount: result.amount,
          extradata: user.id,
          success(res) {
            console.log("RES: ", res);
            fetch(
              `${AppConfig.API_URL}/api/v1/membership-package/mini-app-update-payment-status`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  order_id: res.orderId,
                  transaction_id: result.transaction_id,
                }),
              }
            )
              .then((res) => {
                console.log("RES2: ", res);
              })
              .catch((err) => {
                snackbar.openSnackbar({
                  duration: 3000,
                  text: "Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau.",
                  type: "error",
                });
              });
          },
          fail: (err) => {
            snackbar.openSnackbar({
              duration: 3000,
              text: "Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau.",
              type: "error",
            });
          },
        });
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
  };

  return (
    <Page>
      <Box m={3}>
        <div className="section-container">
          <Text.Title
            size="xLarge"
            style={{ color: "#026D4D", marginRight: 4 }}
          >
            Thông tin khách hàng
          </Text.Title>
          <Box my={1} flexDirection="row" justifyContent="space-between">
            <Text bold>Họ và tên</Text>
            <Text>{`${user.first_name} ${user.last_name}`}</Text>
          </Box>
          <Box my={1} flexDirection="row" justifyContent="space-between">
            <Text bold>Email</Text>
            <Text>{user.email}</Text>
          </Box>
          <Box my={1} flexDirection="row" justifyContent="space-between">
            <Text bold>Số điện thoại</Text>
            <Text>{user.phone}</Text>
          </Box>
        </div>
        <div className="section-container">
          <Text.Title
            size="xLarge"
            style={{ color: "#026D4D", marginRight: 4 }}
          >
            Đăng ký {memberShipPackage.name}
          </Text.Title>
          <List>
            {[1, 3, 6, 12].map((item, index) => (
              <ListItem
                key={index}
                item={{
                  title: `Gói ${item} tháng`,
                  price: 100000,
                  numOfMonth: item,
                }}
                isCheck={item === selectedNumOfMonth}
                onClick={setSelectedNumOfMonth}
              />
            ))}
          </List>
        </div>
        <div className="section-container">
          <Text.Title
            size="xLarge"
            style={{ color: "#026D4D", marginRight: 4 }}
          >
            Thông tin thanh toán
          </Text.Title>
          <Box my={1} flexDirection="row" justifyContent="space-between">
            <Text>Giá tiền</Text>
            <Text bold>
              {selectedNumOfMonth
                ? formatNumberWithCommas(
                    selectedNumOfMonth * memberShipPackage.price_per_month
                  )
                : 0}{" "}
              VND
            </Text>
          </Box>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            <Text>Tổng cộng</Text>
            <Text.Title size="xLarge" style={{ color: "#026D4D" }}>
              {selectedNumOfMonth
                ? formatNumberWithCommas(
                    selectedNumOfMonth * memberShipPackage.price_per_month
                  )
                : 0}{" "}
              VND
            </Text.Title>
          </Box>
          <Box>
            <Button
              loading={loading}
              disabled={loading || !selectedNumOfMonth}
              fullWidth
              className={
                loading || !selectedNumOfMonth
                  ? "button-disabled"
                  : "button-normal"
              }
              onClick={handlePayment}
            >
              Thanh toán
            </Button>
          </Box>
        </div>
      </Box>
    </Page>
  );
};

export default PurchasePage;
