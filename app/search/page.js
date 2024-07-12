'use client'

import Image from "next/image";
import styles from "../page.module.css";
import { useState } from 'react';
import { fetchEbayProducts } from '../../lib/api';

export default function Home() {

  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const results = await fetchEbayProducts(query);
      setProducts(results);
      console.log(products);
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
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search to start saving today!" className={styles.searchBar}/>
            <button type="submit" className={styles.searchButton}>Search</button>
          </form>
        </div>
  
        {/* Display products */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div>
            {products.map((product, index) => (
              <div key={index}>
                <h2>{product.name}</h2>
                <p>Price: {product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
