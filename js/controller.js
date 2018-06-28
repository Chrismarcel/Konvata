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
    }

    checkServiceWorker() {
        if (!navigator.serviceWorker) return;
        navigator.serviceWorker.register('./sw.js');
    }

    static listCurrencies(selectElems) {
        const baseURL = 'https://free.currencyconverterapi.com/api/v5/currencies';
        const option = [];
        return fetch(baseURL)
            .then(response => {
                return response.json();
            })
            .then(allCurrencies => {
                return selectElems.map((selectElems, index) => {
                    Object.values(allCurrencies.results).map(currency => {
                        option[index] = document.createElement('option');
                        option[index].value = currency.id;
                        option[index].textContent = `${currency.currencyName} (${currency.id})`;
                        selectElems.appendChild(option[index]);
                    });
                });
            });
    }
}