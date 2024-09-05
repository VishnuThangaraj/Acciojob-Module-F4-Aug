import { useState, useEffect } from "react";
import "./App.css";
import { cryptoData as initialData } from "../crypt";
import Loader from "./components/Loader/Loader";
import axios from "axios";

export const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecdko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );
        if (response.status === 200) {
          setData(response.data);
        } else {
          setData(initialData);
        }
      } catch (error) {
        console.error("Failed to fetch data, using fallback data.", error);
        setData(initialData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredData = initialData.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(value) ||
        crypto.symbol.toLowerCase().includes(value)
    );
    setData(filteredData);
  };

  // Function to sort by market cap
  const sortByMarketCap = () => {
    const sortedData = [...data].sort((a, b) => b.market_cap - a.market_cap);
    setData(sortedData);
  };

  // Function to sort by price change percentage
  const sortByPercentageChange = () => {
    const sortedData = [...data].sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    );
    setData(sortedData);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="main p-4">
      <div className="top-holder my-flex-row">
        <div className="search-holder">
          <input
            id="search-box"
            className="shadow-box"
            type="text"
            placeholder="Search By Name or Symbol"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="btn-holder mt-2">
          <div className="btn btn-secondary me-4" onClick={sortByMarketCap}>
            Sort By Market Cap
          </div>
          <div className="btn btn-secondary" onClick={sortByPercentageChange}>
            Sort By Percentage
          </div>
        </div>
      </div>

      {/* Render the data as divs instead of table */}
      <div className="table-holder mt-5 mx-4 px-4">
        {data.map((crypto) => (
          <div
            key={crypto.id}
            className={`row my-3 shadow-box ${
              crypto.price_change_percentage_24h.toFixed(2) < 0
                ? "make-red"
                : "make-green"
            } glass-effect`}
          >
            <div className="cell flex items-center">
              <img src={crypto.image} alt={crypto.name} />
              {crypto.name}
            </div>
            <div className="cell">{crypto.symbol.toUpperCase()}</div>
            <div className="cell">${crypto.current_price.toLocaleString()}</div>
            <div className="cell">${crypto.total_volume.toLocaleString()}</div>
            <div className="cell">
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </div>
            <div className="cell">${crypto.market_cap.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
