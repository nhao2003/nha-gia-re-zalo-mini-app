import React from "react";
import { Route, useNavigate } from "react-router-dom";
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";
import HomePage from "../pages";
import About from "../pages/about";
import Form from "../pages/form";
import User from "../pages/user";
import { SearchPage } from "../pages/search";
import PurchasePage from "../pages/purchase";
import PurchaseResultPage from "../pages/result";
import { Payment } from "zmp-sdk";

const MyApp = () => {
  return (
    <RecoilRoot>
      <App>
        <SnackbarProvider>
          <ZMPRouter>
            <AnimationRoutes>
              <Route path="/" element={<HomePage></HomePage>}></Route>
              <Route path="/about" element={<About></About>}></Route>
              <Route path="/form/:id" element={<Form></Form>}></Route>
              <Route path="/user" element={<User></User>}></Route>
              <Route path="/search" element={<SearchPage></SearchPage>}></Route>
              <Route
                path="/purchase"
                element={<PurchasePage></PurchasePage>}
              ></Route>
              <Route
                path="/result/:id"
                element={<PurchaseResultPage></PurchaseResultPage>}
              ></Route>
            </AnimationRoutes>
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};
export default MyApp;
