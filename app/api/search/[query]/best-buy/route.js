import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { query } = params; // Gets the user's query from the calling function in api.js
  const apiKey = process.env.BEST_BUY_KEY; // Use the environment variable
  // Best Buy API endpoint
  // Needs to be built through a loop because when doing a keyword search through their API,
  // the first word needs to have "search=" before it and each word after that
  // needs to be prefixed with "&search=" in the URL.
  // Docs: https://bestbuyapis.github.io/api-documentation/#products-api
  let endpoint = `https://api.bestbuy.com/v1/products(search=`;

  const querySplit = query.split(" "); // Split query into an array

  // For loop to iterate through the above array and concatentate the keyword part of the URL together,
  // properly adding the "&search=" before each word.
  for(let i = 0; i < querySplit.length; i++) {
    endpoint = endpoint.concat(querySplit[i]);
    if(querySplit[i+1] != null) {
      endpoint = endpoint.concat("&search=");
    }
  }

  // After the keywords are added, finish off the URL with the rest of the info, including the API key.
  const finalEndpoint = endpoint.concat(`)?format=json&show=name,salePrice,url,image&pageSize=80&apiKey=${apiKey}`);

  try {
    const apiRes = await fetch(finalEndpoint);
    const data = await apiRes.json();

    if (!apiRes.ok) {
      throw new Error(data.message);
    }

        // Extract product information
        const products = data.products.map(product => ({
          name: product.name,
          price: product.salePrice,
          url: product.url,
          img: product.image
        }));

        // Code acquire from https://stackoverflow.com/questions/979256/sorting-an-array-of-objects-by-property-values
        // Sorts products by price in ascending order
        // products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}