async function getStockData() {
    // FIX: Removed .toUpperCase() because IndianAPI requires proper case company names (e.g., "Tata Steel")
    const symbol = document.querySelector('.stockSearch').value.trim();
    if (!symbol) return;

    // Matches your <div class="place_stock" id="stockResult">
    const resultBox = document.getElementById('stockResult');
    resultBox.innerHTML = `<div class="inside"><p class="loading_text">Fetching data...</p></div>`;

    const url = `http://localhost:3000/api/stock?name=${symbol}`;

    try {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error("Stock not found");
        }

        let data = await response.json();
        console.log(data);

        // Safely extract price based on IndianAPI response schema
        let currentPrice = data.currentPrice?.BSE || data.price || 'N/A';
        let companyName = data.companyName || symbol;

        let displayContent = `
            <div class="inside">
                <div><span>Company Name</span><span>${companyName}</span></div>
                <div><span>Current Price (BSE)</span><span>₹${currentPrice}</span></div>
            </div>
        `;

        resultBox.innerHTML = displayContent;

    } catch (error) {
        console.error("Error fetching stock data:", error);
        resultBox.innerHTML = `<div class="inside"><p class="error_text">Could not find data for "${symbol}". Check the name and try again.</p></div>`;
    }
}

// ADDED: Dynamic Crypto Handler Function
async function getCryptoData() {
    const coinInput = document.querySelector('.cryptoSearch').value.trim().toLowerCase();
    if (!coinInput) return;

    // Normalizing common abbreviations
    let coin = coinInput;
    if (coin === 'btc') coin = 'bitcoin';
    if (coin === 'eth') coin = 'ethereum';

    // Matches your <div class="place" id="cryptoResult">
    const resultBox = document.getElementById('cryptoResult');
    resultBox.innerHTML = `<div class="inside"><p class="loading_text">Fetching data...</p></div>`;

    const url = `http://localhost:3000/api/crypto?name=${coin}`;

    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error("Crypto not found");

        let data = await response.json();
        console.log(data);

        // Check if the API returned data for this coin name
        if (!data[coin]) {
            throw new Error("Invalid coin name mapping");
        }

        let price = data[coin].inr;
        let change = data[coin].inr_24h_change ? data[coin].inr_24h_change.toFixed(2) : "0.00";

        let displayContent = `
            <div class="inside">
                <div><span>Coin</span><span>${coin.toUpperCase()}</span></div>
                <div><span>Price (INR)</span><span>₹${price.toLocaleString('en-IN')}</span></div>
                <div><span>24h Change</span><span>${change}%</span></div>
            </div>
        `;

        resultBox.innerHTML = displayContent;

    } catch (error) {
        console.error("Error fetching crypto data:", error);
        resultBox.innerHTML = `<div class="inside"><p class="error_text">Could not find data for "${coinInput}". Try using the full name (e.g., bitcoin).</p></div>`;
    }
}