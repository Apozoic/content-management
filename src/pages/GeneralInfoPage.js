import React, { useState, useRef, useEffect } from "react";
import NonEditablePage from "./NonEditablePage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faGlobe,
  faEarthAmerica,
  faCity,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";
import "./GeneralInfoPage.css";

function GeneralInfoPage() {
  // Local state for variable values
  const [variables, setVariables] = useState({
    type: "",
    site: "",
    country: "",
    city: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const handleInputChange = (field, value) => {
    setVariables((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTypeSelect = (value) => {
    setVariables((prev) => ({
      ...prev,
      type: value,
    }));
    setIsTypeDropdownOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getIcon = (field) => {
    switch (field) {
      case "type":
        return faSchool;
      case "site":
        return faGlobe;
      case "country":
        return faEarthAmerica;
      case "city":
        return faCity;
      case "address":
        return faMapPin;
      default:
        return null;
    }
  };

  return (
    <NonEditablePage title="Общая информация" onEditClick={handleEditClick}>
      <div className={`modern-table-container ${isEditing ? "edit-mode" : ""}`}>
        <table className="modern-table">
          <tbody>
            {[
              { field: "type", label: "Тип" },
              { field: "site", label: "Сайт" },
              { field: "country", label: "Страна" },
              { field: "city", label: "Город" },
              { field: "address", label: "Адрес" },
            ].map((row) => (
              <tr key={row.field} className="modern-row">
                <td className="icon-cell">
                  <FontAwesomeIcon icon={getIcon(row.field)} />
                </td>
                <td className="label-cell">{row.label}</td>
                <td className="divider"></td>
                <td className="value-cell">
                  {isEditing ? (
                    row.field === "type" ? (
                      <div
                        className="custom-dropdown-container"
                        ref={dropdownRef}
                      >
                        <div
                          className="dropdown-selected"
                          onClick={() =>
                            setIsTypeDropdownOpen(!isTypeDropdownOpen)
                          }
                        >
                          {variables.type || "Выберите тип"}
                          <span className="dropdown-arrow">▼</span>
                        </div>
                        {isTypeDropdownOpen && (
                          <div className="dropdown-options">
                            <div
                              className="dropdown-option"
                              onClick={() => handleTypeSelect("Школа")}
                            >
                              Школа
                            </div>
                            <div
                              className="dropdown-option"
                              onClick={() => handleTypeSelect("Университет")}
                            >
                              Университет
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={variables[row.field]}
                        placeholder={`Введите ${row.label.toLowerCase()}`}
                        onChange={(e) =>
                          handleInputChange(row.field, e.target.value)
                        }
                        className="custom-input"
                      />
                    )
                  ) : row.field === "site" && variables.site ? (
                    <a
                      href={variables[row.field]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="site-link"
                    >
                      {variables[row.field].length > 20
                        ? `${variables[row.field].slice(0, 20)}...`
                        : variables[row.field]}
                    </a>
                  ) : (
                    variables[row.field] || ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </NonEditablePage>
  );
}

export default GeneralInfoPage;
