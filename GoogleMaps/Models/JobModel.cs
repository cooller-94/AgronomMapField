using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GoogleMaps.Models
{
    public class JobModel
    {
        public FieldModel Field { get; set; }
        public List<JobAccountingModel> JobAccountingModel { get; set; }
        public List<JobPlanningModel> JobPlanningModel { get; set; }
    }
}