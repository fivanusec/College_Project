import React from "react";

let year = new Date();
const currentYear = year.getFullYear();

const Footer = () => {
  return (
    <>
      <footer className="footer">{currentYear} Filip Ivanusec</footer>
    </>
  );
};

export default Footer;
