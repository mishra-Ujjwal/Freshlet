import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const SearchPage = () => {
  const allProduct = useSelector((state) => state.product.product);
  const location = useLocation();

  // Extract query string
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  // Filter products
  const filteredProducts =
    allProduct.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    ) || "";

  return (
    <div className="p-4">
      {query ? (
        <>
          <h2 className="text-lg font-semibold mb-4">
            Search results for: <span className="text-green-600">{query}</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredProducts.length > 0
              ? filteredProducts.map((product) => (
                  <div key={product._id} className="border p-3 rounded shadow">
                    <img
                      src={product.images}
                      alt={product.name}
                      className="w-full h-32 object-contain mb-2"
                    />
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600">₹{product.price}</p>
                  </div>
                ))
              : query && <p>No products found</p>}
          </div>
        </>
      ) : (
        <h2 className="text-3xl font-semibold mb-4">
          Start typing to search.....
        </h2>
      )}


    </div>
  );
};

export default SearchPage;
