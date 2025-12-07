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
      data.forEach(function (d){
            if(Number(d[attributeX]) > maxX){
                  
                  maxX = Number(d[attributeX])
            }
            if(Number(d[attributeY]) > maxY){
                  maxY = Number(d[attributeY])
            }
      })
      // Add X axis
      const x = d3.scaleLinear()
      .domain([0, maxX])
      .range([ 0, width ]);
      svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3.scaleLinear()
      .domain([0, maxY])
      .range([ height, 0]);
      svg.append("g")
      .call(d3.axisLeft(y));

      // Add dots
      svg.append('g')
      .selectAll("dot")
      .data(data)
      .join("circle")
            .attr("cx", function (d) { return x(d[attributeX]); } )
            .attr("cy", function (d) { return y(d[attributeY]); } )
            .attr("r", 1.5)
            .style("fill", "#69b3a2")

})