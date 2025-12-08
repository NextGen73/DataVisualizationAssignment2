/* sources used:
* https://d3-graph-gallery.com/graph/scatter_basic.html
* https://stackoverflow.com/questions/11189284/d3-axis-labeling
* https://chatgpt.com to make points with different shape and color
* https://d3-graph-gallery.com/graph/custom_legend.html#cat3
* https://stackoverflow.com/questions/22452112/nvd3-clear-svg-before-loading-new-chart
*
*/


// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 1000 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const legend = d3.select("#legend")
      .append("svg")
      .attr("width", 200)
      .attr("height", 420)
      .append("g")
      .attr("transform", `translate(${0}, ${margin.top})`);    

const tooltip = d3.select("#tooltip")
      .append("svg")
      .attr("width", 400)
      .attr("height", 580)
      .append("g")

let maxX = 0
let maxY = 0

const tooltipInformation = ["Name", "Type", "Cyl", "Horsepower(HP)", "City Miles Per Gallon", "Highway Miles Per Gallon", "Weight", "Wheel Base", "Len", "Width"]

function displayInformation(d){

}

//Read the data
d3.csv("cars.csv").then( function(data) {
      const attributeX = "Weight"
      const attributeY = "Horsepower(HP)"
      const attributeColor = "Cyl"
      const attributeShape = "Type"

      let lastElt = null
      let lastData = null
      d3.select("body").on("mousedown", function(){
            if(lastData && lastElt){
                  tooltip.selectAll("*").remove();
                  lastElt
                        .transition()
                        .duration(400)
                        .style("fill", lastData => color(lastData[attributeColor]));
                  console.log("cleared")
                  lastData = null
                  lastElt = null
            }
            
      })

      data.forEach(function (d){
            if(Number(d[attributeX]) > maxX){
                  maxX = Number(d[attributeX])
            }
            if(Number(d[attributeY]) > maxY){
                  maxY = Number(d[attributeY])
            }
      })

      const cylValues = ["0", "3", "4", "5", "6", "8", "9", "12"]
      const color = d3.scaleOrdinal()
            .domain(cylValues)
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
            .attr("d", d3.symbol().type(d => shape(d[attributeShape])).size(25))
            .attr("fill", d => color(d[attributeColor]))
            // Tooltip styling when mouse hovers over
            .on("mouseup", function (d, i) {
                  d3.select(this).style("fill", "#a8eddf");
                  lastData = d
                  lastElt = d3.select(this)
                  console.log("new")
                  displayInformation(d)          
            })

            // Tooltip styling when mouse is off the point
            // .on("mouseout", function () {
                  // d3.select(this)
                  // .transition()
                  // .duration(400)
                  // .style("fill", d => color(d[attributeColor]));
            // })

      

      // Label x axis
      svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text(attributeX);

      // Label y axis
      svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text(attributeY);

      // Build legend
      const size = 20
      legend.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .text("Legend:")
            .attr("dy", ".75em")
            .style("font-size", "18px")

      legend.append("text")
            .attr("x", 0)
            .attr("y", 45)
            .text("Number of cylinders:")

      legend.selectAll("mydots")
            .data(cylValues)
            .enter()
            .append("rect")
                  .attr("x", 0)
                  .attr("y", function(d,i){ return 55 + i*(size+5)})
                  .attr("width", size)
                  .attr("height", size)
                  .style("fill", function(d){ return color(d)})
      
      legend.selectAll("mylabels")
            .data(cylValues)
            .enter()
            .append("text")
                  .attr("x", size+10)
                  .attr("y", function(d,i){ return 67 + i*(size+5)})
                  .style("fill", function(d){ return color(d)})
                  .text(function(d){ return d})
                  .attr("text-anchor", "left")
                  .style("alignment-baseline", "middle")

      const setOfShapeValues = new Set
      data.forEach(d => {
            setOfShapeValues.add(d[attributeShape])
      })
      const arrayOfShapeValues = setOfShapeValues.values().toArray()

      legend.append("text")
            .attr("x", 0)
            .attr("y", 280)
            .text("Type:")

      legend.append('g')
            .selectAll("path.point")
            .data(arrayOfShapeValues)
            .enter()
            .append("path")
            .attr("class", "point")
            .attr("transform", function(d,i){ return `translate(10, ${300 + i*(size+5)})`})
            .attr("d", d3.symbol().type(d => shape(d)).size(150))
            .attr("fill", "#000000")

      legend.selectAll("mylabels")
            .data(arrayOfShapeValues)
            .enter()
            .append("text")
                  .attr("x", size+10)
                  .attr("y", function(d,i){ return 300 + i*(size+5)})
                  .style("fill", "#000000")
                  .text(function(d){ return d})
                  .attr("text-anchor", "left")
                  .style("alignment-baseline", "middle")
            
            
})