//Import newsAPI.io or newsAPI.org for news data

// Configuration and Initialization: Define API keys, base URLs, and any other global constants.

//Chart.js for Data Visualization
//const chart = require('chart.js');

//dotenv for API keys: sets dotenv up in root directory
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const AV_apiKey = process.env.Alpha_Vantage_API_Key; // console.log(!!AV_apiKey);
const baseUrl = 'https://www.alphavantage.co/query'; // console.log(baseUrl); Use this to fetch data from the Alpha Vantage API.

// Utility Functions: Write reusable utility functions for fetching data and handling errors.
async function fetchStockData (symbol) { //async used so that page does not have to constantly refresh to update values
    const url = `${baseUrl}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${AV_apiKey})`; //directs to endpoint and defines time series and symbol input 

    try { //used for error handling, if try fails, catch is ran
        
        const response = await fetch(url);//fetches url querry into a response variable 
        
        if(!response.ok) { //response.ok is true if response status code is rang 200-299 which indicates success. However, the '!' reverses it so its true if its false, thus throwing error
            throw new Error('Network response was not ok'); //returns error message if 
        }
        const data = await response.json(); //Parse JSON

        return data; //Returns parsed data 
    } catch (error) {
        console.error('Fetch error:', error); // Handles any and all errors from the try section
        return null;
    }
};

const stockSymbol = 'TSLA'; //Test call of symbol for fetchStockData to use

function displayStockData(data) { //Defines stock data function and extracts data
    if(!data) {
        console.log('No data availible'); //Error handling
        return;
    }
    //Extract relevant data
    const timeSeries = data['Time Series (Daily)']; //Accesses the Time SEries (daily) object from fetched data
    const latestDate = Object.keys(timeSeries)[0]; //Extract the latest data possible, returns array of dates(keys) in the time series object. [0] gets first date
    const latestData = timeSeries[latestDate]; //Use the latest date key to get stock data from time series object
    const closePrice = latestData['4, close']; //Extracts the closing price at the latest date. Data contains (open, high, low, close, prices) fields, using close

    //Fetches specified data 
    document.getElementById('stock-symbol').textContent = stockSymbol; //Finds ID and replaces txt. Updates HTML elements with ID's 'stock-symbol' etc...
    document.getElementById('stock-price').textContent = `Stock Price: ${closePrice}`;
    document.getElementById('stock-date').textContent = `Date: ${latestDate}`;
}

fetchStockData(stockSymbol)
    .then(data => {
        if (data) {
            displayStockData(data);
        } else {
            console.error('Failed to fetch stock data');
            document.getElementById('stock-symbol').textContent = 'Error fetching stock data';
        }
    })
    .catch(error => {
        console.error('Error fetching stock data:', error);
        document.getElementById('stock-symbol').textContent = 'Error fetching stock data';
    });



//Organization

// API Integration: Implement functions to interact with stock and news APIs.
// Data Processing and Display: Write functions to update the DOM with the fetched data.
// Real-time Updates: Implement periodic updates for stock data.
// Event Handlers and Initialization: Set up event handlers and initialize the application when the document is ready