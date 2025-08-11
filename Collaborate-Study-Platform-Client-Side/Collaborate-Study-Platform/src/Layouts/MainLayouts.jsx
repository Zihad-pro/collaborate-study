import React from "react";
import Navber from "../Pages/Shared/Navber/Navber";
import { Outlet } from "react-router";
import Footer from "../Pages/Shared/Footer/Footer";
import WhatsappLogo from "../Components/WhatsappLogo";

const MainLayouts = () => {
  return (
    <div className="font-Primary">
      <Navber></Navber>
      <Outlet></Outlet>
      <WhatsappLogo></WhatsappLogo>
      <Footer></Footer>
    </div>
  );
};

export default MainLayouts;
