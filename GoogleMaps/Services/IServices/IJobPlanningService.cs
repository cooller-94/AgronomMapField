using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using GoogleMaps.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GoogleMaps.Services
{
    public interface IJobPlanningService
    {
        List<FieldPlanningJob> GetFieldJobPlannings(FilterJobPlanningModel filter);
        List<FieldPlanningJob> GetJobPlanningByYear(Int32 year);
    }
}
