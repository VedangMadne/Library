import React from "react";
import { FaSpinner } from "react-icons/fa";
import "./loader.scss";

function Loader() {
  return (
    <div className="spinner text__color">
      <h1>Sharda English School Library</h1>
      <FaSpinner className="loader-icon" />
    </div>
  );
}

export default Loader;
