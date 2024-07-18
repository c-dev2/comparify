// Function to retrieve eBay products based on the user's search using
// the NextJS Route Handler
export async function fetchEbayProducts(query) {
    const res = await fetch(`/api/search/${query}/ebay`);
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message);
    }
  
    return data;
  }
  
export async function fetchBestBuyProducts(query) {
    const res = await fetch(`/api/search/${query}/best-buy`);
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message);
    }
  
    return data;
  }

  export async function fetchAmazonProducts(query) {
    const res = await fetch(`/api/search/${query}/amazon`);
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message);
    }
  
    return data;
  }