"use client";

import Image from "next/image";
import styles from "../page.module.css";
import { useState } from "react";
import { fetchAmazonProducts, fetchBestBuyProducts, fetchEbayProducts } from "../../lib/api";

export default function Home() {
  // React states for the search query.
  // There's one for the user's query, the 3 APIs/stores,
  // one for the "loading" status (if the products are still being retrieved from the API),
  // and one for any error messages.
  const [query, setQuery] = useState("");
  const [ebayProducts, setEbayProducts] = useState([]);
  const [bestBuyProducts, setBestBuyProducts] = useState([]);
  const [amazonProducts, setAmazonProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        const amazonResults = await fetchAmazonProducts(query.trim()); // Comment out this line to prevent Amazon searches
        setEbayProducts(ebayResults);
        setBestBuyProducts(bestBuyResults);
        setAmazonProducts(amazonResults); // Comment out this line to prevent Amazon searches
      } catch (err) {
        setError(err.message); // Catch any errors
      } finally {
        setLoading(false); // Once the products are retrieved, stop displaying "Loading..."
      }
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
        <div className={styles.center}> 

          {/* Form to submit queries. This is the search bar */}
          <form onSubmit={handleSearch}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search to start saving today!"
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
              {ebayProducts.map((product, index) => (
                <div key={index} className={`${styles.product} ${styles.ebayProduct}`}>
                  <h3><a href={product.url} target="_blank" rel="noopener noreferrer">{product.name}</a></h3>
                  <p>Price: {product.price}</p>
                  <img src={product.img} alt="ebay_product_img" width="150" height="150" />
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
                  <img src={product.img} alt="best_buy_product_img" width="150" height="150" />
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
                  <img src={product.img} alt="amazon_product_img" width="150" height="150" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons for scrolling to sections */}
        <div className={styles.scrollButtons}>
          <button
            className={styles.scrollButton}
            onClick={() => scrollToSection("ebaySection")}
          >
            eBay Products
          </button>
          <button
            className={styles.scrollButton}
            onClick={() => scrollToSection("bestBuySection")}
          >
            BestBuy Products
          </button>
          <button
            className={styles.scrollButton}
            onClick={() => scrollToSection("amazonSection")}
          >
            Amazon Products
          </button>
        </div>

      </div>
    </main>
  );
}

