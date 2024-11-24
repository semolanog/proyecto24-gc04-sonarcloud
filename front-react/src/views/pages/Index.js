
import React from "react";

import SectionLogin from "views/index-sections/SectionLogin.js";


function Index() {
  document.documentElement.classList.remove("nav-open");
  React.useEffect(() => {
    document.title = "Log in";
    document.body.classList.add("index");
    return function cleanup() {
      document.body.classList.remove("index");
    };
  });
  return (
    <>
      <div className="main">
        <SectionLogin />
      </div>
    </>
  );
}

export default Index;
