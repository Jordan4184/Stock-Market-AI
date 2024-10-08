//Import newsAPI.org for news data

//Chart.js for Data Visualization
//const chart = require('chart.js');

// config.js used for API key storage
//require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const AV_apiKey = Alpha_Vantage_API_Key; // console.log(!!AV_apiKey);
const baseUrl = 'https://www.alphavantage.co/query'; // console.log(baseUrl); Use this to fetch data from the Alpha Vantage API.

// Utility Functions: Write reusable utility functions for fetching data and handling errors.
async function fetchStockData (symbol) { //async used so that page does not have to constantly refresh to update values
    const url = `${baseUrl}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${AV_apiKey}`; //directs to endpoint and defines time series and symbol input 

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

//Custom Function to get previous business day
function getPreviousBusinessDay(date) {
    const day = new Date(date);
    let offset;
    if(day.getDay() === 0) { //Sunday
        offset = 2;
    } else if (day.getDay() === 1) { //Monday
        offset = 3;
    } else {
        offset = 1;
    }
    day.setDate(day.getDate() - offset);
    return day.toISOString().split('T')[0]; //Returns dat in YYYY-MM-DD format
}

function displayStockData(data, symbol) { //Defines stock data function and extracts data
    if(!data) {
        console.log('No data availible'); //Error handling
        return;
    }

    //Extract relevant data from data object
    const timeSeries = data['Time Series (Daily)']; //Accesses the Time SEries (daily) object from fetched data

    //Fetch date and yesterday's date
    const today = new Date().toISOString().split('T')[0]; //Need to split at T and index at 0 because ISO String outputs date and time denoted T seperaing the values
    const yesterday = getPreviousBusinessDay(today); //Uses custom function above to find yesterdays date

     //Check if todays data is availible, if not use yesterday's data
    let latestDate;
    let latestData;
    if (timeSeries[today] && timeSeries[today]['4. close']) {
        latestDate = today;
        latestData = timeSeries[today];
    } else if (timeSeries[yesterday] && timeSeries[yesterday]['4. close']) {
        latestDate = yesterday;
        latestData = timeSeries[yesterday];
    } else {
        // Fallback to the most recent date available in the time series
        latestDate = Object.keys(timeSeries)[0];
        latestData = timeSeries[latestDate];
    }

    const closePrice = latestData['4. close']; //Extracts the closing price at the latest date. Data contains (open, high, low, close, volume) fields, using close index 4

    //Fetches specified data 
    document.getElementById('stock-symbol').textContent = symbol; //Finds ID and replaces txt. Updates HTML elements with ID's 'stock-symbol' etc...
    document.getElementById('stock-price').textContent = `Stock Price: ${closePrice}`;
    document.getElementById('stock-date').textContent = `Date: ${latestDate}`;
}

function searchStock() {
    const symbol = document.getElementById('stock-search').value.toUpperCase();
fetchStockData(symbol) //calls the ticker symbol and has additional error handling if incorrectly run
    .then(data => {
        if (data) {
            displayStockData(data, symbol);
        } else {
            console.error('Failed to fetch stock data');
            document.getElementById('stock-symbol').textContent = 'Error fetching stock data';
        }
    })
    .catch(error => {
        console.error('Error fetching stock data:', error);
        document.getElementById('stock-symbol').textContent = 'Error fetching stock data';
    });
}

const updateInterval = 24 * 60 * 60 * 1000; // Update once a day due to free API limitations

function startPeriodicUpdates(symbol) {
    setInterval(() => {
        fetchStockData(symbol)
            .then(data => {
                if (data) {
                    displayStockData(data, symbol);
                } else {
                    console.error('Failed to fetch stock data');
                    document.getElementById('stock-symbol').textContent = 'Error fetching stock data';
                }
            })
            .catch(error => {
                console.error('Error fetching stock data:', error);
                document.getElementById('stock-symbol').textContent = 'Error fetching stock data';
            });
    }, updateInterval);
}

//Next Steps:

// API Integration: Implement functions to interact with stock and news APIs.
// Data Visualization: Use Chart.js to visualize stock data.
// User Interface: Design a user interface to display stock data and news.
// User Experience: Implement user interactions to search for stocks and read news.
// Deployment: Deploy the dashboard to a live server.
// Testing: Test the dashboard to ensure it works as expected.
// Documentation: Write documentation to explain the dashboard and its features.
//Set up AI integration for stock data and news API
//Set up sentement analysis for news data and stock data
//Set up stock recommendations using AI parsing market data
//Setup stock indicators such as RSI, MACD, fibonacci potentially
//Style the dashboard using CSS
//Set up alerts system for stock price changes