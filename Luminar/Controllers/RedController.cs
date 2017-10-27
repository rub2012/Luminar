using Microsoft.AspNetCore.Mvc;
using Renci.SshNet;
using System;

namespace Luminar.Controllers
{
    public class RedController : Controller
    {
        public RedController()
        {

        }
        public IActionResult Index()
        {
            //Console.WriteLine(EjecutarComando("python3 /home/pi/scripts/leerEstadoLampara.py", "192.168.1.100",22,"pi","root"));
            return View("Grafico",null);
        }

        private string EjecutarComando(string comando,string host,int port,string user,string password)
        {
            using (var client = new SshClient(host, port, user, password))
            {
                client.Connect();
                var output = client.RunCommand(comando);
                client.Disconnect();
                return output.Result;
            }
        }
    }
}
