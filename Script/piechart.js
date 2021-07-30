var data = [];
var chartData = [];
var uniqueYears, uniqueIFA, uniqueFunds = [];

document.getElementById('chart-tabs').querySelector('#pie-tab').addEventListener("click", function () {
    getData();

    setTimeout(() => { buildChart(); }, 250);
});

//Gather relevant data
function getData() {
    console.log("test!");
    $.getJSON("Resources/dev_test.dat", data, function (data) {
        //First get unique ifas, and get data on a per ifa basis
        //Must calculate market share by dividing ifa's total sales by overall total
        //Then work on filtering out years and funds
        uniqueIFA = findIFAS(data);
        uniqueYears = findYears(data);
        uniqueFunds = findFunds(data);
        chartData = [['IFA', 'Market Share']]; //Setup 2d array for chart

        var salesTotal = calculateOverallTotal(data);

        for (var i = 0; i < uniqueIFA.length; i++) { //For each unique IFA
            var marketShare = 0;

            var currentIFAData = data.filter(function (obj) { //Get IFAs data
                return obj.ifa === uniqueIFA[i];
            });

            for (var j = 0; j < currentIFAData.length; j++) {
                marketShare += parseInt(currentIFAData[j].sales);
            }

            marketShare = (marketShare / salesTotal) * 100; //Calculate market share

            console.log("Market Share for: " + uniqueIFA[i] + " is " + marketShare);

            //Must convert original 1D array into 2D array to store this value.
            chartData.push([uniqueIFA[i], marketShare]);
        }

        console.log(chartData);
    }).fail(function () {
        console.log("error in retrieving data from JSON file!");
    });
}

function buildChart() {
    picasso.chart({
        element: document.getElementById('pie').querySelector('#piechart'),
        data: [
            {
                data: chartData,
            },
        ],
        settings: {
            scales: {
                c: {
                    data: { extract: { field: 'IFA' } }, type: 'color'
                }
            },
            components: [{
                type: 'legend-cat',
                scale: 'c'
            }, {
                key: 'p',
                type: 'pie',
                data: {
                    extract: {
                        field: 'IFA',
                        props: {
                            num: { field: 'Market Share' }
                        }
                    }
                },
                settings: {
                    slice: {
                        arc: { ref: 'num' },
                        fill: { scale: 'c' },
                        outerRadius: () => 0.9,
                        strokeWidth: 1,
                        stroke: 'rgba(255, 255, 255, 0.5)'
                    }
                }
            }]
        }
    });
}