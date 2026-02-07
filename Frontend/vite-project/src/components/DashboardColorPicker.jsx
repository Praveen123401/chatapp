import { useDashboardColorStore } from "../store/useDashboardColorStore";
import { Palette } from "lucide-react";
import "./DashboardColorPicker.css";

const DashboardColorPicker = () => {
  const { dashboardColor, setDashboardColor, colors } = useDashboardColorStore();

  const colorList = [
    { name: 'blue', emoji: '🔵' },
    { name: 'purple', emoji: '🟣' },
    { name: 'pink', emoji: '🌸' },
    { name: 'green', emoji: '🟢' },
    { name: 'orange', emoji: '🟠' },
    { name: 'red', emoji: '🔴' },
    { name: 'cyan', emoji: '🌊' },
  ];

  const handleColorChange = (colorName) => {
    setDashboardColor(colorName);
  };

  return (
    <div className="dashboard-color-picker">
      <button className="color-picker-trigger" title="Choose dashboard color">
        <Palette size={20} className="palette-icon" />
      </button>
      <div className="color-picker-menu">
        <div className="color-picker-title">Dashboard Colors</div>
        <div className="color-buttons-grid">
          {colorList.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorChange(color.name)}
              className={`color-btn ${dashboardColor === color.name ? 'active' : ''}`}
              title={`Switch to ${color.name} theme`}
              style={{
                background: colors?.[color.name]?.gradient || 'transparent',
              }}
            >
              <span className="color-emoji">{color.emoji}</span>
              <span className="color-name">{color.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardColorPicker;
