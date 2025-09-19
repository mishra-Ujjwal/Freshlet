import React from "react";

const Footer = () => {
  return (
    <footer className="min-h-30 border-t-1 mt-3 text-2xl text-center">
      <div className="container p-5 ">
        <h2>&copy; All Rights Reserved 2025.</h2>
        <div className="socialmedia-icon flex items-center justify-center pt-3 gap-x-1.5 text-2xl">
          <i className="fa-brands fa-facebook opacity-90 hover:opacity-100 cursor-pointer"></i>
          <i className="fa-solid fa-envelope opacity-90 hover:opacity-100 cursor-pointer"></i>
          <i className="fa-brands fa-linkedin opacity-90 hover:opacity-100 cursor-pointer"></i>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
