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

    try {
      const ebayResults = await fetchEbayProducts(query);
      const bestBuyResults = await fetchBestBuyProducts(query);
      setEbayProducts(ebayResults);
      setBestBuyProducts(bestBuyResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
                <div key={index} className={styles.product}>
                  <h3>{product.name}</h3>
                  <p>Price: {product.price}</p>
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
                <div key={index} className={styles.product}>
                  <h3>{product.name}</h3>
                  <p>Price: {product.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
