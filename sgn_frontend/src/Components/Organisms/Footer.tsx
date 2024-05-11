
import React from "react";


export default function Footer() {
  return (
    <div>
      {/* <!-- ======== 1.13. Footer section ======== --> */}
      <footer>
        <div className="container position-relative mt-32">
          <div className="row text-md-start text-sm-center text-center">
            <div className="col-lg-6 col-md-6">
              <a href="/" className="p-0">
                <img className="h-9"
                  src="logo.png" 
                  alt="logo" 
                />
              </a>
            </div>
            <div className="col-lg-3 col-md-3 position-relative mt-md-0 mt-sm-4 mt-4">
              <h4>Useful links</h4>
              <div className="d-flex gap-md-5 gap-sm-5 gap-5 mt-4 justify-content-md-start justify-content-sm-center justify-content-center">
                <div className="d-flex flex-column gap-4">
                  <a href="/" className="p-0">
                    Home
                  </a>
                  <a href="/about-us" className="p-0">
                    About
                  </a>
                </div>
                <div className="d-flex flex-column gap-4">
                  <a href="/contact-us" className="p-0">
                    Contact
                  </a>

                  <a href="/team" className="p-0">
                    Team
                  </a>
                </div>
              </div>
              <hr />
            </div>
            <div className="col-lg-3 col-md-3 ps-4 mt-md-0 mt-sm-4 mt-4 d-flex flex-column align-items-md-start align-items-sm-center align-items-start">
              <h4>Our Office</h4>
              <div className="d-flex align-items-center gap-3 mt-4">
                <i className="fa-sharp fa-solid fa-house"></i>
                <p className="p-0">Pk17, Douala Cameroun</p>
              </div>
              
              <div className="d-flex align-items-center gap-3 mt-4">
                <i className="fa-solid fa-envelope"></i>
                <p className="p-0">fmsp@univ_ud.com</p>
              </div>
            </div>
          </div>
          <hr className="mt-5" />
          {/* <!-- copyright text --> */}
          <div className="d-flex justify-content-md-between justify-content-sm-center justify-content-center flex-wrap  text-center mb-3 gap-3">
            <h6>
              Copyright © 2024 SGN. all rights reserved.
            </h6>
            <h6>Terms and conditions | privacy policy</h6>
          </div>
          <figure>
            <img
              src="assets/Images/bg/about_cercle1.png"
              alt="img"
              className="footer-cercle1"
            />
          </figure>
        </div>
      </footer>
      {/* <!-- ======== End of 1.13. Footer section ======== --> */}
    </div>
  );
}
