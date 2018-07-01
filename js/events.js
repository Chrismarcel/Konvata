// Populate the select options via the listCurrencies static method
const selectOptions = Array.from(document.querySelectorAll('.convert__currency-list'));

selectOptions.map(currencyList => {
    currencyList.addEventListener('change', function () {
        convertCurrency();
    });
});

const inputValues = Array.from(document.querySelectorAll('.btn-value'));
inputValues.map(inputValue => {
    inputValue.addEventListener('click', function () {
        const inputValue = this.value;
        const amountDisplay = document.querySelector('.amount');

        if (inputValue === 'del') {
            amountDisplay.textContent = amountDisplay.textContent.slice(0, -1);
            if (amountDisplay.textContent === '') {
                amountDisplay.textContent = 0;
                document.querySelector('.converted').textContent = 0;
            }
            if (!amountDisplay.textContent.includes('.')) {
                document.querySelector('.btn-value[value="."]').removeAttribute('disabled');
            }
        } else {
            amountDisplay.textContent += inputValue;
            const valueList = amountDisplay.textContent.split('.');
            let [wholeNumber, decimalValues] = valueList;
            let valueOutput = parseFloat(wholeNumber);
            if (!decimalValues) {
                decimalValues = '';
            }
            else {
                decimalValues = `.${decimalValues}`;
            }
            valueOutput = `${valueOutput}${decimalValues}`;
            if (amountDisplay.textContent.includes('.')) {
                document.querySelector('.btn-value[value="."]').setAttribute('disabled', 'disabled');
            }
            if (this.value !== '.') {
                amountDisplay.textContent = valueOutput;
            }
        }

        // Chceck if the Convert To amount is not empty
        if (amountDisplay.textContent !== 0) {
            convertCurrency();
        }
    });
});

const toggleBtn = document.querySelector('.toggle-currency__switch');
toggleBtn.addEventListener('click', function (event) {
    let currencyFrom = document.querySelector('#convert--from').value;
    let currencyTo = document.querySelector('#convert--to').value;
    let valueFrom = document.querySelector('.amount').textContent;
    let valueTo = document.querySelector('.converted').getAttribute('data-num-value');

    // Use destructuring to swap values
    [currencyFrom, valueFrom, currencyTo, valueTo] = [currencyTo, valueTo, currencyFrom, valueFrom];

    document.querySelector('#convert--from').value = currencyFrom;
    document.querySelector('#convert--to').value = currencyTo;
    document.querySelector('.amount').textContent = valueFrom;
    document.querySelector('.converted').textContent = valueTo.toLocaleString('en', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    document.querySelector('.converted').setAttribute('data-num-value', valueTo);
});

convertCurrency = () => {
    const currencyTo = document.querySelector('#convert--to').value;
    const currencyFrom = document.querySelector('#convert--from').value;
    const value = document.querySelector('.amount').textContent;
    const currencies = `${currencyFrom}_${currencyTo}`;

    // Creates a new instance of CurrencyConverter
    const convertCurrency = new CurrencyConverter(currencies, value);
}