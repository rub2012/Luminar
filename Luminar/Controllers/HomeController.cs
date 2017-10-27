using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Luminar.Models;
using NetJSON;
using Newtonsoft.Json;
using System.IO;
using System.Collections;

namespace Luminar.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Nodo()
        {
            var nodos = GetNodos();
            var nodosActivos = new List<EnlaceDto>();
            var red = (Dictionary<string,object>)NetJSON.NetJSON.DeserializeObject(new StreamReader("wwwroot/Data/nodos.json").ReadToEnd());
            var coleccion = (IList<dynamic>)red["collection"];
            var nodosJson = (IList<dynamic>)coleccion.Where(x => x["topology_id"] == "ipv4_0").Select(x => x["nodes"]).FirstOrDefault();
            nodosJson = nodosJson.Where(x => (x["properties"]["type"] == "local" || x["properties"]["type"] == "node")).ToList();
            var enlacesJson = (IList<dynamic>)coleccion.Where(x => x["topology_id"] == "ipv4_0").Select(x => x["links"]).FirstOrDefault();
            enlacesJson = enlacesJson.Where(x => (x["properties"]["type"] == "local" || x["properties"]["type"] == "node")).ToList();
            var nodosIp = nodos.Select(x => x.Ip).ToList();

            foreach (var nodo in nodosJson)
            {
                ActivarNodo(nodos, (string)nodo["label"]);
            };

            foreach (var nodo in nodos)
            {
                var enlacesDelNodo = enlacesJson.Where(x => x["properties"]["source_addr"] == nodo.Ip).ToList();
                nodo.Vecinos = new List<EnlaceDto>();
                foreach (var enlace in enlacesDelNodo)
                {
                    nodo.Vecinos.Add(new EnlaceDto
                    {
                        Destino = enlace["properties"]["target_addr"],
                        Costo = enlace["cost"]
                    });
                }

            }

            ViewBag.Nodos = nodos;

            return View();
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        private IList<NodoDto> GetNodos()
        {
            return new List<NodoDto> { new NodoDto { Ip = "10.10.5.1", Latitud = -34.522372m, Longitud = -58.701958m },
                new NodoDto { Ip = "10.10.5.2", Latitud = -34.521736m, Longitud = -58.701305m },
                new NodoDto { Ip = "10.10.5.3", Latitud = -34.521391m, Longitud = -58.703140m },
                new NodoDto { Ip = "10.10.5.4", Latitud = -34.520759m, Longitud = -58.702437m },
                new NodoDto { Ip = "10.10.5.5", Latitud = -34.520140m, Longitud = -58.701707m },
            };
        }

        private void ActivarNodo(IList<NodoDto> nodos,string nodoIp)
        {
            foreach(var nodo in nodos)
            {
                if (nodo.Ip == nodoIp)
                {
                    nodo.Activo = true;
                }
            };

        }

        //private void Enlazar(NodoDto nodo, string nodoIp)
        //{
        //    foreach (var nodo in nodos)
        //    {
        //        if (nodo.Ip == nodoIp)
        //        {
        //            nodo.Activo = true;
        //        }
        //    };

        //}
    }
}
