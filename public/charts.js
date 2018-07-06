

function callExpenseAPI(callback) {
    var username = localStorage.getItem('user');
    const settings = {
        url: '/expenses',
        contentType: 'application/json',
        data: {
            username: username
        },
        type: 'GET',
        dataType: 'json',
        cache: false,
        success: callback
    };
    $.ajax(settings);
}

function intitalGraphBuild(jsonData) {
    setDropDownToCurrMonth();
    buildMonthVsBudget(jsonData.expenses);
    buildMonthlyPieChart(jsonData.expenses);
    build12MonthGraph(jsonData.expenses);
    build12MonthTotalGraph(jsonData.expenses);
    buildDetailTable(jsonData.expenses);
    populateBudgetFields(jsonData.expenses);
}

function rebuildMonthlyGraphs(jsonData) {
    buildMonthVsBudget(jsonData.expenses);
    buildMonthlyPieChart(jsonData.expenses);
    buildDetailTable(jsonData.expenses);
    populateBudgetFields(jsonData.expenses);
}
    

function updateMonthlyGraphs() {
    document.getElementById("vs-budget").innerHTML = "";
    document.getElementById("category-chart").innerHTML = "";
    document.getElementById("table-body").innerHTML = "";
    callExpenseAPI(rebuildMonthlyGraphs);
}

function populateBudgetFields(jsonData) {
    var budgetData = dimple.filterData(jsonData, "type", "budget");
    var shopping = dimple.filterData(budgetData, "category", "shopping");
    document.getElementById('shopping-budget').value = shopping[0].amount;
    document.getElementById('shopping-budget').setAttribute('class', shopping[0].id);
    var housing = dimple.filterData(budgetData, "category", "housing");
    document.getElementById('housing-budget').value = housing[0].amount;
    document.getElementById('housing-budget').setAttribute('class', housing[0].id);
    var transportation = dimple.filterData(budgetData, "category", "transportation");
    document.getElementById('transportation-budget').value = transportation[0].amount;
    document.getElementById('transportation-budget').setAttribute('class', transportation[0].id);
    var healthcare = dimple.filterData(budgetData, "category", "healthcare");
    document.getElementById('healthcare-budget').value = healthcare[0].amount;
    document.getElementById('healthcare-budget').setAttribute('class', healthcare[0].id);
    var other = dimple.filterData(budgetData, "category", "other");
    document.getElementById('other-budget').value = other[0].amount;
    document.getElementById('other-budget').setAttribute('class', other[0].id);
}

function selectMonthListener() {
    var monthSelect = document.getElementById("month-graph");
    monthSelect.onchange = function() {
        updateMonthlyGraphs();
    }
}

function sendExpenseToAPI(callback) {
    var username = localStorage.getItem('user');
    var category = document.getElementById('category').value;
    var month = document.getElementById('month-expense').value;
    var amount = document.getElementById('expense-amt').value;
    var formData = {
        category: category,
        amount: amount,
        month: month,
        type: 'actual',
        username: username
    };
    const settings = {
        url: '/expenses/add',
        method: 'POST',
        data: JSON.stringify(formData),
        contentType: 'application/json',
        //dataType: 'json',
        success: callback
    };
    $.ajax(settings);
}


function expenseSubmitListener() {
    $('#expense-form').submit(event => {
        event.preventDefault();
        sendExpenseToAPI(expenseAdded);
    })
}

function expenseAdded() {
    document.getElementById('category').value = '';
    document.getElementById('month-expense').value = 'Month...'; 
    document.getElementById('expense-amt').value = '';
    window.alert('Expense submitted');
    updateMonthlyGraphs();
}


function updateBudgetAPI(id, amt, callback) {
    var formData = {
        amt: amt
    };
    var settings = {
        url: `/expenses/${id}`,
        method: 'PUT',
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: callback
    };
    $.ajax(settings);
}

function budgetShoppingSubmitListener() {
    var id = document.getElementById('shopping-budget').getAttribute('class');
    var amt = document.getElementById('shopping-budget').value;
    $('#shopping-div').submit( event => {
        event.preventDefault();
        updateBudgetAPI(id, amt, sucessfulBudgetUpdate);
    })
}

function budgetHousingSubmitListener() {
    var id = document.getElementById('housing-budget').getAttribute('class');
    var amt = document.getElementById('housing-budget').value;
    $('#housing-div').submit( event => {
        event.preventDefault();
        updateBudgetAPI(id, amt, sucessfulBudgetUpdate);
    })
}

function budgetTransportationSubmitListener() {
    var id = document.getElementById('transportation-budget').getAttribute('class');
    var amt = document.getElementById('transportation-budget').value;
    $('#transportation-div').submit( event => {
        event.preventDefault();
        updateBudgetAPI(id, amt, sucessfulBudgetUpdate);
    })
}

function budgetHealthcareSubmitListener() {
    var id = document.getElementById('healthcare-budget').getAttribute('class');
    var amt = document.getElementById('healthcare-budget').value;
    $('#healthcare-div').submit( event => {
        event.preventDefault();
        updateBudgetAPI(id, amt, sucessfulBudgetUpdate);
    })
}

function budgetOtherSubmitListener() {
    var id = document.getElementById('other-budget').getAttribute('class');
    var amt = document.getElementById('other-budget').value;
    $('#other-div').submit( event => {
        event.preventDefault();
        updateBudgetAPI(id, amt, sucessfulBudgetUpdate);
    })
}

function sucessfulBudgetUpdate() {
    window.alert('Budget Submitted');
    updateMonthlyGraphs();
}

function deleteActualAPI(id, callback) {
    var settings = {
        url: `/expenses/${id}`,
        method: 'DELETE',
        contentType: 'application/json',
        success: callback
    }
    $.ajax(settings);
}

function setDropDownToCurrMonth() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
    var d = new Date();
    var currMonth = d.getMonth();
    var currMonthName = monthNames[currMonth];
    document.getElementById("month-graph").value = currMonthName;
}

//vs-budget graph

function buildMonthVsBudget(jsonData) {
    var selectedMonth = document.getElementById("month-graph").value;
    var svg = dimple.newSvg("#vs-budget", 350, 238);
    let data = dimple.filterData(jsonData, "month", selectedMonth);
    var myChart = new dimple.chart(svg, data);
    myChart.setBounds("20%", "7.5%", "75%", "82.5%")
    myChart.addMeasureAxis("x", "amount");
    myChart.addCategoryAxis("y", ["category", "type"]);
    myChart.addSeries("type", dimple.plot. bar);
    myChart.addLegend("10%", "2.5%", "86%", "5%", "right");
    myChart.draw();
}

// actuals break-down graph

function buildMonthlyPieChart(jsonData) {
    var selectedMonth = document.getElementById("month-graph").value;
    var svg = dimple.newSvg("#category-chart", 350, 238);
    let data = dimple.filterData(jsonData, "month", selectedMonth);
    var myChart = new dimple.chart(svg, data);
    myChart.setBounds("3.4%", "5%", "78%", "90%")
    myChart.addMeasureAxis("p", "amount");
    myChart.addSeries("category", dimple.plot.pie);
    myChart.addLegend("77%", "5%", "15.25%", "75%", "left");
    myChart.draw();
}

//monthly expense graph

function build12MonthGraph(jsonData) {

    var svg = dimple.newSvg("#monthly-graph", 350, 300);
    let data = dimple.filterData(jsonData, "type", "actual");
     // Get a unique list of dates
        var months = dimple.getUniqueValues(data, "month");

    // Set the bounds for the charts
        var row = 0,
            col = 0,
            top = 15,
            left = 35,
            inMarg = 15,
            width = 60,
            height = 55,
            totalWidth = parseFloat(svg.attr("width"));

    // Pick the latest 12 dates
    // months = months.slice(months.length - 12);

    // Draw a chart for each of the 12 dates
        months.forEach(function (month) {
        
        // Wrap to the row above
            if (left + ((col + 1) * (width + inMarg)) > totalWidth) {
                row += 1;
                col = 0;
            }
        
        // Filter for the month in the iteration
            var chartData = dimple.filterData(data, "month", month);
    
            
        // Use d3 to draw a text label for the month
            svg
                .append("text")
                    .attr("x", left + (col * (width + inMarg)) + (width / 2))
                    .attr("y", top + (row * (height + inMarg)) + (height / 2) + 12)
                    .style("font-family", "sans-serif")
                    .style("text-anchor", "middle")
                    .style("font-size", "28px")
                    .style("opacity", 0.5)
                    .text(chartData[0].month.substring(0, 3));
            
            // Create a chart at the correct point in the trellis
            var myChart = new dimple.chart(svg, chartData);
            myChart.setBounds(
                left + (col * (width + inMarg)),
                top + (row * (height + inMarg)),
                width,
                height);
            
            // Add x and fix ordering so that all charts are the same
            var x = myChart.addCategoryAxis("x", "category");
            x.addOrderRule(["shopping", "housing", "transportation", "healthcare", "other"]);
            
            // Add y and fix scale so that all charts are the same
            var y = myChart.addMeasureAxis("y", "amount");
            y.overrideMax = 1500;
            
            // Draw the bars.  Passing null here would draw all bars with
            // the same color.  Passing owner second colors by owner, which
            // is normally bad practice in a bar chart but works in a trellis.
            // Month is only passed here so that it shows in the tooltip.
            myChart.addSeries(["Month", "category"], dimple.plot.bar);

            // Draw the chart
            myChart.draw();

            // Once drawn we can access the shapes
            // If this is not in the first column remove the y text
            if (col > 0) {
                y.shapes.selectAll("text").remove();
            }
            // If this is not in the last row remove the x text
            if (row < 2) {
                x.shapes.selectAll("text").remove();
            }
            // Remove the axis labels
            y.titleShape.remove();
            x.titleShape.remove();

            // Move to the next column
            col += 1;

        }, this);
}

// monthly total graph

function build12MonthTotalGraph(jsonData) {
    var svg = dimple.newSvg("#monthly-total", 350, 300);
    var myChart = new dimple.chart(svg, jsonData);
    myChart.setBounds("10%", "10%", "86%", "70%")
    myChart.addCategoryAxis("x", ["month", "type"]).addOrderRule(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
    myChart.addMeasureAxis("y", "amount");
    myChart.addSeries("type", dimple.plot.bar);
    myChart.addLegend("30%", "2%", "64%", "4.5%", "right");
    myChart.draw();
}

// detailed expense table

function buildDetailTable(jsonData) {
    var selectedMonth = document.getElementById("month-graph").value;
    $container = $("#details").find("tbody");
    let data = dimple.filterData(jsonData, "month", selectedMonth);
        for (var i = 0; i < data.length; i++) {
            $container.append(`<tr><td>${data[i].month}</td><td>${data[i].category}</td><td>${data[i].amount}</td><td><button id=
            '${data[i].id}' onClick="deleteActualAPI('${data[i].id}', updateMonthlyGraphs);">Delete</button></td></tr>`)
        ;}   
}



callExpenseAPI(intitalGraphBuild);
$(selectMonthListener);
$(expenseSubmitListener);
$(budgetShoppingSubmitListener);
$(budgetHousingSubmitListener);
$(budgetTransportationSubmitListener);
$(budgetHealthcareSubmitListener);
$(budgetOtherSubmitListener);

