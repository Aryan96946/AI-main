import React, { useState } from "react";
import api from "../../api";

export default function PredictionForm() {
  const [form, setForm] = useState({
    age: "",
    previous_qualification: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setResult(null);

    try {
      const res = await api.post("/predict", form);
      setResult(res.data);
    } catch (error) {
      setErr(error.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "350px", margin: "auto", fontFamily: "Arial" }}>
      <h2>Student Dropout Prediction</h2>

      <form onSubmit={submit}>
        <div style={{ marginBottom: "12px" }}>
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Enter age"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Previous Qualification</label>
          <input
            name="previous_qualification"
            value={form.previous_qualification}
            onChange={handleChange}
            placeholder="e.g. High School, Diploma"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {err && <p style={{ color: "red", marginTop: "12px" }}>{err}</p>}

      {result && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h3>
            Risk: {result.risk_tier} ({(result.probability * 100).toFixed(1)}%)
          </h3>

          <h4>Suggestions</h4>
          <ul>
            {result.suggestions?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h4>Top Factors</h4>
          <ul>
            {result.explanation?.map((e, i) => (
              <li key={i}>
                {e.feature}: {e.shap.toFixed(3)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
