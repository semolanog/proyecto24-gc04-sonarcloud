import React, { useEffect } from "react";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import IndexHeader from "components/Headers/IndexHeader.js";

function Index() {

  useEffect(() => {
    document.title = "Home - Recommendations";
    document.body.classList.add("index");
    return function cleanup() {
      document.body.classList.remove("index");
    };
  }, []);



  return (
    <>
      <IndexNavbar />
      <IndexHeader />
      <div className="main">
      </div>
    </>
  );
}

export default Index;
