import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { query } = params;
  const apiKey = process.env.AMAZON_KEY; // Use the environment variable
  const endpoint = `https://real-time-amazon-data.p.rapidapi.com/search?query=${query}&page=1&country=CA&sort_by=LOWEST_PRICE&product_condition=ALL`;
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