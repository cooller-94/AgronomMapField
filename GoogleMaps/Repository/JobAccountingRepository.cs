﻿using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using GoogleMaps.Models;
using GoogleMaps.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GoogleMaps.Repository
{
    public class JobAccountingRepository
    {
        private static JobAccauntingContext jobContext = new JobAccauntingContext();

        public static JobAccountingModel GetJobAccountinModelFromJob(JobsAccaunting job)
        {
            JobAccountingModel model = new JobAccountingModel();
            model.Date = job.Date;
            model.Quantity = (Int32)job.Quantity;
            model.WorkType = job.WorkType.TypeOfWork;
            model.WorkKind = jobContext.WorkKinds.Find(job.WorkKindID)?.KindOfWork ?? String.Empty;
            model.Square = (Int32)job.Square;
            model.Field = job.Field.FieldName;
            return model;
        }

        public static List<JobAccountingModel> GetJobAccountinModelFromJob(List<JobsAccaunting> jobs)
        {
            List<JobAccountingModel> model = new List<JobAccountingModel>();

            foreach(var item in jobs)
            {
                model.Add(GetJobAccountinModelFromJob(item));
            }

            return model;
        }

        public static JobPlanningModel GetJobPlanningModelFromFieldPlanning(FieldPlanningJob planningJob)
        {
            return new JobPlanningModel()
            {
                Culture = planningJob.Culture.CultureName,
                Year = planningJob.YearPlanning
            };
        }

        public static JobModel GetJobModelFromFromField(Field field)
        {
            JobModel model = new JobModel();
            model.JobAccountingModel = GetJobAccountinModelFromJob(field.JobsAccauntings.ToList());
            model.JobPlanningModel = JobPlanningRepository.GetJobPlanningModelFromFieldPlanning(field.FieldPlanningJobs.ToList());
            model.Field = FieldRepository.GetModelFromField(field);
            return model;
        }

        public static JobModel GetJobModelFromFromJobs(List<JobsAccaunting> jobs)
        {
            JobModel model = new JobModel();
            model.JobAccountingModel = GetJobAccountinModelFromJob(jobs);
            model.JobPlanningModel = JobPlanningRepository.GetJobPlanningModelFromFieldPlanning(jobs[0].Field.FieldPlanningJobs.ToList());
            model.Field = FieldRepository.GetModelFromField(jobs[0].Field);
            return model;
        }
    }
}