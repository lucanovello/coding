const canvas = document.getElementById('canvas');
const valueTextContainer = document.getElementById('table-container');
const randValue = document.getElementById('rand-value');

const INITIAL_VALUE = 0;
const RANGE = 1;

const GENERATIONS = 100000;
const VARIATIONS = 10;

let finalValueArr = [];

function initArray() {
    for (let i = 0; i < VARIATIONS; i++) {
        finalValueArr.push({
            name: i,
            value: INITIAL_VALUE,
            difference: 0,
            randomDelta: 0,
            randomAvg: 0,
        });
    }
}

function updateGenerations() {
    for (let i = 0; i < GENERATIONS; i++) {
        const randomD1 = Math.random();
        // const randomD1 = getRandomArbitrary(-RANGE, RANGE);
        const randomDelta = randomD1 * randomD1;
        for (let j = 0; j < finalValueArr.length; j++) {
            const item = finalValueArr[j];
            item.value += j > 0 ? parseFloat(randomDelta.toFixed(j)) : randomDelta;
            item.difference = item.value - finalValueArr[0].value;
            item.randomDelta = randomDelta;
            item.randomAvg += randomDelta;
        }
    }
    for (let i = 0; i < finalValueArr.length; i++) {
        const newRandomAvg = finalValueArr[i].randomAvg / GENERATIONS;
        finalValueArr[i].randomAvg = newRandomAvg;
    }
}

function drawResults() {
    for (let i = 0; i < finalValueArr.length; i++) {
        const result = finalValueArr[i];
        const value = result.value;
        const difference = result.difference;
        const randomDelta = result.randomDelta;
        const randomAvg = result.randomAvg;
        const randomSqrt = Math.sqrt(randomAvg);
        const valueWrapper = document.createElement('div');
        valueWrapper.classList = 'table-value-wrapper';

        // const valueName = document.createElement('p');
        // valueName.classList = 'table-value-name';
        // valueName.innerText = i;

        const valueRandom = document.createElement('p');
        valueRandom.classList = 'table-cell';

        const valueFinalValue = document.createElement('p');
        valueFinalValue.classList = 'table-cell';
        valueFinalValue.innerText = value.toFixed(20);

        const valueDiff = document.createElement('p');
        valueDiff.classList = 'table-cell';
        valueDiff.innerText = difference.toFixed(20);

        const valueRatio = document.createElement('p');
        valueRatio.classList = 'table-cell';
        valueRatio.innerText = (value / finalValueArr[0].value).toFixed(10);

        if (i > 0) {
            valueRandom.innerText = randomAvg.toFixed(i);
            valueRandom.style.color =
                parseFloat(randomAvg.toFixed(i)) < randomAvg
                    ? 'red'
                    : parseFloat(randomAvg.toFixed(i)) > randomAvg
                    ? 'green'
                    : '#242424';
            valueFinalValue.style.color =
                parseFloat(value.toFixed(20)) < finalValueArr[0].value
                    ? 'red'
                    : parseFloat(value.toFixed(20)) > finalValueArr[0].value
                    ? 'green'
                    : '#242424';
            valueDiff.style.color =
                parseFloat(difference.toFixed(20)) < 0
                    ? 'red'
                    : parseFloat(difference.toFixed(20)) > 0
                    ? 'green'
                    : '#242424';
            valueRatio.style.color =
                difference / randomAvg < 0
                    ? 'red'
                    : difference / randomAvg > 0
                    ? 'green'
                    : '#242424';
        } else {
            valueRandom.innerText = randomAvg;
            valueWrapper.style.fontWeight = '900';
        }

        // valueWrapper.appendChild(valueName);
        valueWrapper.appendChild(valueRandom);
        valueWrapper.appendChild(valueFinalValue);
        valueWrapper.appendChild(valueDiff);
        valueWrapper.appendChild(valueRatio);

        valueTextContainer.appendChild(valueWrapper);
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

initArray();
updateGenerations();
drawResults();

console.log();
