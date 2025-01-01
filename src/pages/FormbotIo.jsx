import React, { useState, useEffect } from "react";

const FormbotIo = () => {
  const { fileId } = useParams();
  const [data, setData] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! How can I help you?", sender: "bot" },
  ]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/folders/${fileId}/form`
      );

      if (res.status === 200) {
        const formData = res.data.form;

        // Flatten and process arrays
        const processedData = Object.entries(formData)
          .filter(
            ([key]) =>
              ![
                "_id",
                "__v",
                "file",
                "user",
                "createdAt",
                "updatedAt",
              ].includes(key)
          )
          .flatMap(([key, value]) =>
            Array.isArray(value)
              ? value.map((item) => ({ key, value: item }))
              : [{ key, value }]
          );

        setData(processedData);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getPlaceholder = () => {
    const { key, value } = data[currentIndex] || {};
    if (key === "text" && value === "email") return "Enter your email";
    if (key === "number" && value === "phone") return "Enter your phone number";
    if (key === "button") return "Click or enter a button label";
    return value || "Enter text"; // Default placeholder
  };

  return (
    <div>
      <div className="formbot-container">
        <div className="chat-window">
          {chatMessages.map((message) =>
            message.image ? (
              <div key={message.id} className="chat-message bot">
                <img
                  src={message.image}
                  alt="Image"
                  style={{ maxWidth: "50%" }}
                />
              </div>
            ) : (
              <div
                key={message.id}
                className={`chat-message ${
                  message.sender === "bot" ? "bot" : "user"
                }`}
              >
                {message.text}
              </div>
            )
          )}
        </div>
        <div className="chat-input-container">
          <div className="chat-input">
            {currentIndex < data.length ? (
              <>
                {/* Render input field dynamically */}
                {data[currentIndex]?.key === "text" && (
                  <input
                    type="text"
                    value={userInput}
                    placeholder={getPlaceholder()}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                )}
                {data[currentIndex]?.key === "number" && (
                  <input
                    type="number"
                    value={userInput}
                    placeholder={getPlaceholder()}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                )}
                {data[currentIndex]?.key === "rating" && (
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        className={`rating-button ${
                          userInput === String(rating) ? "selected" : ""
                        }`}
                        onClick={() => setUserInput(String(rating))}
                        style={{
                          backgroundColor:
                            userInput === String(rating) ? "#ff8e21" : "",
                          borderRadius: "100%",
                        }}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                )}
                {/* Fallback for unrecognized input types */}
                {!["text", "number", "rating", "button"].includes(
                  data[currentIndex]?.key
                ) && (
                  <input
                    type="text"
                    value={userInput}
                    placeholder={
                      data[currentIndex]?.value || "Waiting for a valid input"
                    }
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                )}
              </>
            ) : (
              // End of form input
              <input
                type="text"
                value={userInput}
                placeholder="No more input expected"
                onChange={(e) => setUserInput(e.target.value)}
                disabled
              />
            )}
            <button
              onClick={handleSend}
              disabled={!userInput.trim() || currentIndex >= data.length}
            >
              <img className="imgs" src={send} alt="Send" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormbotIo;
