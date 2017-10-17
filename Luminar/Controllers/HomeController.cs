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
            var nodosActivos = new List<NodoDto>();
            var red = (Dictionary<string,object>)NetJSON.NetJSON.DeserializeObject(new StreamReader("wwwroot/Data/nodos.json").ReadToEnd());
            var coleccion = (IEnumerable<dynamic>)red["collection"];
            var nodosJson = coleccion.ToList().Where(x => x["topology_id"] == "ipv4_0").Select(x => x["nodes"]).ToList().FirstOrDefault();
            var nodosIp = nodos.Select(x => x.Ip).ToList();
            foreach (var nodo in nodosJson)
            {
                ActivarNodo(nodos, (string)nodo["label"]);
            };

            ViewBag.Nodos = nodos;

            return View();
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        private IList<NodoDto> GetNodos()
        {
            return new List<NodoDto> { new NodoDto { Ip = "10.10.5.1", PosicionX = 5, PosicionY = 5 },
                new NodoDto { Ip = "10.10.5.2", PosicionX = 50, PosicionY = 5 },
                new NodoDto { Ip = "10.10.5.3", PosicionX = 5, PosicionY = 50 },
                new NodoDto { Ip = "10.10.5.4", PosicionX = 50, PosicionY = 50 },
                new NodoDto { Ip = "10.10.5.5", PosicionX = 100, PosicionY = 50 },
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
    }
}
