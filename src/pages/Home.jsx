import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";
import blue from "../assets/loginAssets/1toggle.svg";
import blue1 from "../assets/loginAssets/Toggle.svg";
import down from "../assets/loginAssets/Vector (1).svg";
import createlogo from "../assets/SVG (1).svg";
import delete1 from "../assets/delete.svg";
import plusicon from "../assets/SVG (2).svg";

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [isFolder, setIsFolder] = useState(false);
  const [isFolder1, setIsFolder1] = useState(false);
  const [deleteFilePopup, setDeleteFilePopup] = useState(null);
  const [deleteFolderPopup, setDeleteFolderPopup] = useState(null);
  const [foldername, setFoldername] = useState("");
  const [filename, setFilename] = useState("");
  const [fileGetname, setFileGetname] = useState([]);
  const [folderData, setFolderData] = useState([]);
  const [toggledown, setToggledown] = useState(false);

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
  const handlecreateclick = () => {
    setIsFolder((prev) => !prev);
  };
  const handlecreateclick1 = () => {
    setIsFolder1((prev) => !prev);
  };
  const submitform = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault(); // Prevent default only if e is provided
    }
    const foldernames = {
      foldername,
    };
    if (foldernames === "") {
      alert("please set a min 3 charecter name");
    }
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/folder`, // Ensure the API endpoint is correct
        { foldernames }, // Use the foldername directly from the state
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // Check for success status code
        console.log("Folder created successfully:", response.data.folder);
        fetchform(); // Refresh the folder list after creation
        alert("Folder created successfully");
        setIsFolder(false); // Close popup
        setFoldername(""); // Reset input field
      }
    } catch (error) {
      if (error.response) {
        // Handle server-side error responses
        alert(error.response.data.message || "Something went wrong!");
      } else if (error.request) {
        // Handle client-side or network errors
        alert("No response from the server. Please try again later.");
      } else {
        // Handle unexpected errors
        alert("An error occurred: " + error.message);
      }
    }
  };
  const submitform1 = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault(); // Prevent default only if e is provided
    }
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/folder/file`, // Ensure the API endpoint is correct
        { filename }, // Use the foldername directly from the state
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // Check for success status code
        fetchfile(); // Refresh the folder list after creation
        alert("file created successfully");
        setIsFolder1(false); // Close popup
        setFilename(""); // Reset input field
        window.location.reload;
      }
    } catch (error) {
      if (error.response) {
        // Handle server-side error responses
        alert(error.response.data.message || "Something went wrong!");
      } else if (error.request) {
        // Handle client-side or network errors
        alert("No response from the server. Please try again later.");
      } else {
        // Handle unexpected errors
        alert("An error occurred: " + error.message);
      }
    }
  };
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/setting`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setData(response.data.user);
    setLoading(false);
  };
  const fetchform = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/folders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setFolderData(response.data.folders);
  };

  const fetchfile = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/folders/file`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setFileGetname(response.data.file);
  };

  const deleteFolder = async (folderId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/folder/${folderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message); // Notify the user
      fetchform(); // Refresh the folder list
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert(error.response?.data?.message || "Failed to delete the folder.");
    }
  };
  const deleteFile = async (fileId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/file/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message); // Notify the user
      fetchfile(); // Refresh the file list
      window.location.reload;
    } catch (error) {
      console.error("Error deleting file:", error);
      alert(error.response?.data?.message || "Failed to delete the file.");
    }
  };
  const handleDeleteFolderPopup = (folderId) => {
    setDeleteFolderPopup(folderId); // Set the popup visibility for the specific folder
  };

  const closeDeleteFolderPopup = () => {
    setDeleteFolderPopup(null); // Close the popup
  };
  const handledeletefile = (fileId) => {
    setDeleteFilePopup(fileId); // Set the popup visibility for the specific file
  };

  const closeDeleteFilePopup = () => {
    setDeleteFilePopup(null); // Close the popup
  };
  const toogledown = () => {
    setToggledown((prev) => !prev);
  };

  useEffect(() => {
    fetchData();
    fetchform();
    fetchfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="home">
      <div className="container">
        <div className="profile">
          <div className="username">
            <span
              style={{ display: "flex", flexDirection: "row" }}
              onClick={() => {
                toogledown();
              }}
            >
              <p className="username1">{data.username}'s workspace</p>
              <div className="downmenu">
                <img className="down" src={down} alt="" />
              </div>
            </span>
            <div className={`logouconatiner ${toggledown ? "visible" : ""}`}>
              <div className="setting">Settings</div>
              <Link to="/User/Setting">
                <div className="logout">Logout</div>
              </Link>
            </div>
          </div>
        </div>
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
        <button className="btn">Share</button>
      </div>
      <hr />
      <div className="folder">
        <div className="foldersname">
          <p className="foldercreate" onClick={() => handlecreateclick()}>
            <img src={createlogo} className="createlogo" alt="" />
            Create a folder
          </p>
          <div className={`foldercreateform ${isFolder ? "visible" : ""}`}>
            <p className="foldersCreatetext">Create New Folders</p>
            <input
              type="text"
              value={foldername}
              onChange={(e) => {
                setFoldername(e.target.value);
              }}
              placeholder="Enter folder name"
              minLength={3}
            />
            <div>
              <button
                className="done"
                onClick={(e) => {
                  submitform(e);
                }}
              >
                Done
              </button>
              <button
                onClick={() => {
                  setIsFolder(false);
                }}
                className="cancel"
              >
                Cancel
              </button>
            </div>
          </div>
          {folderData.map((folder) => (
            <span key={folder._id} className="folder-item">
              <p className="folders" key={folder._id}>
                {folder.foldername}
                <img
                  className="delete1"
                  onClick={() => handleDeleteFolderPopup(folder._id)}
                  src={delete1}
                  alt="Delete"
                />
              </p>
              {deleteFolderPopup === folder._id && ( // Show popup only for the specific folder
                <div className="folderdeletefrom visible">
                  <p className="foldersCreatetext">
                    Are you sure you want to delete this folder?
                  </p>
                  <div>
                    <button
                      className="done"
                      onClick={() => {
                        deleteFolder(folder._id);
                        closeDeleteFolderPopup(); // Close popup after deletion
                      }}
                    >
                      Done
                    </button>
                    <button
                      className="cancel"
                      onClick={() => closeDeleteFolderPopup()}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </span>
          ))}
        </div>
        <div>
          <div className="typebot">
            <div className="typebotname" onClick={() => handlecreateclick1()}>
              <img src={plusicon} alt="" />
              <div className="typebottext">Create a typebot</div>
            </div>
            <div className={`filecreateform ${isFolder1 ? "visible" : ""}`}>
              <p className="foldersCreatetext">Create New Files</p>
              <input
                type="text"
                value={filename}
                onChange={(e) => {
                  setFilename(e.target.value);
                }}
                placeholder="Enter File name"
              />
              <div>
                <button
                  className="done"
                  onClick={(e) => {
                    submitform1(e);
                    console.log("Done clicked");
                  }}
                >
                  Done
                </button>
                <button
                  onClick={() => {
                    setIsFolder1(false);
                    console.log("cancel clicked");
                  }}
                  className="cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
            {fileGetname.map((item) => {
              return (
                <div key={item._id}>
                  <div className="formbotname">
                    <div className="formbottext">
                      <img
                        onClick={() => {
                          handledeletefile(item._id);
                        }}
                        src={delete1}
                        alt=""
                      />
                      <span className="formbottext">{item.filename}</span>
                      {deleteFilePopup === item._id && ( // Show popup only for the specific file
                        <div className="filedeleteform visible">
                          <p className="foldersCreatetext">
                            Are you sure you want to delete this file?
                          </p>
                          <div>
                            <button
                              className="done"
                              onClick={() => {
                                deleteFile(item._id);
                                closeDeleteFilePopup(); // Close popup after deletion
                              }}
                            >
                              Done
                            </button>
                            <button
                              onClick={() => {
                                closeDeleteFilePopup();
                              }}
                              className="cancel"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
