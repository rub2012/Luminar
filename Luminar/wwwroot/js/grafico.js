$(document).ready(function () {

    //var s = d3.
    var bound = new google.maps.LatLngBounds();
    $.getJSON($("#urlNodosJson").val(), function (data) {
        var nodos = data;
        $.each(nodos, function (indice, nodo) {
            var latitud = nodo.latitude;
            var longitud = nodo.latitude;
            bound.extend(new google.maps.LatLng(latitud, longitud));
        });

        d3.selectAll("#map").attr("width", width - 200);

        var latitudMax = Math.max.apply(Math, LatitudesNodos(nodos));
        var latitudMin = Math.min.apply(Math, LatitudesNodos(nodos)); 

        var longitudMax = Math.max.apply(Math, LongitudesNodos(nodos));
        var longitudMin = Math.min.apply(Math, LongitudesNodos(nodos));

        var map = new google.maps.Map(d3.select("#map").node(),
            {
                zoom: 1,
                center: new google.maps.LatLng((latitudMax + latitudMin) / 2, (longitudMax + longitudMin) / 2),
                mapTypeId: "roadmap"
            });

        map.fitBounds(bound);

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