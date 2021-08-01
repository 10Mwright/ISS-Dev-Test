//Function to return an array of unique IFAs mentioned in the data
//Source used: https://stackoverflow.com/questions/7431618/jquery-finding-distinct-values-in-object-array
function findIFAS(data) {
  var duplicateIFA = {};
  var uniqueIFA = [];

  $.each(data, function (i, el) {
    if (!duplicateIFA[el.ifa]) {
      duplicateIFA[el.ifa] = true;
      uniqueIFA.push(el.ifa);
    }
  });

  return uniqueIFA;
}

//Function to return an array of unique years in the data
//Source used: https://stackoverflow.com/questions/7431618/jquery-finding-distinct-values-in-object-array
function findYears(data) {
  var duplicateYears = {};
  var uniqueYears = [];

  $.each(data, function (i, el) {
    if (!duplicateYears[el.year]) {
      duplicateYears[el.year] = true;
      uniqueYears.push(el.year);
    }
  });

  return uniqueYears;
}

//Function to return an array of unique funds in the dat
//Source used: https://stackoverflow.com/questions/7431618/jquery-finding-distinct-values-in-object-array
function findFunds(data) {
  var duplicateFunds = {};
  var uniqueFunds = [];

  $.each(data, function (i, el) {
    if (!duplicateFunds[el.fund]) {
      duplicateFunds[el.fund] = true;
      uniqueFunds.push(el.fund);
    }
  });

  return uniqueFunds;
}

//Function to get a map of unique attributes within the data
////Source used: https://stackoverflow.com/questions/7431618/jquery-finding-distinct-values-in-object-array
function getUniqueAttributes(data) {
  var uniqueAttributes = new Map();

  uniqueAttributes.set("Years", findYears(data));
  uniqueAttributes.set("ifas", findIFAS(data));
  uniqueAttributes.set("Funds", findFunds(data));

  return uniqueAttributes;
}

//Function to return an overall total of sales, to avoid duplicate calls to above methods
function calculateOverallTotal(data, selectedYear, ignoredFunds) {
  var total = 0;

  data.forEach((element) => {
    if (element.year === selectedYear) {
      if ($.inArray(element.fund, ignoredFunds) == -1)
        total += parseInt(element.sales);
    }
  });

  return total;
}
