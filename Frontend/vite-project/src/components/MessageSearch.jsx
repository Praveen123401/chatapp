import { useState, useRef } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import "../styles/messageSearch.css";

const MessageSearch = ({ messages, onResultSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef(null);

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (term.trim() === "") {
      setResults([]);
      setShowResults(false);
      return;
    }

    const filtered = messages.filter((msg) =>
      msg.text?.toLowerCase().includes(term.toLowerCase())
    );

    setResults(filtered);
    setShowResults(filtered.length > 0);
    setSelectedIndex(0);
  };

  const handleResultClick = (message) => {
    onResultSelect(message);
    setSearchTerm("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="message-search">
      <div className="search-input-wrapper">
        <SearchIcon className="w-5 h-5" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchTerm && setShowResults(true)}
          className="search-input"
        />
        {searchTerm && (
          <button
            className="search-clear"
            onClick={() => {
              setSearchTerm("");
              setResults([]);
              setShowResults(false);
            }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="search-results">
          <div className="results-header">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </div>
          <div className="results-list">
            {results.map((msg, idx) => (
              <button
                key={msg._id}
                className={`result-item ${idx === selectedIndex ? "selected" : ""}`}
                onClick={() => handleResultClick(msg)}
              >
                <div className="result-text">
                  {msg.text.substring(0, 50)}
                  {msg.text.length > 50 ? "..." : ""}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageSearch;
