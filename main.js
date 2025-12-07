// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let maxX = 0
let maxY = 0

//Read the data
d3.csv("cars.csv").then( function(data) {
      const attributeX = "Weight"
      const attributeY = "Horsepower(HP)"
      const attributeColor = "Cyl"
      const attributeShape = "Type"

      data.forEach(function (d){
            if(Number(d[attributeX]) > maxX){
                  maxX = Number(d[attributeX])
            }
            if(Number(d[attributeY]) > maxY){
                  maxY = Number(d[attributeY])
            }
      })

      const color = d3.scaleOrdinal()
            .domain(data.map(d => d[attributeColor]))
            .range(d3.schemeCategory10);
      
      const shape = d3.scaleOrdinal()
            .domain(data.map(d => d[attributeShape]))
            .range([
            d3.symbolCircle,
            d3.symbolSquare,
            d3.symbolTriangle,
            d3.symbolDiamond,
            d3.symbolCross,
            d3.symbolStar
            ]);

      // Add X axis
      const x = d3.scaleLinear()
      .domain([0, 1.1*maxX])
      .range([ 0, width ]);
      svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3.scaleLinear()
      .domain([0, 1.1*maxY])
      .range([ height, 0]);
      svg.append("g")
      .call(d3.axisLeft(y));

      // Add dots
      svg.append('g')
      .selectAll("path.point")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "point")
      .attr("transform", d => `translate(${x(d[attributeX])}, ${y(d[attributeY])})`)
      .attr("d", d3.symbol().type(d => shape(d[attributeShape])).size(15))
      // .join("circle")
      //       .attr("cx", function (d) { return x(d[attributeX]); } )
      //       .attr("cy", function (d) { return y(d[attributeY]); } )
      .attr("fill", d => color(d[attributeColor]))

      svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text(attributeX);

      svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text(attributeY);
})