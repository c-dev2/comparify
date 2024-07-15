import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { query } = params;
  const appId = process.env.EBAY_APP_ID; // Use the environment variable
  const endpoint = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${appId}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${query}`;

  try {
    const apiRes = await fetch(endpoint);
    const data = await apiRes.json();

    if (!apiRes.ok) {
      throw new Error(data.message);
    }

        // Extract product information
        const products = data.findItemsByKeywordsResponse[0].searchResult[0].item.map(product => ({
          name: product.title[0],
          price: product.sellingStatus[0].currentPrice[0].__value__,
        }));

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}