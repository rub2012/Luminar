$(document).ready(function () {
    IniciarSignalR();
    $.blockUI.defaults.css = {
        padding: 0,
        margin: 0,
        textAlign: 'center',        
        //backgroundColor: '#fff',
        top: '50%',
        left: '50%',
        color: '#000',
        cursor: 'wait'
    };
    $.blockUI({ message: $("#spinner")});
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
                    var nodoXY = new google.maps.LatLng(nodo.latitud, nodo.longitud);
                    nodoXY = projection.fromLatLngToDivPixel(nodoXY);
                    return d3.select(this)
                        .style("left", (nodoXY.x - padding -5) + "px")
                        .style("top", (nodoXY.y - padding - 5) + "px")
                        .attr("id", nodo.ip)
                        .attr("fill", setColor(nodo));
                };

                function setColor(nodo) {
                    if (nodo.activo && nodo.encendido) {
                        return "green";
                    }
                    else if (nodo.activo) {
                        return "yellow";
                    }
                    else {
                        return "red";
                    }
                }

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

                $.each(Enlaces(nodos), function (indice, enlace) {
                    var line = new google.maps.Polyline({
                        path: [
                            new google.maps.LatLng(enlace.latitudOrigen, enlace.longitudOrigen),
                            new google.maps.LatLng(enlace.latitudDestino, enlace.longitudDestino)
                        ],
                        strokeColor: "red",
                        strokeOpacity: 0.7,
                        strokeWeight: 1,
                        map: map,
                        //id: enlace.id
                    });
                });

                
            };
        };
        overlay.setMap(map);
        //$("#map").attr("style", "position: inherit");
        

    }).done(function() {
        $.unblockUI();
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
                costo: vecino.costo,
                id: nodo.ip +"-"+vecino.ip
            });
        });        
    });
    return enlaces;
}

function IniciarSignalR()
{
    //var transportType = signalR.TransportType.WebSockets;
    //can also be ServerSentEvents or LongPolling
    //var logger = new signalR.ConsoleLogger(signalR.LogLevel.Information);
    //var chatHub = new signalR.HttpConnection(`http://${document.location.host}/chat`, { transport: transportType, logger: logger });

    var notificador = new signalR.HubConnection("/notificacion");

    notificador.onClosed = e => {
        console.log('connection closed');
    };

    //Metodo llamado desde el hub Notificacion a traves del controller
    notificador.on('Send', (message) => {
        console.log('Mensaje recibido: '+ message);
    });
    
    notificador.start().catch(err => {
        console.log('connection error');
    });

}