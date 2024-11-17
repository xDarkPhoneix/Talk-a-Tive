import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { ClassNames } from "@emotion/react";

function Layout() {
 
  return (
    <div className="h-screen bg-[url('./image.png')] bg-cover">
        <Outlet/>
    </div>
  );
}

export default Layout;
