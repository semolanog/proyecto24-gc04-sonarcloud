/*!

=========================================================
* Paper Kit React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-kit-react

* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/paper-kit-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";


function IndexHeader() {
  return (
    <>
      <div
        className="page-header section-dark"
        style={{
          backgroundImage:
            "url(https://m.media-amazon.com/images/I/616QXs8yg0L.png)",
    
        }}
      >
        <div className="filter" />
        <div className="content-center">
          <Container>
            <h2 className="presentation-subtitle text-center"style={{ fontWeight: 'bold', color: 'lightgrey', marginTop: '600px'}}>
              Video streaming application
            </h2>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 'bold', color: 'lightgrey' }}>Designed and coded by:</p>
              <p style={{ fontWeight: 'bold', color: 'lightgrey' }}>Alberto Fernandez Palomo</p>
              <p style={{ fontWeight: 'bold', color: 'lightgrey' }}>Jorge Carmona Leo</p>
              <p style={{ fontWeight: 'bold', color: 'lightgrey' }}>Javier González Béjar</p>
              <p style={{ fontWeight: 'bold', color: 'lightgrey' }}>Sergio Molano Garcia</p>
            </div>
          </Container>
        </div>
        <div
          className="moving-clouds"
          style={{
            backgroundImage: "url(" + require("assets/img/clouds.png") + ")",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      </div>
    </>
  );
}

export default IndexHeader;
