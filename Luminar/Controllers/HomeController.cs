using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Luminar.Models;

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
    }
}
