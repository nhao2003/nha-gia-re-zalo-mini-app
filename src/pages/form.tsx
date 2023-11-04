import React, { useState } from "react";
import { Button, Input, Box, Page, useSnackbar, Text } from "zmp-ui";
import { useNavigate } from "react-router";
import { useLocation, useParams } from "react-router-dom";
import MembershipPackage from "../types/membership-packages";
import {
  UserWithSubscription,
  findUserWithSubscription,
} from "../api/findUserWithSubscription";

const FormPage: React.FunctionComponent = () => {
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const [email, setEmail] = useState("nhao@qa.team");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("0342841467");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const memberShipPackage = location.state.package as MembershipPackage;
  const validateInputs = () => {
    let isError = false;

    if (email === "") {
      setEmailError("Vui lòng nhập Email");
      isError = true;
    } else {
      setEmailError("");
    }

    if (phone === "") {
      setPhoneError("Vui lòng nhập số điện thoại");
      isError = true;
    } else {
      setPhoneError("");
    }

    return isError;
  };

  const handleAPICall = () => {
    setLoading(true);
    // navigate("/result/l");
    // return;
    if (!validateInputs()) {
      setLoading(true);
      findUserWithSubscription(email, phone)
        .then((res: UserWithSubscription) => {
          if (res.user && res.subscription) {
            snackbar.openSnackbar({
              duration: 3000,
              text: `Tài khoản ${res.user.first_name} ${res.user.last_name} đã đăng ký gói ${res.subscription.membership_package.name}. Bạn không thể đăng ký nhiều gói cùng lúc.`,
              type: "warning",
            });
          } else if (res.user === null) {
            snackbar.openSnackbar({
              duration: 3000,
              text: "Không tìm thấy tài khoản. Hãy đảm bảo bạn đã nhập đúng cả email và số điện thoại",
              type: "warning",
            });
          } else {
            snackbar.openSnackbar({
              duration: 3000,
              text: `Tìm thấy người dùng ${res.user!.first_name} ${
                res.user!.last_name
              }`,
              type: "success",
            });
            navigate("/purchase", {
              state: {
                user: res.user,
                package: memberShipPackage,
              },
            });
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          snackbar.openSnackbar({
            duration: 3000,
            text: "Đã có lỗi xảy ra, vui lòng thử lại sau",
            type: "error",
          });
          setLoading(false);
        });
    } else {
      snackbar.openSnackbar({
        duration: 3000,
        text: "Vui lòng điền đầy đủ thông tin",
        type: "error",
      });
    }
  };

  return (
    <Page className="page">
      <div className="section-container">
        <Text.Title>Điền thông tin</Text.Title>
        <Box mt={1}>
          <Input
            label="Email"
            type="text"
            placeholder="Vui lòng nhập Email"
            errorText={emailError}
            value={email}
            status={emailError ? "error" : "default"}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            label="Số điện thoại"
            type="text"
            placeholder="Vui lòng nhập số điện thoại"
            value={phone}
            status={phoneError ? "error" : "default"}
            errorText={phoneError}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Box mt={4}>
            <Button
              fullWidth
              variant="secondary"
              onClick={handleAPICall}
              loading={loading}
            >
              Tiếp tục
            </Button>
          </Box>
        </Box>
      </div>
    </Page>
  );
};

export default FormPage;
