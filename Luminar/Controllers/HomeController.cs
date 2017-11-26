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
using Renci.SshNet;
using System.Net;

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
            var nodos = ObtenerNodos();

            ViewBag.Nodos = nodos;

            return View();
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        private IList<NodoDto> GetNodos()
        {
            return new List<NodoDto> { new NodoDto { Ip = "192.168.1.100", Latitud = -34.522372m, Longitud = -58.701958m },
                new NodoDto { Ip = "192.168.1.52", Latitud = -34.521736m, Longitud = -58.701305m },
                new NodoDto { Ip = "10.10.5.3", Latitud = -34.521391m, Longitud = -58.703140m },
                new NodoDto { Ip = "10.10.5.4", Latitud = -34.520759m, Longitud = -58.702437m },
                new NodoDto { Ip = "10.10.5.5", Latitud = -34.520140m, Longitud = -58.701707m },
            };
        }

        private IList<NodoDto> ObtenerNodos()
        {
            var nodos = GetNodos();
            var nodosActivos = new List<EnlaceDto>();
            //var red = (Dictionary<string, object>)NetJSON.NetJSON.DeserializeObject(new StreamReader("wwwroot/Data/nodos.json").ReadToEnd());
            var red = (Dictionary<string, object>)NetJSON.NetJSON.DeserializeObject(GetNodosDataOlsr(nodos.FirstOrDefault().Ip));
            var coleccion = (IList<dynamic>)red["collection"];
            var nodosJson = (IList<dynamic>)coleccion.Where(x => x["topology_id"] == "ipv4_0").Select(x => x["nodes"]).FirstOrDefault();
            nodosJson = nodosJson.Where(x => (x["properties"]["type"] == "local" || x["properties"]["type"] == "node")).ToList();
            var enlacesJson = (IList<dynamic>)coleccion.Where(x => x["topology_id"] == "ipv4_0").Select(x => x["links"]).FirstOrDefault();
            enlacesJson = enlacesJson.Where(x => (x["properties"]["type"] == "local" || x["properties"]["type"] == "node")).ToList();

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
                    try
                    {
                        NodoDto nodoEnlace = ObtenerNodoPorIp(nodos, enlace["properties"]["target_addr"]);
                        nodo.Vecinos.Add(new EnlaceDto
                        {
                            Latitud = nodoEnlace.Latitud,
                            Longitud = nodoEnlace.Longitud,
                            Costo = enlace["cost"],
                            Ip = nodoEnlace.Ip
                        });
                    }catch(Exception e)
                    {

                    }                    
                }
            }
            return nodos;
        }

        private NodoDto ObtenerNodoPorIp(IList<NodoDto> nodos, string ip)
        {
            return nodos.Where(x => x.Ip == ip).FirstOrDefault();
        }
    
        [HttpGet]
        public IActionResult NodosJson()
        {
            var nodos = ObtenerNodos();

            return Json(nodos);
        }

        private void ActivarNodo(IList<NodoDto> nodos, string nodoIp)
        {
            foreach (var nodo in nodos)
            {
                if (nodo.Ip == nodoIp)
                {
                    nodo.Activo = true;
                    nodo.Encendido = LeerEstadoLuz(nodo.Ip);
                }                
            };

        }

        private bool LeerEstadoLuz(string ip)
        {
            try
            {
                return EjecutarComando("python3 /home/pi/scripts/leerEstadoLampara.py", ip, 22, "pi", "root") == "1";
            }
            catch (Exception)
            {
                return false;
            }
        }

        private string EjecutarComando(string comando, string host, int port, string user, string password)
        {
            using (var client = new SshClient(host, port, user, password))
            {
                client.ConnectionInfo.Timeout = TimeSpan.FromSeconds(2);
                client.Connect();
                var output = client.RunCommand(comando);
                client.Disconnect();
                return output.Result;
            }
        }

        private string GetNodosDataOlsr(string ip)
        {
            try
            {
                var url = "http://" + ip + ":1980/telnet/netjsoninfo%20graph";
                WebRequest request = WebRequest.Create(url);
                WebResponse response = request.GetResponse();
                Stream dataStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(dataStream);
                var nodosJson = reader.ReadToEnd();
                reader.Close();
                response.Close();
                return nodosJson;
            }
            catch (Exception ex)
            {
                return "Error: " + ex.Message;
            }
        }
    }
}
