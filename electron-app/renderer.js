const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const result = document.getElementById("result");
const loading = document.getElementById("loading");
const img_preview = document.getElementById("preview");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) {
    return;
  }
  const imageURL = URL.createObjectURL(file);
  img_preview.src = imageURL;
  img_preview.style.display = "block";
});

uploadBtn.addEventListener("click", async () => {
  console.log("clicked");
  const file = fileInput.files[0];
  if (!file) {
    result.innerText = "No image uploaded";
    return;
  }

  loading.style.display = "block";

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
  loading.style.display = "none";
});
