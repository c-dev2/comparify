import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { query } = params; // Gets the user's query from the calling function in api.js
  const appId = process.env.EBAY_APP_ID; // Use the environment variable
  // eBay API endpoint
  // By far the simplest call, you just pass the query directly into the URL and make the call.
  // Docs: https://developer.ebay.com/Devzone/finding/CallRef/findItemsByKeywords.html
  const endpoint = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${appId}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${query}&paginationInput.entriesPerPage=80`;

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
          url: product.viewItemURL,
          img: product.galleryURL
        }));

        // Code acquire from https://stackoverflow.com/questions/979256/sorting-an-array-of-objects-by-property-values
        // Sorts products by price in ascending order
        // products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}