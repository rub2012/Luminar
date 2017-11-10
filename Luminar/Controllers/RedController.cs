using Luminar.Business;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Renci.SshNet;

namespace Luminar.Controllers
{
    public class RedController : Controller
    {
        private readonly IHubContext<Notificacion> _hubcontext;
        public RedController(IHubContext<Notificacion> hub)
        {
            _hubcontext = hub;
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

        [HttpGet]
        public IActionResult Send(string mensaje)
        {
            //for everyone
            this._hubcontext.Clients.All.InvokeAsync("Send", mensaje);

            return this.Ok();
        }
    }
}
