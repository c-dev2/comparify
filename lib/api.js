// Function to retrieve eBay products based on the user's search using
// the NextJS Route Handler
export async function fetchEbayProducts(query) {
    const res = await fetch(`/api/search/${query}`);
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message);
    }
  
    return data;
  }
  