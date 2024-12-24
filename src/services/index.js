export const settings = () => {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
