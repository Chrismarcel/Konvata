/**
 * 
 * @class CurrencyConverter
 * @author Chrismarcel
 * @version 1.0
 * @description Currency Converter class contains Static methods to implement currency conversion
 * 
 */

class CurrencyConverter {

    constructor(currency_pair, value) {
        this.currency_pair = currency_pair;
        this.value = value;

        CurrencyConverter.convertCurrencies(currency_pair, value);

        const selectCurrencyList = Array.from(document.querySelectorAll('.convert__currency-list'));
    }

    /**
     * @static initServiceWorker
     * @description Handles Event Listeners for Service Worker Registration
     * @param null
     * @returns new Service Worker registration object
     */
    static init() {
        // Disable toggle button on load;
        document.querySelector('.toggle-currency__switch').setAttribute('disabled', 'disabled');
        if (!navigator.serviceWorker) return;
        
        const dbPromise = idb.open('currency-list', 1, upgradeDB => {
            upgradeDB.createObjectStore('currencies', { keyPath: 'currencyName' });
            upgradeDB.createObjectStore('exchange_rates', { keyPath: 'pair' });
        });
        
        navigator.serviceWorker.register('./sw.js')
        .then(reg => {
            // If there's a waiting worker, bypass network
            // Fetch currency list from IndexedDB
            if (reg.waiting) {
                return dbPromise.then(db => {
                    return db.transaction('currencies').objectStore('currencies').getAll();
                })
                .then(allCurrencies => {
                    this.listCurrencies(allCurrencies);
                    return allCurrencies;
                });
            }
            
            // If there's a installing worker then it's loading for the first time
            // Fetch currency list from API
            else if (reg.installing) {
                const currenciesListURL = 'https://free.currencyconverterapi.com/api/v5/currencies';
                
                fetch(currenciesListURL)
                .then(response => {
                    return response.json();
                })
                .then(responseObj => {
                    this.listCurrencies(Object.values(responseObj.results));
                    dbPromise.then(dbObj => {
                        const tx = dbObj.transaction('currencies', 'readwrite');
                        Object.values(responseObj.results).map(currency => {
                            tx.objectStore('currencies').put(currency);
                        });
                    });
                });
                
                reg.installing.addEventListener('statechange', function () {
                    if (this.state === 'installed') {
                        return dbPromise.then(db => {
                            return db.transaction('currencies').objectStore('currencies').getAll();
                        })
                        .then(allCurrencies => {
                            CurrencyConverter.listCurrencies(allCurrencies);
                            return allCurrencies;
                        });
                    }
                });
            }
            // If there's an activated worker, bypass network
            // Fetch currency list from IndexedDB
            else if (reg.active.state === 'activated') {
                return dbPromise.then(db => {
                    return db.transaction('currencies').objectStore('currencies').getAll();
                })
                .then(allCurrencies => {
                    CurrencyConverter.listCurrencies(allCurrencies);
                    return allCurrencies;
                });
            }
        });
    }

    /**
     * @static listCurrencies
     * @description Sorts Currency list and populates the Currency Select Option element
     * @param object currencies
     * @returns Array of Currency list
     */
    static listCurrencies(currencies) {
        const sortedCurrencies = Array.from(currencies).sort((previous, next) => {
            // Sort the currencies in Alphebetical order
            if (previous.currencyName < next.currencyName) {
                return -1;
            }
            else if (previous.currencyName > next.currencyName) {
                return 1;
            }
            return 0;
        });
        // Populate Select Option element
        return sortedCurrencies.map(currency => {
            const option = document.createElement('option');
            option.value = currency.id;
            option.textContent = `${currency.currencyName} (${currency.id})`;
            document.querySelector('#convert--from').appendChild(option);
            document.querySelector('#convert--to').appendChild(option.cloneNode(true));
        });
    }

    /**
     * @static convertCurrencies
     * @description Fetches exchange rates from either IndexedDB or API
     * if exchange rate does not exist in IndexedDB
     * @param string currency_pair
     * @param float value
     * @returns exchange rate
     */
    static convertCurrencies(currency_pair, value) {
        const exchangeRateURL = `https://free.currencyconverterapi.com/api/v5/convert?q=${currency_pair}&compact=y`;

        const dbPromise = idb.open('currency-list', 1, upgradeDB => {
            upgradeDB.createObjectStore('currencies', { keyPath: 'currencyName' });
            upgradeDB.createObjectStore('exchange_rates', { keyPath: 'pair' });
        });

        // Attempt fetching exchange rate from DB
        return dbPromise.then(db => {
            return db.transaction('exchange_rates').objectStore('exchange_rates').get(currency_pair);
        })
        .then(rateObj => {
            // If exchange rate exists in IndexedDB
            if(rateObj) {
                this.calculateConversion(rateObj.exchange_rate, value);
                return rateObj;
            } else { 
                // If not fetch from API and store in IndexedDB for subsequent operations
                fetch(exchangeRateURL)
                .then(response => {
                    return response.json();
                })
                .then(fetchedRate => {
                    return dbPromise.then(dbObj => {
                        const rate = {
                            pair: Object.keys(fetchedRate)[0],
                            exchange_rate: Object.values(fetchedRate)[0].val
                        };
                        const tx = dbObj.transaction('exchange_rates', 'readwrite');
                        tx.objectStore('exchange_rates').put(rate);
                        
                        this.calculateConversion(rate.exchange_rate, value);
                        return rate;
                    });
                });
            }
        });
    }

    /**
     * @static calculateConversion
     * @description Calculates the conversion and displays the coverted currency value
     * @param float rate
     * @param float value
     * @returns converted value
     */
    static calculateConversion(rate, value) {
        const convertedValue = value * rate;
        const displayBox = document.querySelector('.converter__currency-display');
        displayBox.setAttribute('data-num-value', convertedValue.toFixed(2));
        displayBox.textContent = convertedValue.toLocaleString('en',
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        return convertedValue;
    }
}