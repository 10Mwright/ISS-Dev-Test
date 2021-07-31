var data = [];
var chartData = [];
var uniqueAttributes = new Map;

//$.when(getData()).then(buildChart);
getData([""], [""]);

setTimeout(() => { 
    var defaultIFAs = uniqueAttributes.get("ifas");
    var defaultFunds = uniqueAttributes.get("Funds");
    buildChart(defaultIFAs, defaultFunds); 
    setupIFASelection(); 
    setupFundSelection(); }, 250); //Slight delay to avoid undefined data

//Gather relevant data
//Args: 1st Arg is an array of IFAs to avoid, 2nd is an array of Funds to avoid
function getData(ignoredIfas, ignoredFunds) {
    $.getJSON("Resources/dev_test.dat", data, function (data) {
        uniqueAttributes = getUniqueAttributes(data);
        chartData = [['Year', 'Sales']];

        //For each unique year, go through the data and total up its sales
        for (var i = 0; i < uniqueAttributes.get("Years").length; i++) {
            var total = 0;
            var currentYear = uniqueAttributes.get("Years")[i];

            var currentYearData = data.filter(function (obj) { //Filter data for only the currently targetted year
                return obj.year === currentYear
                    && $.inArray(obj.ifa, ignoredIfas) == -1
                    && $.inArray(obj.fund, ignoredFunds) == -1;
            });

            //For each row of data for this year add to year's total sales
            for (var j = 0; j < currentYearData.length; j++) {
                total += parseInt(currentYearData[j].sales);
            }

            console.log("Sales total for: " + currentYear + " is " + total);
            chartData.push([currentYear, total]);
        }

        console.log("Array of yearly totals: " + chartData);

    }).fail(function () {
        console.log("error in retrieving data from JSON file!");
    });
}

//Function to build barchart using picasso.js
function buildChart(ifas, funds) {
    picasso.chart({
        element: document.getElementById('charting').querySelector('#barchart'),
        data: [
            {
                type: 'bar',
                data: chartData,
            },
        ],
        settings: {
            scales: {
                y: {
                    data: { field: 'Sales' },
                    invert: true,
                    include: [0]
                },
                c: {
                    data: { field: 'Sales' },
                    type: 'color'
                },
                t: { data: { extract: { field: 'Year' } }, padding: 0.3 },
            },
            components: [
                {
                    type: 'text',
                    text: 'Chart showing total sales of select IFAs in select Funds by Year',
                    dock: 'top',
                    layout: { displayOrder: 3 },
                    style: {
                        text: {
                            fontSize: '150%',
                        },
                    },
                }, {
                    type: 'text',
                    text: 'IFAs Included: ' + ifas,
                    dock: 'top',
                    layout: { displayOrder: 2 }
                }, {
                    type: 'text',
                    text: 'Funds Included: ' + funds,
                    dock: 'top',
                    layout: { displayOrder: 1 }
                }, {
                    type: 'axis',
                    scale: 'y',
                    dock: 'left'
                },
                {
                    type: 'text',
                    text: 'Total Sales (£)',
                    dock: 'left',
                },
                {
                    type: 'axis',
                    scale: 't',
                    dock: 'bottom'
                },
                {
                    type: 'text',
                    text: 'Year',
                    dock: 'bottom',
                },
                {
                    type: 'grid-line',
                    x: {
                        scale: 'x'
                    },
                    y: {
                        scale: 'y'
                    },
                    ticks: {
                        show: true,
                        stroke: 'grey',
                        strokeWidth: 1,
                        strokeDasharray: '3,3'
                    }
                },
                {
                    key: 'bars',
                    type: 'box',
                    data: {
                        extract: {
                            field: 'Year',
                            props: {
                                start: 0,
                                end: { field: 'Sales' }
                            }
                        }
                    },
                    settings: {
                        major: { scale: 't' },
                        minor: { scale: 'y' },
                        box: {
                            fill: { scale: 'c', ref: 'end' }
                        }
                    }
                },
            ]
        }
    });
}

//Function to create checkboxes and add listeners
function setupIFASelection() {
    var targetDiv = document.getElementById("bar-ifa-selection");

    for(var i = 0; i < uniqueAttributes.get("ifas").length; i++) { //For each unique IFA
        var currentIFA = uniqueAttributes.get("ifas")[i];

        var newCheckbox = document.createElement("label"); //New DOM element
        newCheckbox.setAttribute('class', 'lui-checkbox'); //Add lui class to new element
        newCheckbox.innerHTML += '<input class="lui-checkbox__input" type="checkbox" id="' + currentIFA + '" checked /><div class="lui-checkbox__check-wrap"><span class="lui-checkbox__check"></span><span class="lui-checkbox__check-text">' + currentIFA + '</span></div>';

        targetDiv.appendChild(newCheckbox); //Add new checkbox element to div element

        targetDiv.getElementsByTagName("input")[i].addEventListener("click", recalculate); //Add onclick listener to new checkbox
    }
}

function setupFundSelection() {
    var targetDiv = document.getElementById("bar-fund-selection");

    for(var i = 0; i < uniqueAttributes.get("Funds").length; i++) { //For each unique fund
        var currentFund = uniqueAttributes.get("Funds")[i];

        var newCheckbox = document.createElement("label"); //New DOM element
        newCheckbox.setAttribute('class', 'lui-checkbox'); //Add lui class to new element
        newCheckbox.innerHTML += '<input class="lui-checkbox__input" type="checkbox" id="' + currentFund + '" checked /><div class="lui-checkbox__check-wrap"><span class="lui-checkbox__check"></span><span class="lui-checkbox__check-text">' + currentFund + '</span></div>';

        targetDiv.appendChild(newCheckbox); //Add new checkbox element to div element

        targetDiv.getElementsByTagName("input")[i].addEventListener("click", recalculate); //Add onclick listener to new checkbox
    }
}

//Function to read unchecked boxes and recalculate totals on only checked elements.
function recalculate() {
    var ifaDiv = document.getElementById("bar-ifa-selection");
    var fundDiv = document.getElementById("bar-fund-selection");
    var ignoredIFA = []; 
    var ignoredFunds = [];
    var includedIFA = [];
    var includedFunds = [];

    //Find IFAs to ignore
    for(var i = 0; i < uniqueAttributes.get("ifas").length; i++) {
        if(!ifaDiv.getElementsByTagName("input")[i].checked)  {
            ignoredIFA.push(uniqueAttributes.get("ifas")[i]); //Add to ignore list if unchecked
        } else {
            includedIFA.push(uniqueAttributes.get("ifas")[i]); //Add to included list if checked
        }
    }

    //Find Funds to ignore
    for(var i = 0; i < uniqueAttributes.get("Funds").length; i++) {
        if(!fundDiv.getElementsByTagName("input")[i].checked) {
            ignoredFunds.push(uniqueAttributes.get("Funds")[i]); //Add to ignore list if unchecked
        } else {
            includedFunds.push(uniqueAttributes.get("Funds")[i]); //Add to included list if checked
        }
    }

    console.log("ignored ifas: " + ignoredIFA);
    console.log("ignored funds: " + ignoredFunds);

    getData(ignoredIFA, ignoredFunds);
    
    setTimeout(() => { buildChart(includedIFA, includedFunds); }, 250); //Slight delay to avoid undefined data
}