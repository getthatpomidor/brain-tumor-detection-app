import { useState, useEffect, useRef } from "react";

const SCAN_TYPES = ["mri", "ct"];

export default function App() {
  const [file, setFile] = useState(null);
  const [scanType, setScanType] = useState("mri");
  const [result, setResult] = useState(null); // { label, confidence }
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function selectScanType(type) {
    if (type === scanType) return;
    setScanType(type);
    setResult(null);
    setError("");
    setFile(null);
  }

  async function predict() {
    if (!file) {
      setError("No image uploaded");
      return;
    }
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `http://localhost:8000/predict/${scanType}`,
        {
          method: "POST",
          body: formData,
        },
      );
      if (!response.ok) {
        let message = response.statusText;
        try {
          const body = await response.json();
          message = body.detail ?? JSON.stringify(body);
        } catch {
          // Keep the HTTP status when the server does not return JSON.
        }
        throw new Error(`Prediction failed (${response.status}): ${message}`);
      }
      const data = await response.json();
      setResult({
        label: data.class,
        confidence: `${(data.confidence * 100).toFixed(2)}%`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown prediction error");
    } finally {
      setLoading(false);
    }
  }

  const isDicom = file?.name.toLowerCase().endsWith(".dcm");

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-name">OncoVision</span>
          <span className="brand-subtitle">
            AI-assisted tumor classification for MRI and CT images.
          </span>
        </div>
      </header>

      <div className="workspace">
        <div className="main-grid">
          <section className="preview-panel">
            <h2>File Preview</h2>

            <div className={`preview-box ${!file ? "empty" : ""}`}>
              {isDicom ? (
                <div className="dicom-placeholder">
                  <span className="dicom-mark">DICOM</span>
                  <span>Preview unavailable for this file type</span>
                </div>
              ) : previewUrl ? (
                <img
                  className="scan-image"
                  src={previewUrl}
                  alt="Selected scan"
                />
              ) : (
                <div className="empty-preview">
                  <p>Select a scan</p>
                  <span>Image or DICOM file</span>
                  <button
                    type="button"
                    className="browse-button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </button>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              className="file-input"
              type="file"
              accept="image/*,.dcm"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                setResult(null);
                setError("");
              }}
            />
          </section>

          <aside className="side-panel">
            <h3>Scan Type</h3>

            <div className="scan-tabs" role="group" aria-label="Scan type">
              {SCAN_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`scan-tab ${scanType === type ? "active" : ""}`}
                  aria-pressed={scanType === type}
                  onClick={() => selectScanType(type)}
                  disabled={loading}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="side-content">
              <div className="details-block">
                <h3>File details</h3>

                {file ? (
                  <div className="details-list">
                    <div className="details-row">
                      <span className="detail-label">Name</span>
                      <span className="detail-value" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                    <div className="details-row">
                      <span className="detail-label">Size</span>
                      <span className="detail-value">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div className="details-row">
                      <span className="detail-label">Type</span>
                      <span className="detail-value">
                        {scanType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="empty-detail">No file selected</p>
                )}
              </div>

              {result && (
                <div className="result-block">
                  <h3>Result</h3>
                  <p
                    className={`result-text ${result.label === "no tumor" ? "ok" : "alert"}`}
                  >
                    <span className="result-label">
                      {result.label.toUpperCase()}
                    </span>
                    <span className="result-confidence">
                      {result.confidence}
                    </span>
                  </p>
                </div>
              )}

              {error && (
                <p className="message error-message" role="alert">
                  {error}
                </p>
              )}
            </div>

            <button
              type="button"
              className="predict-button"
              onClick={predict}
              disabled={!file || loading}
            >
              {loading && <span className="spinner" aria-hidden="true" />}
              {loading ? "Predicting..." : "Predict"}
            </button>
          </aside>
        </div>
      </div>

      <footer className="app-footer">
        <div className="footer-disclaimer">
          <p>
            OncoVision is an AI-assisted tool intended to support medical image
            analysis. Its results are not a medical diagnosis and must not
            replace professional medical advice. All results require review and
            interpretation by a qualified healthcare professional.
          </p>
        </div>
      </footer>
    </main>
  );
}
