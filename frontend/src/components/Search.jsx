import { useState } from "react";
import { useProductStore } from "../stores/useProductStore";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchProducts = useProductStore((state) => state.searchProducts);
  const clearSearchResults = useProductStore((state) => state.clearSearchResults);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      clearSearchResults();
    } else {
      searchProducts(value);
    }
  };

  return (
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={handleChange}
      className="w-full md:w-auto px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
  );

};

export default Search;
