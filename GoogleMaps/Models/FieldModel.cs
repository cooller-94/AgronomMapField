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
        public Int32 Id { get; set; }

        [Display(Name = "Название поля")]
        [Required]
        public String FieldTitle { get; set; }

        //public FieldJobState FieldJobState { get; set; }

        [Display(Name = "Площадь")]
        [Required]
        [Range(0,99999)]
        public Double Area { get; set; }

        [Display(Name = "Владелец")]
        [Required]
        public String Owner { get; set; }

        public String CurrentCulture { get; set; }
        public String CultureIconLink { get; set; }

        public List<Point> PolygonPoints { get; set; }

    }

}