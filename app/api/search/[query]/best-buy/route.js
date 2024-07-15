import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { query } = params;
  const apiKey = process.env.BEST_BUY_KEY; // Use the environment variable
  let endpoint = `https://api.bestbuy.com/v1/products(search=`;

  const querySplit = query.split(" ");

  for(let i = 0; i < querySplit.length; i++) {
    endpoint = endpoint.concat(querySplit[i]);
    if(querySplit[i+1] != null) {
      endpoint = endpoint.concat("&search=");
    }
  }

  const finalEndpoint = endpoint.concat(`)?format=json&show=name,salePrice&apiKey=${apiKey}`);

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
        }));

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}