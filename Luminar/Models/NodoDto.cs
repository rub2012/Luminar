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
        public decimal Latitud { get; set; }
        public decimal Longitud { get; set; }
        public IList<EnlaceDto> Vecinos { get; set; }
        public bool Activo { get; set; }
        public string Ip { get; set; }
    }
}
