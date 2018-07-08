
//call to expense API for graph and table rendering

function callExpenseAPI(callback) {
    var username = localStorage.getItem('user');
    const settings = {
        url: '/expenses',
        contentType: 'application/json',
        headers: {"Authorization": 'Bearer ' + localStorage.getItem('token')},
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

//initial build of graphs and tables triggered when page loads

function intitalGraphBuild(jsonData) {
    setDropDownToCurrMonth();
    buildMonthVsBudget(jsonData.expenses);
    buildMonthlyPieChart(jsonData.expenses);
    build12MonthGraph(jsonData.expenses);
    build12MonthTotalGraph(jsonData.expenses);
    buildDetailTable(jsonData.expenses);
    populateBudgetFields(jsonData.expenses);
}

//rebuild of monthly graphs and table based on listeners

function rebuildMonthlyGraphs(jsonData) {
    buildMonthVsBudget(jsonData.expenses);
    buildMonthlyPieChart(jsonData.expenses);
    buildDetailTable(jsonData.expenses);
    populateBudgetFields(jsonData.expenses);
}
    
// clears out SVG canvases before rebuilding monthly graphs

function updateMonthlyGraphs() {
    document.getElementById("vs-budget").innerHTML = "";
    document.getElementById("category-chart").innerHTML = "";
    document.getElementById("table-body").innerHTML = "";
    callExpenseAPI(rebuildMonthlyGraphs);
}

//populates budget fields with amounts based on selected month

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

//listener for change to drop down of selected month

function selectMonthListener() {
    var monthSelect = document.getElementById("month-graph");
    monthSelect.onchange = function() {
        updateMonthlyGraphs();
    }
}

//submits new expenses to expense API 

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
        headers: {"Authorization": 'Bearer ' + localStorage.getItem('token')},
        data: JSON.stringify(formData),
        contentType: 'application/json',
        //dataType: 'json',
        success: callback
    };
    $.ajax(settings);
}

//listener for submission of new expenses

function expenseSubmitListener() {
    $('#expense-form').submit(event => {
        event.preventDefault();
        sendExpenseToAPI(expenseAdded);
    })
}

//call back for submission of new expense, clears fields and updates graphs

function expenseAdded() {
    document.getElementById('category').value = '';
    document.getElementById('month-expense').value = 'Month...'; 
    document.getElementById('expense-amt').value = '';
    window.alert('Expense submitted');
    updateMonthlyGraphs();
}

//Submission to API of changes to monthly budget totals

function updateBudgetAPI(id, amt, callback) {
    var formData = {
        id: id,
        amount: amt
    };
    var settings = {
        url: `/expenses/${id}`,
        method: 'PUT',
        headers: {"Authorization": 'Bearer ' + localStorage.getItem('token')},
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: callback
    };
    $.ajax(settings);
}

//Listeners for each budget category submit

function budgetShoppingSubmitListener() {
    $('#shopping-div').submit( event => {
        event.preventDefault();
        var id = document.getElementById('shopping-budget').getAttribute('class');
        var amt = document.getElementById('shopping-budget').value;
        updateBudgetAPI(id, amt, sucessfulBudgetUpdate);
    })
}

function budgetHousingSubmitListener() {
    $('#housing-div').submit( event => {
        event.preventDefault();
        var id = document.getElementById('housing-budget').getAttribute('class');
        var amt = document.getElementById('housing-budget').value;
        updateBudgetAPI(id, amt, sucessfulBudgetUpdate);
    })
}

function budgetTransportationSubmitListener() {
    $('#transportation-div').submit( event => {
        event.preventDefault();
        var id = document.getElementById('transportation-budget').getAttribute('class');
        var amt = document.getElementById('transportation-budget').value;
        updateBudgetAPI(id, amt, sucessfulBudgetUpdate);
    })
}

function budgetHealthcareSubmitListener() {
    $('#healthcare-div').submit( event => {
        event.preventDefault();
        var id = document.getElementById('healthcare-budget').getAttribute('class');
        var amt = document.getElementById('healthcare-budget').value;
        updateBudgetAPI(id, amt, sucessfulBudgetUpdate);
    })
}

function budgetOtherSubmitListener() {
    $('#other-div').submit( event => {
        event.preventDefault();
        var id = document.getElementById('other-budget').getAttribute('class');
        var amt = document.getElementById('other-budget').value;
        updateBudgetAPI(id, amt, sucessfulBudgetUpdate);
    })
}

//callback for submission of updated budgets

function sucessfulBudgetUpdate() {
    window.alert('Budget Submitted');
    updateMonthlyGraphs();
}

//call to API for deletion of actual from detailed table

function deleteActualAPI(id, callback) {
    var settings = {
        url: `/expenses/${id}`,
        method: 'DELETE',
        headers: {"Authorization": 'Bearer ' + localStorage.getItem('token')},
        contentType: 'application/json',
        success: callback
    }
    $.ajax(settings);
}

//sets drop down to current month called as part of intial graph build

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

        var months = dimple.getUniqueValues(data, "month");

        var row = 0,
            col = 0,
            top = 15,
            left = 35,
            inMarg = 15,
            width = 60,
            height = 55,
            totalWidth = parseFloat(svg.attr("width"));

        months.forEach(function (month) {
            if (left + ((col + 1) * (width + inMarg)) > totalWidth) {
                row += 1;
                col = 0;
            }
            var chartData = dimple.filterData(data, "month", month);
            svg
                .append("text")
                    .attr("x", left + (col * (width + inMarg)) + (width / 2))
                    .attr("y", top + (row * (height + inMarg)) + (height / 2) + 12)
                    .style("font-family", "sans-serif")
                    .style("text-anchor", "middle")
                    .style("font-size", "28px")
                    .style("opacity", 0.5)
                    .text(chartData[0].month.substring(0, 3));
            var myChart = new dimple.chart(svg, chartData);
            myChart.setBounds(
                left + (col * (width + inMarg)),
                top + (row * (height + inMarg)),
                width,
                height);
            var x = myChart.addCategoryAxis("x", "category");
            x.addOrderRule(["shopping", "housing", "transportation", "healthcare", "other"]);
            var y = myChart.addMeasureAxis("y", "amount");
            y.overrideMax = 1500;
            
            myChart.addSeries(["Month", "category"], dimple.plot.bar);
            myChart.draw();
            if (col > 0) {
                y.shapes.selectAll("text").remove();
            }
            if (row < 2) {
                x.shapes.selectAll("text").remove();
            }
            y.titleShape.remove();
            x.titleShape.remove();
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

