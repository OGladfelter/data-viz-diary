const primaryColor = '#0024d9';
const secondaryColor = 'red';
const highlightColor = 'cyan';

function runStreaks() {

    let box = document.getElementById('runStreaksScatterplot');
    let width = box.offsetWidth;

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 20, bottom: 50, left: 20};
    width = width - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range([margin.left, width - margin.right]);
    var y = d3.scaleLinear().range([height, 0]);

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#runStreaksScatterplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv("data/runStreaks.csv").then(function(data) {

        // format the data
        data.forEach(function(d) {
            d.age = +d.age;
            d.days = +d.days;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.days; }));
        y.domain([0, d3.max(data, function(d) { return d.age; })]);
        
        // Add the scatterplot
        svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.days); })
        .attr("cy", function(d) { return y(d.age); })
        .style('fill', function(d) { if (d.days > 10) return primaryColor; else return secondaryColor})
        .style('opacity', function(d) { if (d.days > 10) return 0.5; else return 1})
        .on('mouseover', function() {
            d3.select(this).style('stroke', highlightColor).style('stroke-width', 3).raise();
        })
        .on('mouseout', function() {
            d3.select(this).style('stroke', 'none');
        })

        // Handmade legend
        svg.append("circle").attr("cx", x(18000)).attr("cy", y(25)).attr("r", 6).style("fill", secondaryColor);
        svg.append("circle").attr("cx", x(18000)).attr("cy", y(20)).attr("r", 6).style("fill", primaryColor);
        svg.append("text").attr("x", x(18300)).attr("y", y(25)).text("Me").style("font-size", "15px").attr("alignment-baseline","middle");
        svg.append("text").attr("x", x(18300)).attr("y", y(20)).text("Not me").style("font-size", "15px").attr("alignment-baseline","middle");

        // Add the X Axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
        .call(d3.axisLeft(y));

        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width)
            .attr("y", height - 5)
            .text("Days ran in a row");
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("x", 5)
            .attr("y", 0 + margin.top)
            .text("Age");

    });
}

runStreaks();