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
    $.blockUI({ message: $("#spinner") });
    var map;
    var recargaMapa = true;
    var bloqueado = false;
    var overlay = new google.maps.OverlayView();
    setInterval(function () {
        if (!bloqueado) {
            bloqueado = true;
            $.getJSON($("#urlNodosJson").val(),
                function(data) {
                    //d3.selectAll("#map").attr("width", width - 200);
                    var nodos = data;

                    var latitudMax = Math.max.apply(Math, LatitudesNodos(nodos));
                    var latitudMin = Math.min.apply(Math, LatitudesNodos(nodos));

                    var longitudMax = Math.max.apply(Math, LongitudesNodos(nodos));
                    var longitudMin = Math.min.apply(Math, LongitudesNodos(nodos));

                    if (recargaMapa) {
                        map = CrearMapa(latitudMax, latitudMin, longitudMax, longitudMin);
                    }

                    overlay.onAdd = function() {

                        var layerEnlaces = d3.select(this.getPanes().overlayLayer).append("div")
                            .attr("class", "enlaces");
                        var layerNodos = d3.select(this.getPanes().overlayMouseTarget).append("div")
                            .attr("class", "nodos");

                        overlay.draw = function() {
                            var projection = this.getProjection(), padding = 10;

                            var enlaces = layerEnlaces.selectAll("svg")
                                .data(Enlaces(nodos))
                                .each(transformEnlaces)
                                .enter().append("svg")
                                .each(transformEnlaces)
                                //.attr("class", "enlace")
                                .style("width", "100px")
                                .style("height", "100px");

                            function transformEnlaces(enlace) {
                                var origen = new google.maps.LatLng(enlace.latitudOrigen, enlace.longitudOrigen);
                                origen = projection.fromLatLngToDivPixel(origen);
                                var destino = new google.maps.LatLng(enlace.latitudDestino, enlace.longitudDestino);
                                destino = projection.fromLatLngToDivPixel(destino);
                                var svg = d3.select(this);
                                svg.selectAll("*").remove();
                                svg
                                    .append("line")
                                    .attr("x1", origen.x)
                                    .attr("y1", origen.y)
                                    .attr("x2", destino.x)
                                    .attr("y2", destino.y)
                                    .attr("stroke-width", 1)
                                    .attr("stroke-opacity", 0.7)
                                    .attr("stroke", "black")
                                    .attr("id", enlace.id);
                                return svg;
                            };

                            var marker = layerNodos.selectAll("svg")
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
                                var svg = d3.select(this);
                                svg.selectAll("*").remove();
                                svg
                                    .style("left", (nodoXY.x - padding - 5) + "px")
                                    .style("top", (nodoXY.y - padding - 5) + "px")
                                    .append("circle")
                                    .attr("id", "id" + nodo.ip)
                                    .attr("fill", setColor(nodo))
                                    //.style("fill", setColor(nodo))
                                    .attr("r", 5)
                                    .attr("cx", padding + 5)
                                    .attr("cy", padding + 5)
                                    .on("click",
                                        function(d, i) {
                                            console.log("marker clickeado");
                                        });
                                svg
                                    .append("text")
                                    .attr("x", padding + 7) //padding + 7
                                    .attr("y", padding)
                                    .attr("dy", ".31em")
                                    .style("fill", "blue")
                                    .text(function(nodo) { return nodo.ip; });
                                return svg;
                            };

                        };
                    };

                    overlay.onRemove = function () {
                        
                    }

                    if (!recargaMapa)
                    {
                        //map.overlayMapTypes.setAt(0, null);
                        //overlay.setMap(null);
                        d3.selectAll(".enlaces").remove();
                        d3.selectAll(".nodos").remove();
                    }
                    
                    overlay.setMap(map);
                    //$("#map").attr("style", "position: inherit");


                }).done(function() {
                    $.unblockUI();
                    bloqueado = false;
                    recargaMapa = false;
            });
            
        }
    }, 15000);

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
        console.log('Mensaje recibido: ' + message);
        AgregarNotificacion(message);
    });
    
    notificador.start().catch(err => {
        console.log('connection error');
    });

}

function AgregarNotificacion(mensaje) {
    var mensajeJson = $.parseJSON(mensaje);
    ActualizarNodo(mensajeJson);
    var fecha = new Date();
    var hora = ('0' + fecha.getHours()).slice(-2) + ":" + ('0' + fecha.getMinutes()).slice(-2);
    var descripcion = mensajeJson.encendido ? "Luz Encendida" : "Luz Apagada";
    $(".notificacion-panel").append("<li>" + hora + " - " + mensajeJson.ip + " - "+descripcion+"</li>");
}

function ActualizarNodo(nodo) {
    $(".marker circle[id='id" + nodo.ip + "']").attr("fill", setColor(nodo));
}

function CrearMapa(latitudMax, latitudMin, longitudMax, longitudMin)
{
    var map = new google.maps.Map(d3.select("#map").node(),
        {
            zoom: 17,
            center: new google.maps.LatLng((latitudMax + latitudMin) / 2, (longitudMax + longitudMin) / 2),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

    return map;
}
