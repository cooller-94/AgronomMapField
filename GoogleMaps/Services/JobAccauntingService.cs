using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using GoogleMaps.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GoogleMaps.Services
{
    public class JobAccauntingService
    {
        private JobAccauntingContext jobContext = new JobAccauntingContext();

        public List<JobsAccaunting> GetJobAccauntings(ShortFilterJobAccauntingModel filter)
        {
            return jobContext.JobsAccauntings
                .Where(job => job.FieldID == filter.FieldId 
                && (filter.StartDate == null || job.Date >=  filter.StartDate) 
                && (filter.EndDate == null || job.Date <= filter.EndDate)).ToList();
        }

        public List<JobsAccaunting> GetJobsAccauntings(FilterJobAccauntinData filter)
        {
            return jobContext.JobsAccauntings.Where(j => j.Date.Year == filter.Year &&  j.FieldID == filter.FieldId).ToList();
        }
    }
}