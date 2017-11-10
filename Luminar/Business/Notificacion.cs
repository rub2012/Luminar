using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Luminar.Business
{
    public class Notificacion : Hub
    {
        public Task Send(string data)
        {
            return Clients.All.InvokeAsync("Send", data);
        }
    }
}
