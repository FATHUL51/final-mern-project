import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import dotenv from "dotenv";
import "./Workspace.css";
import blue from "../assets/loginAssets/1toggle.svg";
import blue1 from "../assets/loginAssets/Toggle.svg";
import closed from "../assets/loginAssets/close.svg";
import message from "../assets/bubbles/Vector (2).svg";
import photo from "../assets/bubbles/SVG (3).svg";
import video from "../assets/bubbles/SVG (4).svg";
import GIF from "../assets/bubbles/gif.svg";
import text from "../assets/bubbles/text.svg";
import phone from "../assets/bubbles/phone.svg";
import number from "../assets/bubbles/number.svg";
import email from "../assets/bubbles/email.svg";
import date from "../assets/bubbles/date.svg";
import rating from "../assets/bubbles/rating.svg";
import button from "../assets/bubbles/button.svg";
import flag from "../assets/bubbles/Vector (1).svg";
import deletes from "../assets/delete.svg";

const workspace = () => {
  const { fileId } = useParams(); // Extract fileId from the route
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selected, setSelected] = useState("flow");
  const [close, setClose] = useState(false);
  const [addedComponents, setAddedComponents] = useState([]);
  const [data, setData] = useState({
    formname: "",
    bubble_text: "",
    text: "",
    image: "",
    number: "",
    email: "",
    phone: "",
    rating: "",
    date: "",
    button: "",
  });
  const [fileData, setFileData] = useState(null);

  const handleComponentClick = (componentName) => {
    setAddedComponents((prev) => [
      ...prev,
      { name: componentName, id: Date.now(), value: "", error: false },
    ]); // Add component with unique ID and validation state
  };

  const handleDeleteComponent = (id) => {
    setAddedComponents((prev) => prev.filter((comp) => comp.id !== id));
  };

  const handleInputChange = (id, value) => {
    // console.log(`Input Change: ID=${id}, Value=${value}`); // Log input changes
    setAddedComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, value, error: value.trim() === "" } : comp
      )
    );

    const updatedComponent = addedComponents.find((comp) => comp.id === id);
    if (updatedComponent) {
      setData((prevData) => ({
        ...prevData,
        [updatedComponent.name.toLowerCase()]: value,
      }));
      // console.log("Updated Data State:", {
      //   ...data,
      //   [updatedComponent.name.toLowerCase()]: value,
      // });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!fileId) {
      alert("File ID is missing.");
      return;
    }

    const isValid = addedComponents.every((comp) => {
      if (typeof comp.value !== "string") {
        console.error(`Invalid value for component:`, comp);
        return false;
      }
      return comp.value.trim() !== "";
    });

    if (!isValid) {
      alert("Please fill all required fields.");
      return;
    }

    // Build the data object with the file ID
    const formattedData = {
      file: fileId, // Include file ID
      formname: data.formname, // Add formname explicitly
    };

    // Add dynamically generated fields
    addedComponents.forEach((comp) => {
      formattedData[comp.name.toLowerCase()] = comp.value;
    });

    // console.log("Data being sent to backend:", formattedData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/folder/${fileId}/form`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Form created successfully!");
      }
    } catch (error) {
      console.error("Error creating form:", error);
      alert("Failed to create the form.");
    }
  };

  const handleBlur = (id, value) => {
    setAddedComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, error: value.trim() === "" } : comp
      )
    );
  };

  const handleClick = (type) => {
    setSelected(type); // Set the clicked div as selected
  };

  useEffect(() => {
    const resetState = () => {
      setData({
        formname: "",
        bubble_text: "",
        text: "",
        image: "",
        number: "",
        email: "",
        phone: "",
        rating: "",
        date: "",
        button: "",
      });
      setAddedComponents([]);
    };

    resetState();
    const fetchFileData = async () => {
      try {
        // Fetch form data from the backend
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/folders/${fileId}/form`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Extract the first form from the array
        const formData = response.data.form[0]; // Access the first element

        if (formData) {
          // Filter out unwanted keys
          const allowedKeys = Object.keys(formData).filter(
            (key) => !["_id", "__v", "file", "user"].includes(key)
          );

          // Set the `data` state with the filtered form data
          const filteredData = {};
          allowedKeys.forEach((key) => {
            filteredData[key] = formData[key] || "";
          });

          if (filteredData.date) {
            filteredData.date = new Date(filteredData.date)
              .toISOString()
              .split("T")[0];
          }

          setData(filteredData);

          // Generate `addedComponents` dynamically from the filtered data
          const components = allowedKeys.map((key) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the key
            id: Date.now() + Math.random(), // Unique ID
            value: formData[key],
            error: !formData[key], // Mark as error if empty
          }));

          setAddedComponents(components);
        } else {
          console.error("Form data is empty or undefined.");
        }
      } catch (error) {
        console.error("Error fetching file data:", error);
      }
    };

    fetchFileData();
  }, [fileId]);

  const handleclick = () => {
    setIsDark(!isDark);
    const homeElement = document.querySelector(".header");
    const hrdown = document.querySelector(".cona");
    const elem = document.querySelector(".hrcontainer");
    const inputss = document.querySelector(".inputs");
    const bubblesd = document.querySelectorAll(".content");
    const bubbles1 = document.querySelectorAll(".contents");
    const bubbles2 = document.querySelectorAll(".contents1");
    const inputs1 = document.querySelectorAll(".inputs11");

    if (homeElement) {
      if (isDark) {
        homeElement.style.backgroundColor = "#18181b";
        homeElement.style.color = "white";
      } else {
        homeElement.style.backgroundColor = "white";
        homeElement.style.color = "black";
      }
    } else {
      console.warn("Element with class 'home' not found.");
    }
    if (hrdown) {
      if (isDark) {
        hrdown.style.backgroundColor = "#282c34";
        hrdown.style.color = "white";
      } else {
        hrdown.style.backgroundColor = "white";
        hrdown.style.color = "black";
      }
    } else {
      console.warn("Element with class 'home' not found.");
    }

    if (inputss) {
      if (isDark) {
        inputss.style.backgroundColor = "#282c34";
        inputss.style.color = "white"; // You might want to change text color for visibility
      } else {
        inputss.style.backgroundColor = "transparent";
        inputss.style.border = "solid 1px #282c34";
        inputss.style.borderRadius = "0.4rem";
        inputss.style.color = "black";
      }
    } else {
      console.warn("Element with class 'inputs' not found.");
    }
    if (elem) {
      if (isDark) {
        elem.style.backgroundColor = "#18181b";
        elem.style.color = "white"; // You might want to change text color for visibility
      } else {
        elem.style.backgroundColor = "transparent";
        elem.style.border = "solid 1px #282c34";
        elem.style.borderRadius = "0.4rem";
        elem.style.color = "black";
      }
    } else {
      console.warn("Element with class 'inputs' not found.");
    }

    if (bubblesd) {
      bubblesd.forEach((bubble) => {
        if (isDark) {
          bubble.style.backgroundColor = "#282c34";
          bubble.style.color = "white";
        } else {
          bubble.style.backgroundColor = "transparent";
          bubble.style.color = "black";
          bubble.style.border = "solid 1px #282c34";
          bubble.style.borderRadius = "0.4rem";
        }
      });
    } else {
      console.warn("Elements with class 'content' not found.");
    }
    if (bubbles2) {
      bubbles2.forEach((bubble) => {
        if (isDark) {
          bubble.style.backgroundColor = "#18181b";
          bubble.style.color = "white";
        } else {
          bubble.style.backgroundColor = "transparent";
          bubble.style.color = "black";
          bubble.style.border = "solid 1px #282c34";
          bubble.style.borderRadius = "0.4rem";
        }
      });
    } else {
      console.warn("Elements with class 'content' not found.");
    }
    if (bubbles1) {
      bubbles1.forEach((bubble) => {
        if (isDark) {
          bubble.style.backgroundColor = "#18181b";
          bubble.style.color = "white";
        } else {
          bubble.style.backgroundColor = "transparent";
          bubble.style.color = "black";
          bubble.style.border = "solid 1px #282c34";
          bubble.style.borderRadius = "0.4rem";
        }
      });
    } else {
      console.warn("Elements with class 'content' not found.");
    }
    if (inputs1.length > 0) {
      inputs1.forEach((input) => {
        if (isDark) {
          input.style.backgroundColor = "#282c34";
          input.style.color = "white";
        } else {
          input.style.backgroundColor = "transparent";
          input.style.border = "solid 1px #282c34";
          input.style.borderRadius = "0.4rem";
          input.style.color = "black";
        }
      });
    } else {
      console.warn("Elements with class 'inputs11' not found.");
    }
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
    <div className="home">
      <div className="header">
        <div className="cont">
          <div className="inputtext">
            <input
              id="formname"
              value={data.formname || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                console.log("Formname Input Value:", newValue); // Debug log
                setData((prevData) => ({
                  ...prevData,
                  formname: newValue,
                }));
              }}
              className="inputs"
              type="text"
              placeholder={data.formname || "Enter Form Name"}
            />
          </div>
        </div>
        <div className="flowcont">
          <div
            className={`flow ${selected === "flow" ? "active" : ""}`}
            onClick={() => handleClick("flow")}
          >
            Flow
          </div>
          <div
            className={`res ${selected === "res" ? "active" : ""}`}
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
            <button
              className="btn"
              onClick={handleShare}
              disabled={!isSaved}
              style={{
                backgroundColor: isSaved ? "#1a5fff" : "#848890",
                cursor: isSaved ? "pointer" : "not-allowed",
                color: "white",
              }}
            >
              Share
            </button>
            <button className="btn1" onClick={handleSave}>
              Save
            </button>
          </div>
          <div
            className="close"
            onClick={() => {
              handleclose();
            }}
          >
            <img src={closed} alt="" />
          </div>
        </div>
      </div>
      <hr />
      <div className="cona">
        <div>
          <div className="hrcontainer">
            <div>
              <div className="bubblecont">Bubbles</div>
              <div className="bubbles">
                <div
                  className="content"
                  onClick={() => handleComponentClick("Bubble_text")}
                >
                  <img src={message} alt="" />
                  Text
                </div>
                <div
                  className="content"
                  onClick={() => handleComponentClick("Image")}
                >
                  <img src={photo} alt="" />
                  Image
                </div>
                <div className="content">
                  <img src={video} alt="" />
                  video
                </div>
                <div className="content">
                  <img className="gif" src={GIF} alt="" /> GIF
                </div>
              </div>
            </div>
            <div>
              <div className="bubblecont">Inputs</div>
              <div className="bubbles">
                <div
                  className="content"
                  onClick={() => handleComponentClick("Text")}
                >
                  <img src={text} alt="" />
                  Text
                </div>
                <div
                  className="content"
                  onClick={() => handleComponentClick("Number")}
                >
                  <img src={number} alt="" />
                  Number
                </div>
                <div
                  className="content"
                  onClick={() => handleComponentClick("Email")}
                >
                  <img src={email} alt="" />
                  Email
                </div>
                <div
                  className="content"
                  onClick={() => handleComponentClick("Phone")}
                >
                  <img src={phone} alt="" /> Phone
                </div>
                <div
                  className="content"
                  onClick={() => handleComponentClick("Date")}
                >
                  <img src={date} alt="" /> Date
                </div>
                <div
                  className="content"
                  onClick={() => handleComponentClick("Rating")}
                >
                  <img src={rating} alt="" /> Rating
                </div>
                <div
                  className="content"
                  onClick={() => handleComponentClick("Button")}
                >
                  <img src={button} alt="" /> Button
                </div>
              </div>
            </div>
          </div>
          <div className="allinputs">
            <div className="contents">
              <img src={flag} alt="" />
              Start
            </div>
            <div className="allinputs1">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1rem",
                }}
              >
                {addedComponents.map((comp) => {
                  const inputType = ["Image", "Button", "Bubble_text"].includes(
                    comp.name
                  )
                    ? "text"
                    : comp.name.toLowerCase();

                  return (
                    <div className="contents1" key={comp.id}>
                      <span>{comp.name}</span>
                      <input
                        className="inputs11"
                        type={inputType}
                        value={comp.value || ""}
                        placeholder={`Enter details for ${comp.name}`}
                        onChange={(e) =>
                          handleInputChange(comp.id, e.target.value)
                        }
                        onBlur={(e) => handleBlur(comp.id, e.target.value)}
                        style={{
                          borderColor: comp.error ? "red" : "#282c34",
                        }}
                      />
                      {comp.error && (
                        <p className="error-text">Required Field</p>
                      )}
                      <img
                        className="delete"
                        src={deletes} // Replace with the correct delete icon
                        alt="Delete"
                        onClick={() => handleDeleteComponent(comp.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default workspace;
