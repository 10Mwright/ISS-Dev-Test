var data,
  chartData = [];
var uniqueAttributes = new Map();
var chartDiv = document.getElementById("pie").querySelector("#piechart");

//Triggered when Pie Chart tab button is clicked, this is to allow the chart to render
//as on initial page load the pie chart div is set to hidden.
document
  .getElementById("chart-tabs")
  .querySelector("#pie-tab")
  .addEventListener("click", function () {
    if (chartDiv.innerHTML == "") {
      //Avoids overwriting chart after user has first seen it
      getData("latest", [""]);

      setTimeout(() => {
        var defaultYear = uniqueAttributes.get("Years")[0]; //Default year is first in array
        var defaultFunds = uniqueAttributes.get("Funds"); //Default funds (all)
        buildChart(defaultYear, defaultFunds);
        buildTable();
        setupYearSelection();
        setupFundSelection();
      }, 250);
    }
  });

//Gather relevant data
function getData(selectedYear, ignoredFunds) {
  $.getJSON("Resources/dev_test.dat", data, function (data) {
    uniqueAttributes = getUniqueAttributes(data);
    chartData = [["IFA", "Market Share"]]; //Setup 2d array for chart

    if (selectedYear === "latest")
      selectedYear = uniqueAttributes.get("Years")[0]; //Default value is first year

    var salesTotal = calculateOverallTotal(data, selectedYear, ignoredFunds);

    for (var i = 0; i < uniqueAttributes.get("ifas").length; i++) {
      //For each unique IFA
      var marketShare = 0;

      var currentIFAData = data.filter(function (obj) {
        //Get Relevant Data for each IFA
        return (
          obj.ifa === uniqueAttributes.get("ifas")[i] &&
          obj.year === selectedYear &&
          $.inArray(obj.fund, ignoredFunds) == -1
        );
      });

      currentIFAData.forEach((element) => {
        //For each row of relevant data total up sales
        marketShare += parseFloat(element.sales);
      });

      //Market Share = sales / total sales * 100
      marketShare = (marketShare / salesTotal) * 100; //Calculate market share

      console.log(
        "Market Share for: " +
          uniqueAttributes.get("ifas")[i] +
          " is " +
          marketShare
      );

      //Must convert original 1D array into 2D array to store this value.
      chartData.push([uniqueAttributes.get("ifas")[i], marketShare]);
    }

    console.log(chartData);
  }).fail(function () {
    console.log("error in retrieving data from JSON file!");
  });
}

//Function that builds Picasso.js chart
function buildChart(chartYear, funds) {
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
          data: { extract: { field: "IFA" } },
          type: "color",
        },
      },
      components: [
        {
          type: "legend-cat",
          scale: "c",
        },
        {
          type: "text",
          text:
            "Market Share for year " + chartYear + " of select Funds by IFA",
          dock: "top",
          layout: { displayOrder: 2 },
          style: {
            text: {
              fontSize: "150%",
            },
          },
        },
        {
          type: "text",
          text: "Funds Included: " + funds,
          dock: "top",
          layout: { displayOrder: 1 },
        },
        {
          key: "arcs",
          type: "pie",
          layout: { displayOrder: 1 },
          data: {
            extract: {
              field: "IFA",
              props: {
                share: { field: "Market Share" },
              },
            },
          },
          settings: {
            slice: {
              arc: { ref: "share" },
              fill: { scale: "c" },
              outerRadius: () => 0.9,
              strokeWidth: 1,
              stroke: "rgba(255, 255, 255, 0.5)",
            },
          },
        },
        {
          type: "labels",
          layout: {
            displayOrder: 2,
          },
          settings: {
            sources: [
              {
                component: "arcs",
                selector: "path",
                strategy: {
                  type: "slice",
                  settings: {
                    direction: "horizontal",
                    fontFamily: "Helvetica",
                    fontSize: 14,
                    labels: [
                      {
                        label({ data }) {
                          console.log("label: " + data.share.label);
                          return data
                            ? //Formatting label to be more readable
                              parseFloat(data.share.label / 100).toLocaleString(
                                "en",
                                {
                                  style: "percent",
                                  minimumFractionDigits: 2,
                                }
                              )
                            : "";
                        },
                        placements: [{ position: "into", fill: "#fff" }],
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      ],
    },
  });
}

//Function to build table with data
function buildTable() {
  var table = $("#ms-table");
  table.empty(); //Empty table to avoid duplicate values

  var titleRow = document.createElement("tr");
  titleRow.innerHTML =
    '<th class="ms-table-header">IFA</th><th class="ms-table-header">Market Share</th>';
  table.append(titleRow); //Adding title row to table

  for (var i = 1; i < chartData.length; i++) {
    //For each row of chart data
    var newRow = document.createElement("tr");
    newRow.setAttribute("class", "ms-table-row");

    var percentage = (parseFloat(chartData[i][1]) / 100).toLocaleString("en", {
      style: "percent",
      minimumFractionDigits: 2,
    }); //Conversion to percentage format

    newRow.innerHTML =
      '<td class="ms-table-cell">' +
      chartData[i][0] +
      '</td><td class="ms-table-cell">' +
      percentage +
      "</td>"; //Add values to new row
    table.append(newRow); //Add to table
  }
}

//Function to setup selection box for year
function setupYearSelection() {
  var targetDiv = $("#pie-year-selection");
  var newSelect = document.createElement("select"); //Setup select box
  newSelect.setAttribute("class", "lui-select");
  newSelect.setAttribute("id", "year-selection");

  for (var i = 0; i < uniqueAttributes.get("Years").length; i++) {
    //Add each unique year to the options
    var currentYear = uniqueAttributes.get("Years")[i]; //Current year in array
    newSelect.innerHTML +=
      '<option value="' + currentYear + '">' + currentYear + "</option>";
  }

  newSelect.addEventListener("change", recalculate); //Add a change listener, triggered when option is changed
  //targetDiv.innerHTML = ""; //Ensure multiple selects aren't added when page is revisted
  targetDiv.append(newSelect);
}

//Function to setup checkboxes for fund selection
function setupFundSelection() {
  var targetDiv = document.getElementById("pie-fund-selection");
  //targetDiv.innerHTML = ""; //Empty target div, to avoid repeated checkboxes

  for (var i = 0; i < uniqueAttributes.get("Funds").length; i++) {
    //Add each fund as a checkbox
    var currentFund = uniqueAttributes.get("Funds")[i];

    var newCheckbox = document.createElement("label");
    newCheckbox.setAttribute("class", "lui-checkbox");
    newCheckbox.innerHTML +=
      '<input class="lui-checkbox__input" type="checkbox" id="' +
      currentFund +
      '" checked /><div class="lui-checkbox__check-wrap"><span class="lui-checkbox__check"></span><span class="lui-checkbox__check-text">' +
      currentFund +
      "</span></div>";

    targetDiv.appendChild(newCheckbox); //Add checkbox to div
  }

  //Below adapted from https://stackoverflow.com/a/42001152
  $("#pie-fund-selection :input").on("change", function (e) {
    if ($("#pie-fund-selection :input:checked").length == 0 && !this.checked) {
      this.checked = true;
      recalculate();
    } else {
      recalculate();
    }
  }); //Add listeners to checkboxes
}

//Function to recall related methods to rerender the chart with new data
function recalculate() {
  var selectedYear = $("#year-selection").children("option:selected").val();
  var fundDiv = document.getElementById("pie-fund-selection");

  var ignoredFunds = [];
  var includedFunds = [];

  //Find unchecked boxes for fund selection, these will be ignored
  for (var i = 0; i < uniqueAttributes.get("Funds").length; i++) {
    if (!fundDiv.getElementsByTagName("input")[i].checked) {
      ignoredFunds.push(uniqueAttributes.get("Funds")[i]);
    } else {
      includedFunds.push(uniqueAttributes.get("Funds")[i]); //Add to included funds
    }
  }

  console.log("selected: " + selectedYear);
  console.log("ignored funds: " + ignoredFunds);

  getData(selectedYear, ignoredFunds); //Refresh data using 'new' selections

  setTimeout(() => {
    buildChart(selectedYear, includedFunds);
    buildTable();
  }, 250); //Render the chart
}
