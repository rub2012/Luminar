using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Luminar.wwwroot.Entidades;

namespace Luminar.Models
{
    public class EnlaceDto
    {
        public int Costo { get; set; }
        public decimal Latitud { get; set; }
        public decimal Longitud { get; set; }
        public string Ip { get; set; }

    }
}
