function timeSeriesChart() {

    console.log("timeSeriesChart called");

    // Our globalDate is unknown, until we have read the data.
    var globalDate = "Unknown";

    var title = "";
    var xAxisTitle = "";
    var xAxisSubTitle = "";
    var yAxisTitle = "";

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 20, bottom: 90, left: 70},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


    // Global control of log or normal scale. Always starts in normal
    var logScale = false;
    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    // var y = d3.scaleLog().range([height, 0]); // .domain([1,200]);

    var xAxis = d3.axisBottom()
        .scale(x);

    var yAxis = d3.axisLeft()
        .scale(y);

    // var area = d3.svg.area().x(X).y1(Y);

    // define the line function - a function that returns x and y from a single data point.
    var valueline = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.value);
        });

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    var svg = null;

    // function to set extends of axis. both start in 0
    function set_domain(maxX, maxY) {
        // Scale the range of the data
        //         x.domain(d3.extent(data, function(d) { return d.date; }));
        // y.domain([0, d3.max(data, function(d) { d.value })]);
        console.log("Set domain to " + maxX + ", " + maxY);
        // Log scale, y starts in 1
        if (logScale) {
            x.domain([-1, maxX]);
            y.domain([1, maxY]);
        } else {
            x.domain([-1, maxX]);
            y.domain([-4, maxY]);
        }
    }

    function set_domain_from_data(data) {
        console.log("Setting domain from data");
        var maxDate = 0;
        var maxValue = 0;
        data.forEach(function (c) {
            console.log("Find max values for " + c.name);
            if (!c.active) {
                console.log("Skipping inactive country " + c.name);
            } else {
                c.data.forEach(function (e) {
                    maxDate = Math.max(maxDate, e.date);
                    maxValue = Math.max(maxValue, e.value);
                })
            }
        });
        set_domain(maxDate, maxValue);
    }

    // Called whenever the user clicks a labelor toggle an axis.
    // Rescales the domain (axis) and repaints the lines.
    function rescale(data) {
        console.log("rescale");
        set_domain_from_data(data);

        // Control the duration of the transition
        var duration = 500;

        // Set up a grid - styled with .tick line
        xAxis.ticks(7).tickSize(-height, 0);//.tickFormat("");
        yAxis.ticks(7).tickSize(-width, 0);//.tickFormat("");

        // transition the domain, that is, the axis's in this case.
        yAxis.scale(y); //.tickFormat(d3.format(".0s"));;
        if (logScale) {
            yAxis.tickFormat(d3.format(".0s"));
        } else {
            yAxis.tickFormat(d3.format(""));
        }

        svg.selectAll("g.yaxis")
            .transition().duration(duration)
            .call(yAxis);

        xAxis.scale(x);
        svg.selectAll("g.xaxis")
            .transition().duration(duration)
            .call(xAxis);

        // Update all lines
        data.forEach(function (c) {
            // Hide or show the elements based on the ID
            var newOpacity = c.active ? 1 : 0;
            d3.select("#tag" + c.key.replace(/[\s,]+/g, ''))
                .transition().duration(duration)
                .attr("d", valueline(c.values))
                .style("opacity", newOpacity);
        });
    }

    // we need to massage the data. Lets do it first.
    function prepareData(data) {
        console.trace();
        // Clean data. Remove any data that is null
        // Also, pick out the global date from the Denmark entry.
        data.forEach(function (c) {
            console.log("Cleaning data for " + c.name);
            c.data = c.data.filter(function (e) {
                return e.value != null;
            })
            if (c.name == "Denmark") {
                globalDate = c.date;
            }
        });

        console.log("Found global date to " + globalDate);

        // Our data is almost already a "dataNest". Lets adapt to the nest format for the next lines, and set active
        data.forEach(function (c) {
            c.key = c.name;
            c.values = c.data;
            c.active = true;
        });
        return data;

    }

    function chart(selection) {
        console.log("in chart");
        // Get the data and create the graph from it.
        selection.each(function (data) {

/*
            // Select the svg element, if it exists.
            svg = d3.select(this).selectAll("svg").data([data]);

              // Otherwise, create the skeletal chart.
            var gEnter = svg.enter().append("svg").append("g");
                gEnter.append("path").attr("class", "area");
                gEnter.append("path").attr("class", "line");
                gEnter.append("g").attr("class", "x axis");

*/
            // This "almost" works. Appends stuff inside the div I though
            // we were using. Argh.
            if (svg == null) { // This won't work for repeated calls.
                svg = d3.select(this).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");
            }

/*
             // Update the outer dimensions.
            svg .attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            var g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Update the area path.
            g.select(".area")
                .attr("d", area.y0(yScale.range()[0]));
*/

            set_domain_from_data(data);

            // Add the elements to the svg graph
            // set the colour scale - this allow for 10 colors / lines
            var color = d3.scaleOrdinal(d3.schemeCategory10);

            // Loop through each country, and add the lines.
            console.log("Adding the lines");
            // Calculate space for the legend
            legendSpace = width / data.length; // spacing for legend
            data.forEach(function (d, i) {

                // This statement add the actual lines, based on the values.
                svg.append("path")
                    .attr("class", "line")
                    .style("stroke", function () { // Add the colours dynamically
                        return d.color = color(d.key);
                    })
                    .attr("id", 'tag' + d.key.replace(/[\s,]+/g, ''))
                    .attr("d", valueline(d.values));

                // This statement add a legend text for the line
                // This could be moved somewhere else, and be more "traditionel"
                svg.append("text")
                    .attr("x", (legendSpace / 2) + i * legendSpace) // spacing
                    .attr("y", height + (margin.bottom / 2) - 8)
                    .attr("class", "legend")
                    // style the legend
                    .style("fill", function () { // dynamic colours
                        return d.color = color(d.key);
                    })
                    // This section makes it interactive.
                    .on("click", function () {
                        // Determine if current line is visible
                        d.active = d.active ? false : true;
                        console.log("Status of active for " + d.key + " is " + d.active);
                        rescale(data);
                    })
                    .text(d.key);
            });


            // Set and label the X and Y axes.
            // Add the X Axis
            console.log("Adding the x axis");
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "xaxis")
                .call(xAxis);

            // label and sublabel
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height + margin.top + 25)
                .style("text-anchor", "middle")
                .style("font", "12px sans-serif")
                .text(xAxisTitle);

            // sublabel
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height + margin.top + 40)
                .style("text-anchor", "middle")
                .style("font", "10px sans-serif")
                .text(xAxisSubTitle);


            // Add the Y Axis
            console.log("Adding the y axis");
            svg.append("g")
                .attr("class", "yaxis")
                .call(yAxis);

            // Y axis label
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left + 10)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font", "12px sans-serif")
                .text(yAxisTitle);

            // add a title
            svg.append("text")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")
                .style("font", "16px sans-serif")
                // .style("text-decoration", "underline")
                //.text("Cumulative deaths per one million population [" + globalDate + "]");
                .text(title + " [" + globalDate + "]");

            // Interactions with mouse
            var mouseG = svg.append("g")
                .attr("class", "mouse-over-effects");

            // This is our lines.
            var lines = document.getElementsByClassName('line');

            var mousePerLine = mouseG.selectAll('.mouse-per-line')
                .data(data)
                .enter()
                .append("g")
                .attr("class", "mouse-per-line");

            mousePerLine.append("circle")
                .attr("r", 7)
                .style("stroke", function (d) {
                    return color(d.name);
                })
                .style("fill", "none")
                .style("stroke-width", "1px")
                .style("opacity", "0");

            mousePerLine.append("text")
                .attr("transform", "translate(10,3)")
                .style("font", "10px sans-serif");

            mouseG.append("path") // this is the black vertical line to follow mouse
                .attr("class", "mouse-line")
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .style("opacity", "0");

            mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
                .attr('width', width) // can't catch mouse events on a g element
                .attr('height', height)
                .attr('fill', 'none')
                .attr('pointer-events', 'all')
                .on('mouseout', function () { // on mouse out hide line, circles and text
                    d3.select(".mouse-line")
                        .style("opacity", "0");
                    d3.selectAll(".mouse-per-line circle")
                        .style("opacity", "0");
                    d3.selectAll(".mouse-per-line text")
                        .style("opacity", "0");
                })
                .on('mouseover', function () { // on mouse in show line, circles and text
                    d3.select(".mouse-line")
                        .style("opacity", "0.8");
                    d3.selectAll(".mouse-per-line circle")
                        .style("opacity", function (d) {
                            return d.active ? 1 : 0;
                        });
                    d3.selectAll(".mouse-per-line text")
                        .style("opacity", function (d) {
                            return d.active ? 1 : 0;
                        });
                })
                .on('mousemove', function () { // mouse moving over canvas
                    var mouse = d3.mouse(this);
                    d3.select(".mouse-line")
                        .attr("d", function () {
                            var d = "M" + mouse[0] + "," + height;
                            d += " " + mouse[0] + "," + 0;
                            return d;
                        });

                    d3.selectAll(".mouse-per-line")
                        .attr("transform", function (d, i) {
                            // console.log(width/mouse[0])
                            // console.log("Is active: " + d.active);
                            if (!d.active) {
                                return;
                            }
                            // Get the nearest X data point?
                            var xDate = x.invert(mouse[0]),
                                bisect = d3.bisector(function (d) {
                                    return d.date;
                                }).right;
                            idx = bisect(d.values, xDate);

                            var beginning = 0,
                                end = lines[i].getTotalLength(),
                                target = null;

                            while (true) {
                                target = Math.floor((beginning + end) / 2);
                                pos = lines[i].getPointAtLength(target);
                                if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                                    break;
                                }
                                if (pos.x > mouse[0]) end = target;
                                else if (pos.x < mouse[0]) beginning = target;
                                else break; //position found
                            }

                            d3.select(this).select('text')
                                .text(y.invert(pos.y).toFixed(2));

                            return "translate(" + mouse[0] + "," + pos.y + ")";
                        });
                });


            // LOG TOGGLE
            buttonData = [{label: "Log scale", x: 60, y: 30}]

            function buttonEvent(pressed) {
                if (pressed) {
                    logScale = true;
                    y = d3.scaleLog().range([height, 0]);
                } else {
                    logScale = false;
                    y = d3.scaleLinear().range([height, 0]);
                }
                rescale(data);

            }

            // Create button
            var button = d3.button()
                .on('press', function (d, i) {
                    buttonEvent(true);
                })
                .on('release', function (d, i) {
                    buttonEvent(false);
                });

            // Add button
            var buttons = svg.selectAll('.button')
                .data(buttonData)
                .enter()
                .append('g')
                .attr('class', 'button')
                .call(button);


            // When everything is added, "rescale", to make sure we know how we work initially
            rescale(data);

        }); // each selection

    } // function chart

    chart.title = function(_) {
        if (!arguments.length) return title;
        title = _;
        return chart;
    };

    chart.xAxisTitle = function(_) {
        if (!arguments.length) return xAxisTitle;
        xAxisTitle = _;
        return chart;
    };

    chart.xAxisSubTitle = function(_) {
        if (!arguments.length) return xAxisSubTitle;
        xAxisSubTitle = _;
        return chart;
    };

    chart.yAxisTitle = function(_) {
        if (!arguments.length) return yAxisTitle;
        yAxisTitle = _;
        return chart;
    };

    chart.prepareData = prepareData;

    return chart;
} // function timeSeriesChart

