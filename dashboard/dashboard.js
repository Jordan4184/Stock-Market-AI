//Import newsAPI.io or newsAPI.org for news data


//Chart.js for Data Visualization
const chart = require('chart.js');

//dotenv for API keys: sets dotenv up in root directory
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const AV_apiKey = process.env.Alpha_Vantage_API_Key; // console.log(!!AV_apiKey);
const baseUrl = 'https://www.alphavantage.co/query'; // console.log(baseUrl); Use this to fetch data from the Alpha Vantage API.




//Organization

// Configuration and Initialization: Define API keys, base URLs, and any other global constants.

// Utility Functions: Write reusable utility functions for fetching data and handling errors.
// API Integration: Implement functions to interact with stock and news APIs.
// Data Processing and Display: Write functions to update the DOM with the fetched data.
// Real-time Updates: Implement periodic updates for stock data.
// Event Handlers and Initialization: Set up event handlers and initialize the application when the document is ready