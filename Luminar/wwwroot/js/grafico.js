$(document).ready(function () {
    $.getJSON($("#urlNodosJson").val(), function (data) {
        //d3.selectAll("#map").attr("width", width - 200);
        var nodos = data;

        var latitudMax = Math.max.apply(Math, LatitudesNodos(nodos));
        var latitudMin = Math.min.apply(Math, LatitudesNodos(nodos)); 

        var longitudMax = Math.max.apply(Math, LongitudesNodos(nodos));
        var longitudMin = Math.min.apply(Math, LongitudesNodos(nodos));

        var map = new google.maps.Map(d3.select("#map").node(),
            {
                zoom: 17,
                center: new google.maps.LatLng((latitudMax + latitudMin) / 2, (longitudMax + longitudMin) / 2),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

        var overlay = new google.maps.OverlayView();
        overlay.onAdd = function(){
            var layer = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "nodos");

            overlay.draw = function () {
                var projection = this.getProjection(), padding = 10;

                var marker = layer.selectAll("svg")
                    .data(nodos)
                    .each(transform)
                    .enter().append("svg")
                    .each(transform)
                    .attr("class", "marker")
                    .style("width", "100px")
                    .style("height", "100px")
                    //.attr("overflow", "visible");

                function transform(nodo) {
                    nodo = new google.maps.LatLng(nodo.latitud, nodo.longitud);
                    nodo = projection.fromLatLngToDivPixel(nodo);
                    return d3.select(this)
                        .style("left", (nodo.x - padding -5) + "px")
                        .style("top", (nodo.y - padding - 5) + "px");
                };

                function armarPath(enlace) {
                    return d3.select(this)
                        .append("path")
                        .attr("d", function () {
                            var origen = transformLatLng(enlace.latitudOrigen, enlace.longitudOrigen);
                            var destino = transformLatLng(enlace.latitudDestino, enlace.longitudDestino);
                            return " M " + origen.x + " " + origen.y + " L " + destino.x + " " + destino.y;
                        })
                        .attr("stroke", "blue")
                        .attr("stroke-width", 2)
                        .attr("fill", "none");
                }

                function transformLatLng(latitud, longitud) {
                    var nodo = new google.maps.LatLng(latitud, longitud);
                    nodo = projection.fromLatLngToDivPixel(nodo);
                    return { x: nodo.x - padding, y: nodo.y - padding }
                };

                marker.append("circle")
                    .attr("r", 5)
                    .attr("cx", padding + 5)
                    .attr("cy", padding + 5);

                // Add a label.
                marker.append("text")
                    .attr("x", padding + 7) //padding + 7
                    .attr("y", padding)
                    .attr("dy", ".31em")
                    .style("fill", "blue")
                    .text(function (d) { return d.ip; });

                //var edges = layer.selectAll("path")
                //    .data(Enlaces(nodos))
                //    .enter().append("svg:svg").attr("width", "100%").attr("width", "100%").style("position", "absolute")
                //    .append('svg:path')
                //    .attr({
                //        'd': function (d) {
                //            var origen = transformLatLng(d.latitudOrigen, d.longitudOrigen);
                //            var destino = transformLatLng(d.latitudDestino, d.longitudDestino);
                //            return 'M ' + origen.x + ',' + origen.y + ' L ' + destino.x + ',' + destino.y
                //        },
                //        'class': 'edge',
                //        'fill-opacity': 0,
                //        'stroke-opacity': 0,
                //        'fill': 'blue',
                //        'stroke': 'red',
                //        'id': function (d, i) { return 'edge' + i }
                //    })
                    //.style("pointer-events", "none");

                //var edges = layer.selectAll("svg")
                //    .data(Enlaces(nodos))
                //    .enter().append("svg").attr("width", "100%").attr("width", "100%").style("position", "absolute")
                //    .append("svg:path")
                //    .attr("d", function (d) {
                //        var e = transform_path(d)
                //        var p = 'M' + e.join('L') + 'Z'
                //        return p
                //    }).attr("fill", "none").attr("stroke", "black");

                //function transform_path(vecino) {
                //    var d = [];
                //    for (var i = 0; i < vecino.length; i++) {
                //        var c = transform(vecino);
                //        d.push(c);
                //    }
                //    return d;
                //}

                //var svgContainer = layer.selectAll("svg")
                //    .enter().append("svg").attr("width", "100%").attr("width", "100%").style("position", "absolute");

                //$.each(Enlaces(nodos), function (indice, enlace) {
                //    var lineGraph = svgContainer.append("path")
                //        .attr("d", function() {
                //            var origen = transformLatLng(enlace.latitudOrigen, enlace.longitudOrigen);
                //            var destino = transformLatLng(enlace.latitudDestino, enlace.longitudDestino);
                //                return " M " + origen.x + " " + origen.y + " L " + destino.x + " " + destino.y;
                //            })
                //        .attr("stroke", "blue")
                //        .attr("stroke-width", 2)
                //        .attr("fill", "none");
                //});

                //var edge = layer.selectAll("svg")
                //    .data(Enlaces(nodos))
                //    .each(armarPath)
                //    .enter().append("svg")
                //    .each(armarPath);


                //var edge = layer.selectAll("svg")
                //    .data(Enlaces(nodos))
                //    //.each(transform)
                //    .enter().append("svg").attr("width", "100%").attr("width", "100%").style("position", "absolute")
                //    .each(function (d) {
                //        d3.select(this)
                //            .enter()
                //            .append("path")
                //            .attr("class", "path")
                //            .attr("stroke", "black")
                //            .attr("stroke-width", 1)
                //            .attr("opacity", 0.8)
                //            //.style('fill', color(i))
                //            .attr("d", function() {
                //                    var origen = transformLatLng(d.latitudOrigen, d.longitudOrigen);
                //                    var destino = transformLatLng(d.latitudDestino, d.longitudDestino);
                //                    return " M " + origen.x +" "+ origen.y+ " L " + destino.x + " "+ destino.y;
                //                }
                //            );
                //    });

                $.each(Enlaces(nodos), function (indice, enlace) {
                    var line = new google.maps.Polyline({
                        path: [
                            new google.maps.LatLng(enlace.latitudOrigen, enlace.longitudOrigen),
                            new google.maps.LatLng(enlace.latitudDestino, enlace.longitudDestino)
                        ],
                        strokeColor: "red",
                        strokeOpacity: 0.7,
                        strokeWeight: 1,
                        map: map
                    });
                });

                
            };
        };
        overlay.setMap(map);
        //$("#map").attr("style", "position: inherit");
        

    });


});

function initMap() {

}

function LatitudesNodos(nodos) {
    var latitudes = [];
    $.each(nodos, function (indice, nodo) {
        latitudes.push(nodo.latitud);
    });
    return latitudes;
}

function LongitudesNodos(nodos) {
    var longitudes = [];
    $.each(nodos, function (indice, nodo) {
        longitudes.push(nodo.longitud);
    });
    return longitudes;
}

function Enlaces(nodos) {
    var enlaces = [];
    $.each(nodos, function (indice, nodo) {
        $.each(nodo.vecinos, function (indice, vecino) {
            enlaces.push({
                latitudOrigen: nodo.latitud,
                longitudOrigen: nodo.longitud,
                latitudDestino: vecino.latitud,
                longitudDestino: vecino.longitud,
                costo: vecino.costo
            });
        });        
    });
    return enlaces;
}