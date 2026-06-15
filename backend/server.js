require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Allow your Live Server page to talk to this server
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Stock Proxy Route (IndianAPI)
app.get('/api/stock', async (req, res) => {
    const symbol = req.query.name; 
    try {
        console.log(`[Stocks] Fetching data for: ${symbol}`);
        
        const response = await fetch(`https://stock.indianapi.in/stock?name=${encodeURIComponent(symbol)}`, {
            headers: { "x-api-key": process.env.API_KEY }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`IndianAPI responded with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        // This will log the exact issue (like an expired key or bad name) in your VS Code terminal
        console.error("❌ STOCK FETCH ERROR:", error.message);
        res.status(500).json({ error: "Could not fetch stock data" });
    }
});

// Crypto Proxy Route (CoinGecko Free API)
app.get('/api/crypto', async (req, res) => {
    const coin = req.query.name.toLowerCase(); 
    try {
        console.log(`[Crypto] Fetching data for: ${coin}`);
        
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=inr&include_24hr_change=true`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`CoinGecko responded with status ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("❌ CRYPTO FETCH ERROR:", error.message);
        res.status(500).json({ error: "Could not fetch crypto data" });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server is running smoothly!`);
    console.log(`👉 Backend URL: http://localhost:${PORT}`);
    console.log(`🔑 Loaded API Key status: ${process.env.API_KEY ? "✅ Active" : "❌ Not Found (Check .env file)"}\n`);
});