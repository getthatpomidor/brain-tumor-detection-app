const mriFileInput = document.getElementById("mriFileInput");
const mriUploadBtn = document.getElementById("mriUploadBtn");
const mriDialog = document.getElementById("mriUploadDialog");
const mriPredictBtn = document.getElementById("mriPredictBtn");
const mriPreview = document.getElementById("mriPreview");
const mriCloseBtn = document.getElementById("mriCloseBtn");

const ctFileInput = document.getElementById("ctFileInput");
const ctUploadBtn = document.getElementById("ctUploadBtn");
const ctDialog = document.getElementById("ctUploadDialog");
const ctPredictBtn = document.getElementById("ctPredictBtn");
const ctPreview = document.getElementById("ctPreview");
const ctCloseBtn = document.getElementById("ctCloseBtn");

const result = document.getElementById("result");
const loading = document.getElementById("loading");
const preview = document.getElementById("img_preview");

mriUploadBtn.addEventListener("click", () => {
  preview.style.display = "none";
  loading.style.display = "none";
  result.innerText = "";
  mriDialog.showModal();
});
ctUploadBtn.addEventListener("click", () => {
  preview.style.display = "none";
  loading.style.display = "none";
  result.innerText = "";

  ctDialog.showModal();
});

mriFileInput.addEventListener("change", () => {
  const file = mriFileInput.files[0];
  if (!file) {
    return;
  }
  const imageURL = URL.createObjectURL(file);
  mriPreview.src = imageURL;
  mriPreview.style.display = "block";

  preview.src = imageURL;
});

ctFileInput.addEventListener("change", () => {
  const file = ctFileInput.files[0];
  if (!file) {
    return;
  }
  const imageURL = URL.createObjectURL(file);
  ctPreview.src = imageURL;
  ctPreview.style.display = "block";

  preview.src = imageURL;
});

mriPredictBtn.addEventListener("click", async () => {
  const file = mriFileInput.files[0];
  if (!file) {
    result.innerText = "No image uploaded";
    return;
  }

  mriPreview.style.display = "none";
  mriDialog.close();

  loading.style.display = "block";
  preview.style.display = "block";

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/predict/mri", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    result.innerText = `Prediction: ${data.class} (${(data.confidence * 100).toFixed(2)}%)`;
  } catch (error) {
    result.innerText = "Error during prediction";
  }
  loading.style.display = "none";
});

ctPredictBtn.addEventListener("click", async () => {
  const file = ctFileInput.files[0];
  if (!file) {
    result.innerText = "No image uploaded";
    return;
  }

  ctPreview.style.display = "none";
  ctDialog.close();

  loading.style.display = "block";
  preview.style.display = "block";

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/predict/ct", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    result.innerText = `Prediction: ${data.class} (${(data.confidence * 100).toFixed(2)}%)`;
  } catch (error) {
    result.innerText = "Error during prediction";
  }
  loading.style.display = "none";
});

mriCloseBtn.addEventListener("click", () => {
  mriDialog.close();
});
ctCloseBtn.addEventListener("click", () => {
  ctDialog.close();
});
