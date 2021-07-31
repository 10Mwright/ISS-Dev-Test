var data, chartData = [];
var uniqueAttributes = new Map;
var chartDiv = document.getElementById('pie').querySelector('#piechart');

//Triggered when Pie Chart tab button is clicked, this is to allow the chart to render
//as on initial page load the pie chart div is set to hidden.
document.getElementById('chart-tabs').querySelector('#pie-tab').addEventListener("click", function () {
    if (chartDiv.innerHTML == "") { //Avoids overwriting chart after user has first seen it
        getData("latest", [""]);

        setTimeout(() => { buildChart(); setupYearSelection(); setupFundSelection(); }, 250);
    }
});

//Gather relevant data
function getData(selectedYear, ignoredFunds) {
    $.getJSON("Resources/dev_test.dat", data, function (data) {
        uniqueAttributes = getUniqueAttributes(data);
        chartData = [['IFA', 'Market Share']]; //Setup 2d array for chart

        if (selectedYear === "latest") selectedYear = uniqueAttributes.get("Years")[0]; //Default value is first year

        var salesTotal = calculateOverallTotal(data, selectedYear, ignoredFunds);

        for (var i = 0; i < uniqueAttributes.get("ifas").length; i++) { //For each unique IFA
            var marketShare = 0;

            var currentIFAData = data.filter(function (obj) { //Get IFAs data
                return obj.ifa === uniqueAttributes.get("ifas")[i] && obj.year === selectedYear;
            });

            //For each row of data for this IFA calculated the total sales
            for (var j = 0; j < currentIFAData.length; j++) {
                if ($.inArray(currentIFAData[j].fund, ignoredFunds) == -1) {
                    marketShare += parseInt(currentIFAData[j].sales);
                }
            }

            marketShare = (marketShare / salesTotal) * 100; //Calculate market share

            console.log("Market Share for: " + uniqueAttributes.get("ifas")[i] + " is " + marketShare);

            //Must convert original 1D array into 2D array to store this value.
            chartData.push([uniqueAttributes.get("ifas")[i], marketShare]);
        }

        console.log(chartData);
    }).fail(function () {
        console.log("error in retrieving data from JSON file!");
    });
}

function buildChart() {
    picasso.chart({
        element: chartDiv,
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

//Function to setup selection box for year
function setupYearSelection() {
    var targetDiv = document.getElementById("pie-year-selection");
    var newSelect = document.createElement("select"); //Setup select box
    newSelect.setAttribute('class', 'lui-select');
    newSelect.setAttribute('id', 'year-selection');

    for (var i = 0; i < uniqueAttributes.get("Years").length; i++) { //Add each unique year to the options
        var currentYear = uniqueAttributes.get("Years")[i]; //Current year in array
        newSelect.innerHTML += '<option value="' + currentYear + '">' + currentYear + '</option>'
    }

    newSelect.addEventListener("change", recalculate); //Add a change listener, triggered when option is changed
    //targetDiv.innerHTML = ""; //Ensure multiple selects aren't added when page is revisted
    targetDiv.appendChild(newSelect);
}

//Function to setup checkboxes for fund selection
function setupFundSelection() {
    var targetDiv = document.getElementById("pie-fund-selection");
    //targetDiv.innerHTML = ""; //Empty target div, to avoid repeated checkboxes

    for (var i = 0; i < uniqueAttributes.get("Funds").length; i++) { //Add each fund as a checkbox
        var currentFund = uniqueAttributes.get("Funds")[i];

        var newCheckbox = document.createElement("label");
        newCheckbox.setAttribute('class', 'lui-checkbox');
        newCheckbox.innerHTML += '<input class="lui-checkbox__input" type="checkbox" id="' + currentFund + '" checked /><div class="lui-checkbox__check-wrap"><span class="lui-checkbox__check"></span><span class="lui-checkbox__check-text">' + currentFund + '</span></div>';

        targetDiv.appendChild(newCheckbox); //Add checkbox to div

        //Add a listener to trigger recalculate method every time something is toggled
        targetDiv.getElementsByTagName("input")[i].addEventListener("click", recalculate);
    }
}

//Function to recall related methods to rerender the chart with new data
function recalculate() {
    var selectedYear = $("#year-selection").children("option:selected").val();
    var fundDiv = document.getElementById("pie-fund-selection");

    var ignoredFunds = [];

    //Find unchecked boxes for fund selection, these will be ignored
    for (var i = 0; i < uniqueAttributes.get("Funds").length; i++) {
        if (!fundDiv.getElementsByTagName("input")[i].checked) {
            ignoredFunds.push(uniqueAttributes.get("Funds")[i]);
        }
    }

    console.log("selected: " + selectedYear);
    console.log("ignored funds: " + ignoredFunds);

    getData(selectedYear, ignoredFunds); //Refresh data using 'new' selections

    setTimeout(() => { buildChart(); }, 250); //Render the chart
}
