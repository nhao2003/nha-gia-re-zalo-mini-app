import React, { useEffect } from "react";
import {
  ImageViewer,
  Page,
  Box,
  Text,
  List,
  Icon,
  Button,
  Header,
  useNavigate,
  useSnackbar,
} from "zmp-ui";
interface PurchaseItem {
  title: string;
  subtitle: string;
}
import purchasteSuccess from "../../assets-src/ilustrations/purchase-success.svg";
import purchasteFail from "../../assets-src/ilustrations/purchase-fail.svg";
import { useLocation, useParams } from "react-router-dom";
import { Payment } from "zmp-sdk";
import User from "../types/user";
import { findUserWithSubscription } from "../api/findUserWithSubscription";
import getTransaction from "../api/getTransaction";
import Transaction from "../types/transaction";
import { formatNumberWithCommas } from "../utils/format_money";

const ListTitle: React.FC<PurchaseItem> = (props) => {
  return (
    <Box flexDirection="row" alignItems="flex-start" p={1}>
      <div
        style={{
          width: "40%",
        }}
      >
        <Text>{props.title}</Text>
      </div>
      <div
        style={{
          width: "60%",
        }}
      >
        <Text bold>{props.subtitle}</Text>
      </div>
    </Box>
  );
};

const PurchaseResultPage: React.FC = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const [transaction, setTransaction] = React.useState<Transaction | null>(
    null
  );
  const snackbar = useSnackbar();
  useEffect(() => {
    setIsLoading(true);
    console.log("IDDD:  ", id);
    getTransaction(id as string)
      .then((res) => {
        console.log(res);
        setTransaction(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setTransaction(null);
        snackbar.openSnackbar({
          duration: 3000,
          text: "Đã có lỗi xảy ra. Vui lòng thử lại sau",
          type: "warning",
        });
        setIsLoading(false);
      });
  }, []);

  return isLoading ? (
    <Page>
      <Text>Loading</Text>
    </Page>
  ) : (
    <Page>
      <Box m={3}>
        <Box
          justifyContent="center"
          alignItems="center"
          flex
          flexDirection="column"
        >
          <img
            src={
              transaction?.status === "success"
                ? purchasteSuccess
                : purchasteFail
            }
          />
          <Box mt={3}>
            <Text.Title size="xLarge" style={{ color: "#026D4D" }}>
              {transaction?.status === "success"
                ? "Giao dịch thành công"
                : "Giao dịch không thành công"}
            </Text.Title>
          </Box>
          <Box m={3}>
            <Text.Title
              size="xLarge"
              style={{
                color:
                  transaction?.status === "success" ? "#026D4D" : "#D00000",
              }}
            >
              {formatNumberWithCommas(Number(transaction?.amount || 0)) +
                " VNĐ"}
            </Text.Title>
          </Box>
        </Box>
        <Box className="section-container">
          <ListTitle
            title="Tên khách hàng"
            subtitle={
              transaction?.user.first_name + " " + transaction?.user.last_name
            }
          />
          <ListTitle title="Email" subtitle={transaction?.user.email || ""} />
          <ListTitle
            title="Số điện thoại"
            subtitle={transaction?.user.phone || ""}
          />

          <ListTitle title="Mã giao dịch" subtitle={transaction?.id || ""} />
          <ListTitle
            title="Mô tả"
            subtitle={`Mua gói dịch vụ ${transaction?.num_of_subscription_month} tháng`}
          />
          <ListTitle
            title="Ngày bắt đầu"
            subtitle={transaction?.subscription.starting_date.toString() || ""}
          />
          <ListTitle
            title="Ngày kết thúc"
            subtitle={
              transaction?.subscription.expiration_date.toString() || ""
            }
          />
          <ListTitle
            title="Giá tiền"
            subtitle={
              formatNumberWithCommas(Number(transaction?.amount || 0)) + " VNĐ"
            }
          />
          <ListTitle title="Giá giảm" subtitle="0 VND" />
          <ListTitle
            title="Tổng"
            subtitle={
              formatNumberWithCommas(Number(transaction?.amount || 0)) + " VNĐ"
            }
          />
        </Box>
        <Button
          fullWidth
          onClick={() => {
            navigate("/", { replace: true });
          }}
        >
          Trở về trang chủ
        </Button>
        <Box flexDirection="row" mt={3}>
          <Icon icon="zi-info-circle" />
          <Text>
            Bạn có thể xem lại giao dịch trong lịch sử giao dịch. Nếu cần giúp
            đỡ có thể liên hệ qua 0987654321 hoặc abc@abc.com
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default PurchaseResultPage;
