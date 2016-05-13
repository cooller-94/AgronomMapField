using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GoogleMaps.Models
{
    public class JobPlanningModel
    {
        [Display(Name ="Год посева")]
        public Int32 Year { get; set; }

        [Display(Name = "Культура")]
        public String Culture { get; set; }
    }
}