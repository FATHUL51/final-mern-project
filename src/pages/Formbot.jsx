import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Formbot = () => {
  const { fileId } = useParams();
  const [formbot, setFormbot] = useState([]); // Entire form data
  const [messages, setMessages] = useState([]); // Chat messages
  const [input, setInput] = useState(""); // User input
  const [isBotTyping, setIsBotTyping] = useState(false); // Bot typing status
  const [bubbleQueue, setBubbleQueue] = useState([]); // Queue for bubble_text and images
  const [placeholderQueue, setPlaceholderQueue] = useState([]); // Queue for placeholders
  const [responses, setResponses] = useState({}); // Store user responses
  const [isChatComplete, setIsChatComplete] = useState(false); // Disable chat on completion
  const [currentPlaceholder, setCurrentPlaceholder] = useState(
    "Type your answer..."
  ); // Dynamic placeholder

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/folders/${fileId}/form`
      )
      .then((response) => {
        const form = response.data.form;

        // Extract bubble_text and images for the bot to show
        const bubbleTexts = form?.bubble_text || [];
        const images = form?.image || [];

        // Other data fields (email, number, etc.)
        const otherData = [
          { key: "text", value: form?.text?.[0] || "" },
          { key: "number", value: form?.number?.[0] || "" },
          { key: "email", value: form?.email?.[0] || "" },
          { key: "phone", value: form?.phone?.[0] || "" },
          { key: "date", value: form?.date?.[0] || "" },
          { key: "rating", value: form?.rating?.[0] || "" },
          { key: "button", value: form?.button?.[0] || "" },
        ].filter(({ value }) => value); // Filter out empty values

        // Combine bubble_text and images for the bubble queue
        const bubbles = [
          ...bubbleTexts.map((text) => ({
            type: "bubble_text",
            content: text,
          })),
          ...images.map((image) => ({ type: "image", content: image })),
        ];

        setFormbot(form); // Store raw form data for reference
        setBubbleQueue(bubbles); // Initialize bubble queue
        setPlaceholderQueue(otherData); // Initialize placeholder queue

        // Start chat with a welcome message and the first bubble
        if (bubbles.length > 0) {
          setMessages([
            { sender: "bot", text: "Welcome! Let's get started." },
            { sender: "bot", text: bubbles[0]?.content },
          ]);
        }

        // console.log("Bubble Queue:", bubbles);
        // console.log("Placeholder Queue:", otherData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [fileId]);

  const sendMessage = () => {
    if (input.trim() === "" || isChatComplete) return;

    // Add user's message to the chat
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    // Store the response with a specific key
    if (bubbleQueue.length > 0) {
      const currentBubble = bubbleQueue[0];
      setResponses((prev) => ({
        ...prev,
        [currentBubble.type]: [
          ...(prev[currentBubble.type] || []),
          { content: currentBubble.content, answer: input },
        ],
      }));
    } else if (placeholderQueue.length > 0) {
      const currentPlaceholder = placeholderQueue[0];
      setResponses((prev) => ({
        ...prev,
        [currentPlaceholder.key]: input,
      }));
    }

    setInput("");
    setIsBotTyping(true);

    setTimeout(() => {
      if (bubbleQueue.length > 1) {
        // Show the next bubble (text or image)
        const nextBubble = bubbleQueue[1];
        setBubbleQueue((prev) => prev.slice(1));

        if (nextBubble.type === "bubble_text") {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: nextBubble.content },
          ]);
        } else if (nextBubble.type === "image") {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "Here is an image:",
              image: nextBubble.content,
            },
          ]);
        }
      } else if (bubbleQueue.length === 1) {
        // If bubble queue is empty, switch to placeholders
        setBubbleQueue([]);
        if (placeholderQueue.length > 0) {
          const nextPlaceholder = placeholderQueue[0];
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: `Please provide your Other Details.`,
            },
          ]);
          setCurrentPlaceholder(nextPlaceholder.value);
        }
      } else if (placeholderQueue.length > 1) {
        // Move to the next placeholder
        setPlaceholderQueue((prev) => prev.slice(1));
        const nextPlaceholder = placeholderQueue[1];
        setCurrentPlaceholder(nextPlaceholder.value);
      } else {
        // End the chat
        const finalResponses = {
          ...responses,
          fileId,
          timestamp: new Date().toISOString(),
          status: "completed",
        };

        // console.log("Final Responses:", finalResponses);

        saveResponsesToFile(finalResponses);
        sendResponsesToBackend(finalResponses);

        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Thank you for completing the form!" },
        ]);
        setIsChatComplete(true); // Disable input and button
      }
      setIsBotTyping(false);
    }, 1500);
  };

  const saveResponsesToFile = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "responses.json";
    link.click();
  };

  const handleFormCompletion = () => {
    console.log("Raw responses object:", responses);

    // Transform `responses` into the required array format
    const responsesArray = Object.entries(responses).flatMap(
      ([title, values]) => {
        if (Array.isArray(values)) {
          // For arrays like bubble_text or image
          return values.map((item, index) => ({
            title, // Key name (e.g., bubble_text, image)
            question: item.content || title, // Question text
            message: item.answer, // User's response
            index, // Array index
          }));
        }

        // For single-value responses (e.g., email, number)
        return [
          {
            title,
            question: title, // Key name as question
            message: values, // User's response
            index: 0,
          },
        ];
      }
    );

    console.log("Transformed responses array:", responsesArray);

    // Send the transformed data to the backend
    sendResponsesToBackend(responsesArray);
  };

  const finalizeChat = () => {
    const finalResponses = {
      ...responses,
      fileId,
      timestamp: new Date().toISOString(),
      status: "completed",
    };

    const responsesArray = transformResponsesToArray(finalResponses);

    sendResponsesToBackend(responsesArray);
  };

  const transformResponsesToArray = (responses) => {
    return Object.entries(responses).flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((item) => ({
          title: key,
          content: item.content || key,
          answer: item.answer,
        }));
      } else {
        return {
          title: key,
          content: key,
          answer: value,
        };
      }
    });
  };

  const sendResponsesToBackend = async (data) => {
    try {
      console.log("Payload being sent to backend:", { replies: data });

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/Formbot/${fileId}`,
        { replies: data }
      );

      console.log("Data successfully sent to backend:", response.data);
    } catch (error) {
      console.error(
        "Error sending data to backend:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#daf8e3" : "#000",
            }}
          >
            {msg.text}
            {msg.image && (
              <img src={msg.image} alt="Form Image" style={styles.image} />
            )}
          </div>
        ))}
        {isBotTyping && (
          <div style={{ ...styles.message, alignSelf: "flex-start" }}>
            Bot is typing...
          </div>
        )}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={currentPlaceholder}
          style={styles.input}
          disabled={isChatComplete}
        />
        <button
          onClick={sendMessage}
          style={styles.button}
          disabled={isChatComplete}
        >
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
  },
  chatWindow: {
    width: "50%",
    height: "70%",
    overflowY: "scroll",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  message: {
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  image: {
    maxWidth: "100%",
    borderRadius: "10px",
    marginTop: "10px",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    width: "70%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Formbot;
