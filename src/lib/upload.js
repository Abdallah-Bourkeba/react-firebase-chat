const upload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.url;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default upload;
