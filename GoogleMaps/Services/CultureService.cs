using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GoogleMaps.Services
{
    public class CultureService
    {
        private JobAccauntingContext jobContext = new JobAccauntingContext();

        public List<Culture> GetCultures()
        {
            return jobContext.Cultures.ToList();
        }
    }
}