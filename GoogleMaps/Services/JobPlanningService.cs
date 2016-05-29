using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using GoogleMaps.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GoogleMaps.Services
{
    public class JobPlanningService : IJobPlanningService
    {
        private JobAccauntingContext jobContext = new JobAccauntingContext();

        public List<FieldPlanningJob> GetFieldJobPlannings(FilterJobPlanningModel filter)
        {
            return jobContext.FieldPlanningJobs
                .Where(job => job.FieldId == filter.FieldId
                && (filter.StartYear == null || job.YearPlanning >= filter.StartYear)
                && (filter.EndYear == null || job.YearPlanning <= filter.EndYear)).ToList();
        }

        public List<FieldPlanningJob> GetJobPlanningByYear(Int32 year)
        {
            return jobContext.FieldPlanningJobs.Where(j => j.YearPlanning == year).ToList();
        }
    }
}