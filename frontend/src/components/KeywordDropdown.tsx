import React, { useState, useRef, useEffect } from "react";
import "./KeywordDropdown.css";

interface KeywordOption {
  keyword: string;
  description: string;
}

interface KeywordDropdownProps {
  value: string;
  onSelect: (keyword: string, description: string) => void;
  onChange?: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  light?: boolean;
}

const PRESET_KEYWORDS: KeywordOption[] = [
  {
    keyword: "Current Work",
    description: "The current place where the person is employed",
  },
  {
    keyword: "Current Job",
    description: "The person's current workplace or employer",
  },
  {
    keyword: "Industry",
    description: "Professional sector or domain of expertise",
  },
  {
    keyword: "Professional Area",
    description: "Declared professional field",
  },
  {
    keyword: "Career Track",
    description: "Industry label provided by the individual",
  },
  {
    keyword: "Pet",
    description: "The animal the person prefers to keep as a pet",
  },
  {
    keyword: "Hobby",
    description: "An activity the person enjoys during free time",
  },
  {
    keyword: "Graduated From",
    description: "The university or institution the person graduated from",
  },
];

export const KeywordDropdown: React.FC<KeywordDropdownProps> = ({
  value,
  onSelect,
  onChange,
  onKeyPress,
  placeholder = "Add custom keywords",
  className = "",
  light = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
    setIsOpen(true);
  };

  const handleOptionSelect = (option: KeywordOption) => {
    setInputValue(option.keyword);
    onSelect(option.keyword, option.description);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsOpen(false);
      if (onKeyPress) {
        onKeyPress(e);
      }
    }
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const filteredOptions = PRESET_KEYWORDS.filter((option) =>
    option.keyword.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <div className="keyword-dropdown-container">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={`keyword-input ${className} ${light ? "light" : ""}`}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyPress}
      />

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`keyword-dropdown ${light ? "light" : ""}`}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                className={`dropdown-option ${light ? "light" : ""}`}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="option-keyword">{option.keyword}</div>
              </div>
            ))
          ) : (
            <div className={`dropdown-no-results ${light ? "light" : ""}`}>
              No matching options
            </div>
          )}
        </div>
      )}
    </div>
  );
};
