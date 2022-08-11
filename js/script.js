const primaryColor = '#0024d9';
const secondaryColor = 'red';
const highlightColor = 'cyan';

function runStreaks() {

    let box = document.getElementById('runStreaksScatterplot');
    let width = box.offsetWidth;

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 20, bottom: 20, left: 20};
    width = width - margin.left - margin.right;
    var height = width * .5 - margin.top - margin.bottom;

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

function test() {
    // set the dimensions and margins of the graph
    let box = document.getElementById('packedCountryCircles');
    let width = box.offsetWidth;
    const height = width * 1.25;

    // append the svg object to the body of the page
    const svg = d3.select("#packedCountryCircles")
    .append("svg")
        .attr("width", width)
        .attr("height", height);
        // .style('outline', '1px black solid')

    // create dummy data -> just one element per circle
    // const data = [{ "name": "A", "group": 1 }, { "name": "B", "group": 1 }, { "name": "C", "group": 1 }, { "name": "D", "group": 1 },
    //             { "name": "G", "group": 4 }, { "name": "H", "group": 4 }, { "name": "I", "group": 2 }, { "name": "J", "group": 2 }, { "name": "K", "group": 2 }, { "name": "L", "group": 2 },
    //             { "name": "M", "group": 3 }, { "name": "N", "group": 3 }, { "name": "O", "group": 3 }];

    const data = [];
    const numCountries = 195;

    for (let i = 0; i < 195 * .95; i++) {
        data.push({'name':i, 'group':1});
    }
    for (let i = 0; i < 195 * .75; i++) {
        data.push({'name':i, 'group':2});
    }
    for (let i = 0; i < 195 * .5; i++) {
        data.push({'name':i, 'group':3});
    }
    for (let i = 0; i < 195 * .1; i++) {
        data.push({'name':i, 'group':4});
    }

    // A scale that gives a Y target position for each group
    const y = d3.scaleOrdinal()
        .domain([1, 2, 3, 4])
        .range([height * .1, height * .35, height * .6, height * .85])

    // A color scale
    const color = d3.scaleOrdinal()
        .domain([1, 2, 3, 4])
        .range([ "#26f0f1", "#e75a7c", "#5438dc", "#f0b67f"]);

    // Initialize the circle: all located at the center of the svg area
    const node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
            .attr("r", 5)
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .style("fill", d => color(d.group))
            .style("fill-opacity", 0.75)
            .attr("stroke", "black")
            .style("stroke-width", 1);

    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("x", d3.forceX().strength(0.05).x(width / 2 ))
        .force("y", d3.forceY().strength(5).y(d => y(d.group)))
        .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.05).radius(5).iterations(1)) // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
        });
}

function xkcdChart() {
    const svg = document.getElementById('xkcdLineplot');

    new chartXkcd.Line(svg, {
        title: 'Monthly income of an indie developer', // optional
        xLabel: 'Month', // optional
        yLabel: '$ Dollors', // optional
        data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
            label: 'Plan',
            data: [30, 70, 200, 300, 500, 800, 1500, 2900, 5000, 8000],
        }, {
            label: 'Reality',
            data: [0, 1, 30, 70, 80, 100, 50, 80, 40, 150],
        }],
        },
        options: { // optional
            yTickCount: 3,
            legendPosition: chartXkcd.config.positionType.upLeft
        }
    });
}

runStreaks();
test();
xkcdChart();