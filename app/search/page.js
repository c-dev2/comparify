"use client";

import Image from "next/image";
import styles from "../page.module.css";
import { useState } from "react";
import { fetchBestBuyProducts, fetchEbayProducts } from "../../lib/api";

export default function Home() {
  const [query, setQuery] = useState("");
  const [ebayProducts, setEbayProducts] = useState([]);
  const [bestBuyProducts, setBestBuyProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if(query != null && query != " " && query != "") {
      try {
        const ebayResults = await fetchEbayProducts(query.trim());
        const bestBuyResults = await fetchBestBuyProducts(query.trim());
        setEbayProducts(ebayResults);
        setBestBuyProducts(bestBuyResults);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className={styles.main}>
      <div>
        <div className={styles.center}>
          <h1>Comparify</h1>
        </div>
        <div className={styles.center}>
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

        {/* Display products */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className={styles.productContainer}>
            <div className={styles.ebaySection}>
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
                  <img src={product.img} alt="ebay_product_img" width="150" height="150"/> 
                </div>
              ))}
            </div>
            <div className={styles.bestBuySection}>
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
                  <img src={product.img} alt="best_buy_product_img" width="150" height="150"/> 
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

