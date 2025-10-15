import { useState } from "react";
import { HexColorPicker } from "react-colorful";

function ColorPicker() {
  const [colors, setColors] = useState({
    backgroundColor: "#f7f3f2",
    titleColor: "#000000",
    secondaryColor: "#d5c9c9",
  });

  const [activeField, setActiveField] = useState("backgroundColor");

  const handleColorChange = (field, value) => {
    if (/^#([0-9A-Fa-f]{0,6})$/.test(value)) {
      setColors((prev) => ({ ...prev, [field]: value }));
    }
  };
  return (
    <div className="d-flex align-items-start" style={{ gap: "2rem" }}>
      {/* Picker */}
      <HexColorPicker
        color={colors[activeField]}
        onChange={(newColor) =>
          setColors((prev) => ({ ...prev, [activeField]: newColor }))
        }
      />

      {/* Box dei colori con nomi a lato */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {Object.keys(colors).map((field) => (
          <div
            key={field}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {/* Box colore cliccabile */}
            <div
              onClick={() => setActiveField(field)}
              style={{
                width: "100px",
                height: "30px",
                cursor: "pointer",
                border:
                  activeField === field ? "2px solid #000" : "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: colors[field],
                color: "white",
                paddingLeft: "1em",
              }}
            >
              {colors[field]}
            </div>
            {/* Input HEX */}
            <input
              type="text"
              value={colors[field]}
              onChange={(e) => handleColorChange(field, e.target.value)}
              style={{ width: "80px" }}
            />
            {/* Nome leggibile */}
            <div style={{ minWidth: "120px" }}>
              <strong>{toReadableFormat(field)}</strong>
            </div>
          </div>
        ))}
        <div style={{fontSize:'0.6em'}}>
          <p>
          <i className="bi bi-info-circle me-2" />
            HEX format: #<span style={{color:'red'}}>rr</span><span style={{color:'green'}}>gg</span><span style={{color:'blue'}}>bb</span><br />
            where rr(red), gg(green) and bb(blue) are hexadecimal integers
            between 00 and ff, specifying the intensity of the color.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ColorPicker;

function toReadableFormat(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (match) => match.toUpperCase());
}
