using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GoogleMaps.Services
{
    public class SoilService
    {
        private JobAccauntingContext jobContext = new JobAccauntingContext();

        public List<Soil> GetSoils()
        {
            return jobContext.Soils.ToList();
        }
    }
}