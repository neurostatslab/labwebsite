
var n = 750,
    n_buffer = 751,
    random = d3.randomNormal(0, .3),
    buffer = d3.range(n_buffer).map(random);

var i = n,
    data = buffer.slice(0, n);

var svg = d3.select("svg"),
    margin = {top: 0, right: 0, bottom: 0, left: 20},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear()
    .domain([0, n - 1])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([-1, 1])
    .range([height, 0]);

var line = d3.line()
    .x(function(d, i) { return x(i); })
    .y(function(d, i) { return y(d); });

g.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

g.append("g")
    .attr("clip-path", "url(#clip)")
  .append("path")
    .datum(data)
    .attr("class", "line")
  .transition()
    .duration(500)
    .ease(d3.easeLinear)
    .on("start", tick);

function tick() {

  // Push a new data point onto the back.
  data.push(buffer[i]);
  i = (i + 1) % n_buffer;

  // Redraw the line.
  d3.select(this)
      .attr("d", line)
      .attr("transform", null);

  // Slide it to the left.
  d3.active(this)
      .attr("transform", "translate(" + x(-1) + ",0)")
    .transition()
      .on("start", tick)
      .duration(10);

  // Pop the old data point off the front.
  data.shift();

}
