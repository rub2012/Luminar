using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Luminar.wwwroot.Entidades;

namespace Luminar.Models
{
    public class NodoDto
    {
        public int Id { get; set; }
        public int PosicionX { get; set; }
        public int PosicionY { get; set; }
        public IList<NodoDto> Vecinos { get; set; }
        public bool Activo { get; set; }
        public string Ip { get; set; }
    }
}
