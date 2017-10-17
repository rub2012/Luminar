using System.Collections.Generic;

namespace Luminar.wwwroot.Entidades
{
    public class Nodo
    {
        public int Id { get; set; }
        public int PosicionX { get; set; }
        public int PosicionY { get; set; }
        public IList<Nodo> Vecinos { get; set; }
        public bool Activo { get; set; }
        public string Ip { get; set; }
    }
}
