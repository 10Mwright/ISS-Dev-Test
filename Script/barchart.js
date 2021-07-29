var data = [];
var uniqueYears, uniqueIFA = [];

//$.when(getData()).then(buildChart);
getData([""], [""]);

setTimeout(() => { buildChart(); setupIFASelection(); }, 250); //Slight delay to avoid undefined data

//Gather relevant data
//Args: 1st Arg is an array of IFAs to avoid, 2nd is an array of Funds to avoid
function getData(ignoredIfas, ignoredFunds) {
    $.getJSON("Resources/dev_test.dat", data, function (data) {
        uniqueYears = findYears(data);
        uniqueIFA = findIFAS(data);

        console.log("Array of unique Years: " + uniqueYears);

        //For each unique year, go through the data and total up its sales
        for (var i = 1; i < uniqueYears.length; i++) {
            var total = 0;

            var currentYearData = data.filter(function (obj) {
                return obj.year === uniqueYears[i][0];
            });

            //For each row of data for this year add to year's total sales
            for (var j = 0; j < currentYearData.length; j++) {
                //console.log(currentYearData[j].id + currentYearData[j].ifa + currentYearData[j].fund);
                if ($.inArray(currentYearData[j].ifa, ignoredIfas) == -1) { //Remove any ignored IFAS
                    if ($.inArray(currentYearData[j].fund, ignoredFunds) == -1) { //Remove any ignored funds
                        total += parseInt(currentYearData[j].sales);
                    }
                }
            }

            console.log("Sales TOTAL FOR " + uniqueYears[i][0] + ": " + total);
            uniqueYears[i][1] = total; //Commit sales total to 2d array
        }

        console.log("Array of unique Years: " + uniqueYears);

    }).fail(function () {
        console.log("error in retrieving data from JSON file!");
    });
}

function buildChart() {
    picasso.chart({
        element: document.getElementById('charting').querySelector('#barchart'),
        data: [
            {
                type: 'bar',
                data: uniqueYears,
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
                    type: 'axis',
                    scale: 'y',
                    dock: 'left'
                },
                {
                    type: 'axis',
                    scale: 't',
                    dock: 'bottom'
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
                }]
        }
    });
}

//Function to create checkboxes and add listeners
function setupIFASelection() {
    var targetDiv = document.getElementById("bar-ifa-selection");

    for(var i = 0; i < uniqueIFA.length; i++) { //For each unique IFA
        var newCheckbox = document.createElement("label"); //New DOM element
        newCheckbox.setAttribute('class', 'lui-checkbox'); //Add lui class to new element
        newCheckbox.innerHTML += '<input class="lui-checkbox__input" type="checkbox" id="' + uniqueIFA[i] + '" checked /><div class="lui-checkbox__check-wrap"><span class="lui-checkbox__check"></span><span class="lui-checkbox__check-text">' + uniqueIFA[i] + '</span></div>';

        targetDiv.appendChild(newCheckbox); //Add new checkbox element to div element

        targetDiv.getElementsByTagName("input")[i].addEventListener("click", recalculate); //Add onclick listener to new checkbox
    }
}

//Function to read unchecked boxes and recalculate totals on only checked elements.
function recalculate() {
    var targetDiv = document.getElementById("bar-ifa-selection");
    var ignoredIFA = [];

    for(var i = 0; i < uniqueIFA.length; i++) {
        if(!targetDiv.getElementsByTagName("input")[i].checked)  {
            ignoredIFA.push(uniqueIFA[i]);
        }
    }

    console.log("ignored ifas: " + ignoredIFA);

    getData(ignoredIFA, [""]);
    
    setTimeout(() => { buildChart(); }, 250); //Slight delay to avoid undefined data
}