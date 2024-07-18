import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { query } = params; // Gets the user's query from the calling function in api.js
  const apiKey = process.env.AMAZON_KEY; // Use the environment variable
  // Amazon API endpoint
  // This one is done through the "RapidAPI" website because the first-party Amazon API
  // has too many requirements
  // This one has a hard limit of 100 requests per month!! DO NOT MAKE TOO MANY SEARCHES!
  // Docs: https://v2.rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data
  const endpoint = `https://real-time-amazon-data.p.rapidapi.com/search?query=${query}&page=1&country=CA&sort_by=RELEVANCE&product_condition=ALL`;
  // Adds our API key in the headers of this call
  const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': apiKey,
		'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
	}
};

  try {
    const apiRes = await fetch(endpoint, options);
    const dataJSON = await apiRes.json();

    if (!apiRes.ok) {
      throw new Error(data.message);
    }

        // Extract product information
        const products = dataJSON.data.products.map(product => ({
          name: product.product_title,
          price: product.product_price,
          url: product.product_url,
          img: product.product_photo
        }));

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}