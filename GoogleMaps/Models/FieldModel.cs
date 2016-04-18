using GoogleMaps.HelperClasses;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GoogleMaps.Models
{
    public class FieldModel
    {
        [Display(Name = "Название поля")]
        [Required]
        public String FieldTitle { get; set; }

        [Display(Name = "Площадь поля")]
        public Double Area { get; set; }
        public List<Point> PolygonPoints { get; set; }

    }
}