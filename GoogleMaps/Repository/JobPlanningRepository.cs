using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using GoogleMaps.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GoogleMaps.Repository
{
    //private static JobAccauntingContext jobContext = new JobAccauntingContext();

    public class JobPlanningRepository
    {

        public static JobPlanningModel GetJobPlanningModelFromFieldPlanning(FieldPlanningJob planningJob)
        {
            return new JobPlanningModel()
            {
                Culture = planningJob.Culture.CultureName,
                Year = planningJob.YearPlanning
            };
        }

        public static List<JobPlanningModel> GetJobPlanningModelFromFieldPlanning(List<FieldPlanningJob> planningJob)
        {
            List<JobPlanningModel> model = new List<JobPlanningModel>();

            foreach (var job in planningJob)
            {
                model.Add(GetJobPlanningModelFromFieldPlanning(job));
            }

            return model;
        }
    }
}