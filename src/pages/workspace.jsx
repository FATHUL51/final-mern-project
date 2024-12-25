import React from "react";
import "./Workspace.css";

const workspace = () => {
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
          <div className="flow">Flow</div>
          <div className="res">Response</div>
        </div>
        <div>ask</div>
        <div>ask</div>
      </div>
      <hr />
    </div>
  );
};

export default workspace;
