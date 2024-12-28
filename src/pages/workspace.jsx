import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Workspace.css";
import blue from "../assets/loginAssets/1toggle.svg";
import blue1 from "../assets/loginAssets/Toggle.svg";
import closed from "../assets/loginAssets/close.svg";

const workspace = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selected, setSelected] = useState("");
  const [close, setClose] = useState(false);

  const handleClick = (type) => {
    setSelected(type); // Set the clicked div as selected
  };

  const handleclick = () => {
    setIsDark(!isDark);
    const homeElement = document.querySelector(".home"); // Select the element
    if (isDark) {
      homeElement.style.backgroundColor = "black"; // Set background color
      homeElement.style.color = "white"; // Set text color
    } else {
      homeElement.style.backgroundColor = "white"; // Set background color
      homeElement.style.color = "black";
    }
  };
  const handleSave = () => {
    setIsSaved(true); // Enable the Share button after saving
    console.log("Data saved!");
  };

  const handleShare = () => {
    console.log("Data shared!");
  };
  const handleclose = () => {
    setClose(true);
    if (close == true) {
      navigate("/home");
    }
  };
  return (
    <div>
      <div className="header">
        <div className="cont">
          <div className="inputtext">
            <input
              className="inputs"
              type="text"
              placeholder="Enter Form Name"
            />
          </div>
        </div>
        <div className="flowcont">
          <div
            className={`flow ${selected === "flow" ? "selected" : ""}`}
            onClick={() => handleClick("flow")}
          >
            Flow
          </div>
          <div
            className={`res ${selected === "res" ? "selected" : ""}`}
            onClick={() => handleClick("res")}
          >
            Response
          </div>
        </div>
        <div className="buttonshare">
          <div className="t">
            <div className="toggle">
              <div className="light">Light</div>
              <button
                onClick={() => {
                  setIsToggled(!isToggled);
                  handleclick();
                }}
              >
                {isDark ? (
                  <img src={blue1} alt="blue" />
                ) : (
                  <img src={blue} alt="blue1" />
                )}
              </button>
              <div className="dark">Dark</div>
            </div>
          </div>
          <div className="savenshare">
            <button className="btn" onClick={handleSave}>
              Save
            </button>
            <button className="btn" onClick={handleShare} disabled={!isSaved}>
              Share
            </button>
          </div>
          <div className="close">
            <img
              src={closed}
              onClick={() => {
                handleclose();
              }}
              alt=""
            />
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default workspace;
