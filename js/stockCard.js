const stockCardSection = document.getElementById("stock-card-section");

export default async function (ticker) {
  const res = await fetch(
    `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=pk_b8445edb92244ad88a3de425568b1d07 `
  );
  const data = await res.json();
  renderStockCard(data);
}

const renderStockCard = function (stock) {
  let html = `
  <div class="stock-card">
  <div class="stock-basics">
    <span class="stock-company-name">${formatStockCardCompanyName(
      stock.companyName
    )}</span>
    <span class="stock-logo" data-logo><img class="stock-logo-img" src="./images/${
      stock.symbol
    }_Logo.png"></span></span>
    <div class="stock-last-price">
    <span>${stock.primaryExchange}: ${stock.symbol}</span>
    <div class="price-hightlight">
    
    <span>Latest Price: </span>
    <span class="highlight ${
      stock.changePercent >= 0 ? "green-price-box" : "red-price-box"
    }">${stock.latestPrice}
    </span>
    <span>Latest Change: </span>
    <span class="highlight ${
      stock.changePercent >= 0 ? "green-price-box" : "red-price-box"
    }">${(parseFloat(stock.changePercent) * 100).toFixed(2)}%
    </span>
    </div>
  </div>
</div>
  <div class="stock-chart">
  ${renderStockChartIframe(stock)}
  </div>
  <div class="stock-info">
    <span class="stock-info-piece">YTD: ${(
      parseFloat(stock.ytdChange) * 100
    ).toFixed(2)}%</span>
    <span class="stock-info-piece">Market Cap: ${calculateMarketCapUnit(
      stock.marketCap
    )}</span>
    <span class="stock-info-piece">PE Ratio: ${stock.peRatio}</span>
    <span class="stock-info-piece">52WK Low/High: $${stock.week52Low} - $${
    stock.week52High
  }</span>
  </div>
</div>
      `;

  stockCardSection.insertAdjacentHTML("beforeend", html);
};

const formatStockCardCompanyName = function (name) {
  if (name.includes(" - Class"))
    return name.substring(0, name.indexOf("- Class"));
  return name;
};

const renderStockChartIframe = function (stock) {
  const html = `
  <div id="tradingview_b9e96-wrapper"
    style="position: relative;box-sizing: content-box;width: 240px;height: 150px;margin: 0 auto !important;padding: 0 !important;font-family:Arial,sans-serif;">
    <div style="width: 240px;height: 150px;background: transparent;padding: 0 !important;"><iframe
        id="tradingview_b9e96"
        src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_b9e96&amp;symbol=${stock.symbol}&amp;interval=5&amp;hidetoptoolbar=1&amp;hidelegend=1&amp;saveimage=0&amp;toolbarbg=f1f3f6&amp;studies=%5B%5D&amp;theme=dark&amp;style=2&amp;timezone=America%2FNew_York&amp;studies_overrides=%7B%7D&amp;overrides=%7B%7D&amp;enabled_features=%5B%5D&amp;disabled_features=%5B%5D&amp;locale=en&amp;utm_source=127.0.0.1&amp;utm_medium=widget&amp;utm_campaign=chart&amp;utm_term=${stock.symbol}"
        style="width: 100%; height: 100%; margin: 0 !important; padding: 0 !important;" frameborder="0"
        allowtransparency="true" scrolling="no" allowfullscreen=""></iframe></div>
  </div>
  `;
  return html;
};

const calculateMarketCapUnit = function (marketCap) {
  const markCap =
    parseInt(marketCap) >= 1000000000000
      ? (parseInt(marketCap) / 1000000000000).toFixed(2) + " Trillion"
      : parseInt(marketCap) >= 1000000000
      ? (parseInt(marketCap) / 1000000000).toFixed(2) + " Billion"
      : (parseInt(marketCap) / 1000000).toFixed(2) + " Million";
  return markCap;
};
