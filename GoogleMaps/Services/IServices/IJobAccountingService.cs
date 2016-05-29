using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using GoogleMaps.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GoogleMaps.Services
{
    public interface IJobAccountingService
    {
        List<JobsAccaunting> GetJobAccauntings(ShortFilterJobAccauntingModel filter);
        List<JobsAccaunting> GetJobsAccauntings(FilterJobAccauntinData filter);
    }
}
