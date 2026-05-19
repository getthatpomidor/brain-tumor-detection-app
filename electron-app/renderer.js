const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const result = document.getElementById("result");
const loading = document.getElementById("loading");

uploadBtn.addEventListener("click", async () => {
  console.log("clicked");
  const file = fileInput.files[0];
  if (!file) {
    result.innerText = "No image uploaded";
    return;
  }

  loading.style.display = "block";
  result.innerText = "";
  uploadBtn.disabled = true;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    });
    console.log("req sent");

    const data = await res.json();
    console.log("resp received");

    result.innerText = `Prediction: ${data.class} (${(data.confidence * 100).toFixed(2)}%)`;
  } catch (error) {
    result.innerText = "Error during prediction";
  }
  // 🔵 hide loading
  loading.style.display = "none";
  uploadBtn.disabled = false;
});
