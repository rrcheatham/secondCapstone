

function callExpenseAPI(callback) {
    var username = localStorage.getItem('user');
    console.log(username);
    const settings = {
        url: '/expenses',
        contentType: 'application/json',
        data: {
            username: username
        },
        type: 'GET',
        dataType: 'json',
        success: callback
    };
    $.ajax(settings);
}

function intitalGraphBuild(jsonData) {
    setDropDownToCurrMonth();
    buildMonthVsBudget(jsonData);
    //callExpenseAPI(buildMonthVsBudget);
    buildMonthlyPieChart(jsonData);
    //callExpenseAPI(buildMonthlyPieChart);
    build12MonthGraph(jsonData);
    //callExpenseAPI(build12MonthGraph);
    build12MonthTotalGraph(jsonData);
    //callExpenseAPI(build12MonthTotalGraph);
    buildDetailTable(jsonData);
    //callExpenseAPI(buildDetailTable);
}
    

function updateMonthlyGraphs() {
    document.getElementById("vs-budget").innerHTML = "";
    document.getElementById("category-chart").innerHTML = "";
    //buildMonthVsBudget("/mock-data.json");
    callExpenseAPI(buildMonthVsBudget);
    //buildMonthlyPieChart("/mock-data.json");
    callExpenseAPI(buildMonthlyPieChart);
    callExpenseAPI(buildDetailTable); 
}

function selectMonthListener() {
    var monthSelect = document.getElementById("month-graph");
    monthSelect.onchange = function() {
        updateMonthlyGraphs();
    }
}

function sendExpenseToAPI() {
    //send push request to API for new expense
}

function expenseSubmitListener() {
    //event listener for submit on new expense
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

//var myMockDataMonthly = dimple.filterData("/mock-data.json", "month", "January");

function buildMonthVsBudget(jsonData) {
    console.log(jsonData);
    var selectedMonth = document.getElementById("month-graph").value;
    var svg = dimple.newSvg("#vs-budget", 590, 400);
    d3.json(jsonData, function (data) {
       // data = jQuery.grep(data, function(expense, i) {
        //    return expense.month === selectedMonth;
        data = dimple.filterData(data, "month", selectedMonth);
        var myChart = new dimple.chart(svg, data);
        myChart.setBounds(80, 30, 480, 330)
        myChart.addMeasureAxis("x", "amount");
        myChart.addCategoryAxis("y", ["category", "type"]);
        myChart.addSeries("type", dimple.plot. bar);
        myChart.addLegend(60, 10, 510, 20, "right");
        myChart.draw();
    });
}

// actuals break-down graph

function buildMonthlyPieChart(jsonData) {
    var selectedMonth = document.getElementById("month-graph").value;
    var svg = dimple.newSvg("#category-chart", 590, 400);
    d3.json(jsonData, function (data) {
        data = jQuery.grep(data, function(expense, i) {
            return expense.month === selectedMonth && expense.type === "actual";
        });
        var myChart = new dimple.chart(svg, data);
        myChart.setBounds(20, 20, 460, 360)
        myChart.addMeasureAxis("p", "amount");
        myChart.addSeries("category", dimple.plot.pie);
        myChart.addLegend(500, 20, 90, 300, "left");
        myChart.draw();
    });
}

//monthly expense graph

function build12MonthGraph(jsonData) {

    var svg = dimple.newSvg("#monthly-graph", 590, 400);
    d3.json(jsonData, function (data) {
        data = jQuery.grep(data, function(expense, i) {
            return expense.type === "actual";
        });
     // Get a unique list of dates
        var months = dimple.getUniqueValues(data, "month");

    // Set the bounds for the charts
        var row = 0,
            col = 0,
            top = 25,
            left = 60,
            inMarg = 15,
            width = 115,
            height = 90,
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
                    .style("opacity", 0.2);
                    //.text(chartData[0].Month.substring(0, 3));
            
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
    });
}

// monthly total graph

function build12MonthTotalGraph(jsonData) {
    var svg = dimple.newSvg("#monthly-total", 590, 420);
    d3.json(jsonData, function (data) {
    var myChart = new dimple.chart(svg, data);
    myChart.setBounds(60, 45, 510, 315)
    myChart.addCategoryAxis("x", ["month", "type"]).addOrderRule(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
    myChart.addMeasureAxis("y", "amount");
    myChart.addSeries("type", dimple.plot.bar);
    myChart.addLegend(200, 10, 380, 20, "right");
    myChart.draw();
    });
}

// detailed expense table

function buildDetailTable(jsonData) {
    var selectedMonth = document.getElementById("month-graph").value;
    $container = $("#details").find("tbody");
    d3.json(jsonData, function (data) {
        var data = jQuery.grep(data, function(expense, i) {
            return expense.month === selectedMonth && expense.type === "actual";
        });
        for (var i = 0; i < data.length; i++) {
            $container.append("<tr><td>" + data[i].month + "</td><td>" + data[i].category + "</td><td>" + data[i].amount + "</td><td><button id='" + data[i].id + "'>Delete</button></td></tr>")
        ;}   
    })
}



callExpenseAPI(intitalGraphBuild);
$(selectMonthListener);
