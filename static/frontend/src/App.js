import React, { useEffect, useState } from "react";
import { invoke, view } from "@forge/bridge";

function App() {
  const [config, setConfig] = useState({});
  const [isSettings, setIsSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const ctx = await view.getContext();
        console.log("CTX:", ctx);

        // SAFE context check
        if (ctx && ctx.extension && ctx.extension.type === "jira:projectSettingsPage") {
          setIsSettings(true);
        }

        const data = await invoke("getConfig");
        setConfig(data || {});
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // SAVE CONFIG
  const save = async () => {
    try {
      await invoke("saveConfig", config);
      alert("Saved successfully");
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving configuration");
    }
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div style={{ padding: "10px" }}>
        Loading...
      </div>
    );
  }

  // =========================
  // SETTINGS SCREEN (ADMIN)
  // =========================
  if (isSettings) {
    return (
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h2>🛡️ Project Data Classification</h2>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontWeight: "bold" }}>Classification</label><br />
          <input
            value={config?.classification || ""}
            onChange={(e) =>
              setConfig({ ...config, classification: e.target.value })
            }
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px"
            }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontWeight: "bold" }}>Message</label><br />
          <textarea
            value={config?.message || ""}
            onChange={(e) =>
              setConfig({ ...config, message: e.target.value })
            }
            style={{
              width: "100%",
              height: "80px",
              padding: "8px",
              marginTop: "4px"
            }}
          />
        </div>

        <button
          onClick={save}
          style={{
            backgroundColor: "#0052CC",
            color: "white",
            padding: "8px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Save Configuration
        </button>
      </div>
    );
  }

  // =========================
  // ISSUE PANEL (USER VIEW)
  // =========================
  return (
    <div style={{ padding: "10px", fontFamily: "Arial, sans-serif" }}>
      <h3 style={{ marginBottom: "10px" }}>
        🛡️ Project Data Classification
      </h3>

      <div
        style={{
          backgroundColor: "#FFF4E5",
          borderLeft: "4px solid #FFAB00",
          padding: "12px",
          borderRadius: "6px"
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "14px" }}>
          {config?.classification || "Not configured"}
        </div>

        <div style={{ marginTop: "4px", fontSize: "13px" }}>
          {config?.message || "No policy defined"}
        </div>
      </div>
    </div>
  );
}

export default App;
