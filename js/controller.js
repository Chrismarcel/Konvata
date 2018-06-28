/**
 * 
 * The CurrencyConverter Class 
 * 
 */

class CurrencyConverter {

    constructor(currencies, value) {
        this.currencies = currencies;
        this.value = value;

        CurrencyConverter.convertCurrencies(currencies, value);

        const selectCurrencyList = Array.from(document.querySelectorAll('.convert__currency-list'));
        // CurrencyConverter.listCurrencies(selectCurrencyList);
    }

    checkServiceWorker() {
        if (!navigator.serviceWorker) return;
        navigator.serviceWorker.register('./sw.js');
    }

    // static listCurrencies(selectElems) {
    //     const baseURL = 'https://free.currencyconverterapi.com/api/v5/currencies';
    //     const option = [];
    //     return fetch(baseURL)
    //     .then(response => {
    //         return response.json();
    //     })
    //     .then(allCurrencies => {
    //         return selectElems.map((selectElems, index) => {
    //             Object.values(allCurrencies.results).map(currency => {
    //                 option[index] = document.createElement('option');
    //                 option[index].value = currency.id;
    //                 option[index].textContent = `${currency.currencyName} (${currency.id})`;
    //                 selectElems.appendChild(option[index]);
    //             });
    //         });
    //     });
    // }

    static convertCurrencies(currency, value) {
        const convertURL = `https://free.currencyconverterapi.com/api/v5/convert?q=${currency}&compact=y`;
        return fetch(convertURL)
        .then(response => {
            return response.json();
        })
        .then(exchangeRate => {
            const rate = Object.values(exchangeRate)[0].val;
            const convertedCurrency = value * rate;
            const displayBox = document.querySelector('.converter__currency-display');
            displayBox.setAttribute('data-num-value', convertedCurrency.toFixed(2));
            displayBox.textContent = convertedCurrency.toLocaleString('en', 
            {   
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
            return convertedCurrency;
        });
    }
}