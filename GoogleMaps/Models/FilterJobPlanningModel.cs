using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GoogleMaps.Models
{
    public class FilterJobPlanningModel
    {
        public Int32 FieldId { get; set; }

        [Range(1999, 2030)]
        public Int32? StartYear { get; set; }

        [Range(1999, 2030)]
        public Int32? EndYear { get; set; }
    }
}