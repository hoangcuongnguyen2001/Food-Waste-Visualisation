//Created with help from Michael Rovinsky:
//https://stackoverflow.com/questions/67649076/how-to-create-tooltips-for-multiple-values-in-a-choropleth-in-d3-v5/67718199#67718199

const second_width = 1000;
const second_height = 850;

//Define map projection // geoEqualEarth

// approximate geographical center of Australia, marked 
// 2.5 degrees lower on latitude from Lambert gravitation centre
// Source: https://www.ga.gov.au/scientific-topics/national-location-information/dimensions/centre-of-australia-states-territories#:~:text=000%20scale%20maps.-,Lambert%20gravitational%20centre,named%20in%20honour%20of%20Dr.
const projection = d3.geoMercator()
                     .center([ 132, -28 ])
                     .translate([ second_width/2, second_height/2 ])
                     .scale(1000);


//Define path generator
const path = d3.geoPath().projection(projection);

const second_color =  d3.scaleQuantize()
                        .range(['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026']);

//Create SVG
const second_svg = d3.select("#chart2")
    .append("svg")
    .attr("width", second_width)
    .attr("height", second_height);

//Load in GeoJSON data

d3.json('data/aust.json')
    .then(json => onGeoJsonLoaded(json))
    .catch(err => console.log('ERROR: ', err));
  
const onGeoJsonLoaded = json => {
//Bind data and create one path per GeoJSON feature
const states = second_svg.selectAll('g.state')
                         .data(json.features)
                         .enter()
                         .append('g')
                         .classed('state', true);

    states.append('path')
        .attr("d", path)
        .attr("stroke", 'white');

    
                  
    states.append("text")
            .attr("fill", "lightblue")
            .attr("font-size", "small")
            .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("text-anchor", "middle")
            .attr("dy", 15)
            .text(function(d) {
                 return d.properties.STATE_NAME;
            });


d3.json('data/Waste_Per_State_Per_Capita.json')
    .then(dataJson => onDataJsonLoaded(dataJson))
    .catch(err => console.log('ERR: ', err));
  
 
}

const tooltipPath = (width, height, offset, radius) => {
    const left = -width / 2;
    const right = width / 2;
    const top = -offset - height;
    const bottom = -offset;

    // Creating a polygon for containing data.
    return `M 0,0 
      L ${-offset},${bottom} 
      H ${left + radius}
      Q ${left},${bottom} ${left},${bottom - radius}  
      V ${top + radius}   
      Q ${left},${top} ${left + radius},${top}
      H ${right - radius}
      Q ${right},${top} ${right},${top + radius}
      V ${bottom - radius}
      Q ${right},${bottom} ${right - radius},${bottom}
      H ${offset} 
      L 0,0 z`;
}

const onDataJsonLoaded = json => {

  // Loading color scheme.
  const valueRange = json.reduce((r, s) => r ? 
    [Math.min(r[0], s.Total), Math.max([1], s.Total)] :
    [s.Total, s.Total], null);
  
  const second_color = d3.scaleLinear()
    .domain(valueRange)
    .range(["#FF0000", "#800000"]);
    
  const new_states = second_svg.selectAll('g.state');
    
  new_states.select('path')
    .style('fill', d => {
        const stateData = json.find(s => s.States === d.properties.STATE_NAME);
      return stateData ? second_color(stateData.Total) : '#ccc';
    })
  
  const rows = Object.keys(json[0]).filter(n => n !== 'States');
  
  const second_tooltip = second_svg.append('g')
                                   .classed('tooltip', true)
                                   .style('visibility', 'hidden');

  second_tooltip.append('path')
                .attr('d', tooltipPath(160, 80, 5, 5))
  rows.forEach((row, index) => {

    second_tooltip.append('text')
                  .text(`${row} :`)
                  .attr('x', -70)
                  .attr('y', -68 + index * 18);
    second_tooltip.append('text')
                  .classed(row.replace(' ', '_'), true)
                  .attr('x', 30)
                  .attr('y', -68 + index * 18);
    });

    
  second_svg.selectAll('g.state')
    .on('mousemove', d => {
      const stateData = json.find(s => s.States == d.properties.STATE_NAME);
      rows.forEach(row => second_tooltip.select(`.${row.replace(' ', '_')}`).text(stateData[row]));
      second_tooltip.attr('transform', `translate(${path.centroid(d)})`);
      second_tooltip.style('visibility', 'visible');
    })
    .on('mouseout', () => second_tooltip.style('visibility', 'hidden'));

    

// Hint from Susan Lu website: https://d3-legend.susielu.com/
// Note: To create this choropleth, you need to use another JavaScript file as a website here:
// https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.13.0/d3-legend.js
second_svg.append("g")
  .attr("class", "legendLinear")
  .attr("transform", "translate(30,300)");

var legendLinear = d3.legendColor()
                     .shapeWidth(30)
                     .cells([118, 123, 156, 173, 185, 203, 221, 237])
                     .orient('vertical')
                     .scale(second_color);


second_svg.select(".legendLinear")
          .call(legendLinear)
          .style('font-family', 'Helvetica');
          
};


//Create "Food waste per capita (kg/year)" on Y Axis
second_svg.append('text')
          .attr('x', -360)
          .attr('y', 20)
          .attr('text-anchor', 'middle')
          .attr('transform', 'rotate(270)')
          .style('font-family', 'Helvetica')
          .text('Food waste per capita (kg/year)');


// Create name for the map.
second_svg.append('text')
          .attr('x', second_width / 2)
          .attr('y', 40)
          .attr('text-anchor', 'middle')
          .style('font-family', 'Helvetica')
          .style('font-size', '20px')
          .text('Amount of food waste per capita in Australian states, 2019 (kg/year)');