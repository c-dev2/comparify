// Function to retrieve eBay products based on the user's search using
// the NextJS Route Handler
export async function fetchEbayProducts(query) {
  // Makes a call to the internal "ebay" API at the given file path.
  // If you go to the route.js file at this file path, you will find the code to actually
  // retrieve the data from the API.
    const res = await fetch(`/api/search/${query}/ebay`);
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message);
    }
  
    return data;
  }
  
// Function to retrieve Best Buy products based on the user's search using
// the NextJS Route Handler
export async function fetchBestBuyProducts(query) {
  // Makes a call to the internal "best-buy" API at the given file path.
  // If you go to the route.js file at this file path, you will find the code to actually
  // retrieve the data from the API.
    const res = await fetch(`/api/search/${query}/best-buy`);
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message);
    }
  
    return data;
  }

// Function to retrieve Amazon products based on the user's search using
// the NextJS Route Handler
  export async function fetchAmazonProducts(query) {
  // Makes a call to the internal "amazon" API at the given file path.
  // If you go to the route.js file at this file path, you will find the code to actually
  // retrieve the data from the API.
    const res = await fetch(`/api/search/${query}/amazon`);
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message);
    }
  
    return data;
  }