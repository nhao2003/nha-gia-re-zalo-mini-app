import React, { useEffect, useState } from "react";
import { Page, useNavigate, Spinner, Box, Text, useSnackbar } from "zmp-ui";
import { login } from "zmp-sdk/apis";
import PackageCard from "../components/package_card";
import MembershipPackage from "../types/membership-packages";
import AppConfig from "../constant/app_configs";


const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [membershipPackages, setMembershipPackages] = useState<
    MembershipPackage[] | null
  >(null);
  const snackbar = useSnackbar();

  useEffect(() => {
    const fetchMembershipPackages = async () => {
      try {
        const response = await fetch(
          AppConfig.API_URL + "/api/v1/membership-package",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        const data = await response.json();
        setStatus("success");
        setMembershipPackages(data.result);
      } catch (error) {
        console.log("Lỗi API HOME: ", error);
        setStatus("error");
        setError("Đã có lỗi xảy ra, vui lòng thử lại sau");
      } finally {
        setIsLoading(false);
      }
    };

    const loginAsync = async () => {
      try {
        await login({});
        snackbar.openSnackbar({
          duration: 3000,
          text: "Đăng nhập thành công!",
          type: "success",
        });
      } catch (err: any) {
        console.log(err);
        snackbar.openSnackbar({
          duration: 3000,
          text: "Đăng nhập thất bại, vui lòng thử lại sau!",
          type: "error",
        });
      }
    };

    loginAsync();
    fetchMembershipPackages();
  }, []);

  return (
    <Page className="page">
      {isLoading ? (
        <div className="section-container">
          <div>Loading...</div>
        </div>
      ) : (
        <div className="section-container">
          <div>Home Page</div>
        </div>
      )}

      {error && (
        <div className="section-container">
          <div>{error}</div>
        </div>
      )}

      {status === "success" ? (
        <div className="section-container">
          {membershipPackages && membershipPackages.length > 0 ? (
            membershipPackages.map((item) => (
              <PackageCard
                key={item.id}
                package={item}
                onClick={(id) => {
                  // navigate(`/form/${id}`);
                  // Pass data to another page
                  navigate(`/form/${id}`, { state: { package: item } });
                }}
              />
            ))
          ) : (
            <div>No data available</div>
          )}
        </div>
      ) : status === "error" ? (
        <div className="section-container">
          <Text.Title>Đã có lỗi xảy ra. Vui lòng thử lại sau!</Text.Title>
        </div>
      ) : (
        <div className="section-container">
          <Box justifyContent="center" alignItems="center">
            <Spinner />
          </Box>
        </div>
      )}
    </Page>
  );
};

export default HomePage;
