/**
 * 
 * The CurrencyConverter Class 
 * 
 */

class CurrencyConverter {

    constructor(currencies, value) {
        this.currencies = currencies;
        this.value = value;
    }

    checkServiceWorker() {
        if (!navigator.serviceWorker) return;
        navigator.serviceWorker.register('./sw.js');
    }
}