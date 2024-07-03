//Import newsAPI.io or newsAPI.org for news data

//Chart.js for Data Visualization
//const chart = require('chart.js');

// config.js used for API key storage
//require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const AV_apiKey = Alpha_Vantage_API_Key; // console.log(!!AV_apiKey);
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

//Custom Function to get previous business day
function getPreviousBusinessDay(date) {
    const day = new Date(date);
    let offset;
    if(date.getDay() === 0) { //Sunday
        offset = 2;
    } else if (day.getDay() === 1) { //Monday
        offset = 3;
    } else {
        offset = 1;
    }
    day.setDate(day.getDate() - offset);
    return date.toISOString().split('T')[0]; //Returns dat in YYYY-MM-DD format
}

function displayStockData(data) { //Defines stock data function and extracts data
    if(!data) {
        console.log('No data availible'); //Error handling
        return;
    }

    //Extract relevant data from data object
    const timeSeries = data['Time Series (Daily)']; //Accesses the Time SEries (daily) object from fetched data
    const latestDate = Object.keys(timeSeries)[0]; //Extract the latest data possible, returns array of dates(keys) in the time series object. [0] gets first date
    const latestData = timeSeries[latestDate]; //Use the latest date key to get stock data from time series object
    const closePrice = latestData['4. close']; //Extracts the closing price at the latest date. Data contains (open, high, low, close, volume) fields, using close index 4

    //Fetch date and yesterday's date
    const today = new Date().toISOString().split('T')[0]; //Need to split at T and index at 0 because ISO String outputs date and time denoted T seperaing the values
    const yesterday = getPreviousBusinessDay(today); //Uses custom function above to find yesterdays date

    //Check if todays data is availible, if not use yesterday's data



    //Fetches specified data 
    document.getElementById('stock-symbol').textContent = stockSymbol; //Finds ID and replaces txt. Updates HTML elements with ID's 'stock-symbol' etc...
    document.getElementById('stock-price').textContent = `Stock Price: ${closePrice}`;
    document.getElementById('stock-date').textContent = `Date: ${latestDate}`;
}

fetchStockData(stockSymbol) //calls the ticker symbol and has additional error handling if incorrectly run
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



//Next Steps:

// API Integration: Implement functions to interact with stock and news APIs.
// Data Processing and Display: Write functions to update the DOM with the fetched data.
// Real-time Updates: Implement periodic updates for stock data.
// Event Handlers and Initialization: Set up event handlers and initialize the application when the document is ready