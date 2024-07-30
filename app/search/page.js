"use client";

import Image from "next/image";
import styles from "../page.module.css";
import { useState } from "react";
import { fetchAmazonProducts, fetchBestBuyProducts, fetchEbayProducts } from "../../lib/api";

export default function Home() {
  // React states for the search query.
  // There's one for the user's query, the 3 APIs/stores,
  // one for the "loading" status (if the products are still being retrieved from the API),
  // one for any error messages,
  // and one for storing the products that the user wants to compare more directly.
  const [query, setQuery] = useState("");
  const [ebayProducts, setEbayProducts] = useState([]);
  const [bestBuyProducts, setBestBuyProducts] = useState([]);
  const [amazonProducts, setAmazonProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // This function handles the search query
  const handleSearch = async (e) => {
    // Sets default values for the loading and error states
    e.preventDefault();
    setLoading(true);
    setError(null);

    // A touch of input validation. If the query is not null or whitespace or empty, make the API calls
    if (query != null && query != " " && query != "") {
      try {
        // Makes all 3 API calls, then stores the results into their respective states
        const ebayResults = await fetchEbayProducts(query.trim());
        const bestBuyResults = await fetchBestBuyProducts(query.trim());
        // const amazonResults = await fetchAmazonProducts(query.trim()); // Comment out this line to prevent Amazon searches
        setEbayProducts(ebayResults);
        setBestBuyProducts(bestBuyResults);
        // setAmazonProducts(amazonResults); // Comment out this line to prevent Amazon searches
      } catch (err) {
        // If the error is due to no products being returned, display a user-friendly message
        if(err.message == "Cannot read properties of undefined (reading 'map')") {
          setError("No products returned for your search '" + query + "', please try another one!");
        } else {
          setError(err.message); // Catch any other errors
        }
      } finally {
        setLoading(false); // Once the products are retrieved, stop displaying "Loading..."
      }
    } else {
      // Catch when there is just whitespace in the search query
      setError("Please enter a value in the search bar");
      setLoading(false);
    }
  };

  // Handles adding prodcuts to the "selectedProducts" array so that they can be compared more directly
  // by the user. This array can be thought of like a custom sublist that the user creates
  // from the results of the 3 APIs.
  // The product's URL is used as the key or ID.
  const toggleProductSelection = (product, source) => {
    // Checks if product has been added already
    const selectedIndex = selectedProducts.findIndex((p) => p.url === product.url);

    // If product is not in the array, add it. Otherwise, remove it.
    if (selectedIndex === -1) {
      setSelectedProducts([...selectedProducts, { ...product, source }]);
    } else {
      setSelectedProducts(selectedProducts.filter((p) => p.url !== product.url));
    }
  };

  // Function to scroll to a specific store's section when that store's button is clicked in the top left
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Renders page
  return (
    <main className={styles.main}>
      <div>
        <div className={styles.center}>
          <h1>Comparify</h1>
        </div>
        <div className={styles.searchContainer}>

          {/* Form to submit queries. This is the search bar */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products here!"
              className={styles.searchBar}
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>

        </div>

        {/* Display products
        If the products are still being retrieved. display "Loading..." 
        If there is an error message, display it
        Otherwise, once the products are all retrieved, display them in their own sections */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className={styles.productContainer}>
            <div id="eBaySection" className={styles.ebaySection}>
              <Image
                src="/ebayLogo.jpg"
                alt="eBay Logo"
                width={250}
                height={150}
              />
              <h2 className={styles.productHeading}>eBay Products</h2>
              {/* Each product retrieved from each retailer displays the product name, price, image,
              and has a URL linking directly to that product's web page on its respective retailer's site. */}
              {ebayProducts.map((product, index) => (
                <div key={index} className={`${styles.product} ${styles.ebayProduct}`}>
                  <h3><a href={product.url} target="_blank" rel="noopener noreferrer">{product.name}</a></h3>
                  <p>Price: {product.price}</p>
                  <img src={product.img} alt="ebay_product_img" className={styles.productImg} />
                  {/* Below button exists for each product retrieved from each retailer.
                  If clicked, adds this product to the "selectedProducts" array.
                  If clicked again, removes it from that array. */}
                  <button className={styles.addButton} onClick={() => toggleProductSelection(product, 'eBay')}>
                    {selectedProducts.some((p) => p.url === product.url && p.source === 'eBay')
                      ? 'Remove from Comparison'
                      : 'Add to Comparison'}
                  </button>
                </div>
              ))}
            </div>
            <div id="bestBuySection" className={styles.bestBuySection}>
              <Image
                src="/bestBuyLogo.jpg"
                alt="BestBuy Logo"
                width={250}
                height={150}
              />
              <h2 className={styles.productHeading}>BestBuy Products</h2>
              {bestBuyProducts.map((product, index) => (
                <div key={index} className={`${styles.product} ${styles.bestBuyProduct}`}>
                  <h3><a href={product.url} target="_blank" rel="noopener noreferrer">{product.name}</a></h3>
                  <p>Price: {product.price}</p>
                  <img src={product.img} alt="best_buy_product_img" className={styles.productImg} />
                  <button className={styles.addButton} onClick={() => toggleProductSelection(product, 'BestBuy')}>
                    {selectedProducts.some((p) => p.url === product.url && p.source === 'BestBuy')
                      ? 'Remove from Comparison'
                      : 'Add to Comparison'}
                  </button>
                </div>
              ))}
            </div>
            <div id="amazonSection" className={styles.amazonSection}>
              <Image
                src="/amazonLogo.png"
                alt="Amazon Logo"
                width={250}
                height={150}
              />
              <h2 className={styles.productHeading}>Amazon Products</h2>
              {amazonProducts.map((product, index) => (
                <div key={index} className={`${styles.product} ${styles.amazonProduct}`}>
                  <h3><a href={product.url}>{product.name}</a></h3>
                  <p>Price: {product.price}</p>
                  <img src={product.img} alt="amazon_product_img" className={styles.productImg} />
                  <button className={styles.addButton} onClick={() => toggleProductSelection(product, 'Amazon')}>
                    {selectedProducts.some((p) => p.url === product.url && p.source === 'Amazon')
                      ? 'Remove from Comparison'
                      : 'Add to Comparison'}
                  </button>
                </div>
              ))}
            </div>
            {/* Compare Section to show all the products that the user wants compared
            from the "selectedProducts" array. Separated by retailer. */}
            <div id="compareSection" className={styles.compareSection}>
              <h2 className={styles.productHeading}>Comparison</h2>
              <div className={styles.ebayCompare}>
                {selectedProducts.filter((product) => product.source === 'eBay').map((product, index) => (
                  <div key={index} className={`${styles.product} ${styles.compareProduct}`}>
                    <h3>
                      <a href={product.url} target="_blank" rel="noopener noreferrer">
                        {product.name}
                      </a>
                    </h3>
                    <p>Price: {product.price}</p>
                    <img src={product.img} alt="ebay_product_img" className={styles.productImg} />
                    <button className={styles.addButton} onClick={() => toggleProductSelection(product, 'eBay')}>
                    {selectedProducts.some((p) => p.url === product.url && p.source === 'eBay')
                      ? 'Remove from Comparison'
                      : 'Add to Comparison'}
                  </button>
                  </div>
                ))}
              </div>
              <div className={styles.bestBuyCompare}>
                {selectedProducts.filter((product) => product.source === 'BestBuy').map((product, index) => (
                  <div key={index} className={`${styles.product} ${styles.compareProduct}`}>
                    <h3>
                      <a href={product.url} target="_blank" rel="noopener noreferrer">
                        {product.name}
                      </a>
                    </h3>
                    <p>Price: {product.price}</p>
                    <img src={product.img} alt="best_buy_product_img" className={styles.productImg} />
                    <button className={styles.addButton} onClick={() => toggleProductSelection(product, 'BestBuy')}>
                    {selectedProducts.some((p) => p.url === product.url && p.source === 'BestBuy')
                      ? 'Remove from Comparison'
                      : 'Add to Comparison'}
                  </button>
                  </div>
                ))}
              </div>
              <div className={styles.amazonCompare}>
                {selectedProducts.filter((product) => product.source === 'Amazon').map((product, index) => (
                  <div key={index} className={`${styles.product} ${styles.compareProduct}`}>
                    <h3>
                      <a href={product.url} target="_blank" rel="noopener noreferrer">
                        {product.name}
                      </a>
                    </h3>
                    <p>Price: {product.price}</p>
                    <img src={product.img} alt="amazon_product_img" className={styles.productImg} />
                    <button className={styles.addButton} onClick={() => toggleProductSelection(product, 'Amazon')}>
                    {selectedProducts.some((p) => p.url === product.url && p.source === 'Amazon')
                      ? 'Remove from Comparison'
                      : 'Add to Comparison'}
                  </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Buttons for scrolling to sections */}
        <div className={styles.scrollButtons}>
          <button
            className={styles.scrollButton}
            onClick={() => scrollToSection("eBaySection")}
          >
            <img src="/ebayLogo.jpg" className={styles.scrollButtonImg} />
          </button>
          <button
            className={styles.scrollButton}
            onClick={() => scrollToSection("bestBuySection")}
          >
            <img src="/bestBuyLogo.jpg" className={styles.scrollButtonImg} />
          </button>
          <button
            className={styles.scrollButton}
            onClick={() => scrollToSection("amazonSection")}
          >
            <img src="/amazonLogo.png" className={styles.scrollButtonImg} />
          </button>
          <button onClick={() => scrollToSection("compareSection")} className={styles.scrollButton}>
            Compare
          </button>
        </div>
      </div>
    </main>
  );
}

