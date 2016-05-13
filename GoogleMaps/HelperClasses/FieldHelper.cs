using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GoogleMaps.HelperClasses
{
    public class FieldHelper
    {
        public static FieldJobState GetCurrentState(List<JobsAccaunting> jobs)
        {
            JobsAccaunting job = jobs.Where(j => j.WorkKindID == (Int32)WorkType.Harvesting || j.WorkKindID == (Int32)WorkType.SowingCulture).LastOrDefault();
            FieldJobState state = null;

            if (job != null)
            {
                state = new FieldJobState();
                state.Type = (WorkType)job.WorkKindID;

                if (job.WorkType.TypeOfWork.Contains(Constant.Corn))
                {
                    state.Culture = CulturesString.Corn;
                }

                if (job.WorkType.TypeOfWork.Contains(Constant.Sunflower))
                {
                    state.Culture = CulturesString.Sunflower;
                }
            }

            return state;
        }
    }
}