// Simple Graphs implementation by Pranay 
	// v 0.0.1 (01/13/15)

// var assert = require('assert');


var Graph = function(adjacencyList, num) {
	this.al = adjacencyList || this.makeList(num || 5);
}

Graph.prototype.makeList = function(num) {
	var al = [];
	for (var i = 0; i < num; i++) {
		al[i] = [];
		for (var j = 0; j < num; j++) {
			Math.round(Math.random())?al[i].push(j):null;
		}
	}
	return al;
}

Graph.prototype.invertAdjacencyList = function(wantNew) {
	var al = this.al;
	var c = 0;
	var a = [];
	for (var i = 0; i < this.al.length; i++) {
		var edges = this.al[i];
		a[i] = a[i] || [];
		for (var j = 0; j < edges.length; j++) {
			c++;
			a[edges[j]] = (a[edges[j]] || []).concat([i]);
		}
	}
	this.al=wantNew?this.al:a;
	return a;
}

Graph.prototype.d3ify = function(){
	var al = this.al;
	al.map(function(e,i,a) {
		return {name: i, children: e }
	})
	return al;
}

var g = new Graph([[1,2], [], [1]]);
// console.log(g);
// assert.equal(g.al.length, 3);
// var alOld = g.al.slice();
// g.invertAdjacencyList();
// assert.notDeepEqual(alOld, g.al);
// console.log(g);

//------------------------------------------------------------------------
// INSERTIONS



var i = 0;
var width = window.innerWidth;
var height = window.innerHeight;

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

var graph = d3.layout.force();
var nodes = g.d3ify();
var links = graph.links(nodes);
console.log(nodes, links);
var node = svg.selectAll(".node")
	.data(nodes)
	.enter()
	.append("g")
		.attr("class", "node")
		.attr("transform", function(d) {
			return "translate(" + (d.x*width/2 + 10) + "," + (d.y*height/2 + 50) + ")";
		});
node.append("circle")
	.attr("r", 5)
	.attr("fill", function(d) {return d.color});

node.append("text")
	.text(function(d) {
		var value = "root", rc = ".", lc = ".";
		if (d.parent) {
			value = d.parent.value
		}
		if (d.rightChild) {
			rc = d.rightChild.value
		}
		if (d.leftChild) {
			lc = d.leftChild.value
		}
		return d.name });

var diagonal = d3.svg.diagonal()
	.projection(function(d) {return [(d.x*width/2 + 10), (d.y*height/2 + 50)]});

var link = svg.selectAll(".link")
	.data(links)
	.enter()
	.append("path")
		.attr("class", "link")
		.attr("stroke", "black")
		.attr("fill", "none")
		.attr("d", diagonal);
