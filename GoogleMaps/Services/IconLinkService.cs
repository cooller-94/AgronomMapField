using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using GoogleMaps.HelperClasses;

namespace GoogleMaps.Services
{
    public class CultureLinkService
    {
        private JobAccauntingContext jobContext = new JobAccauntingContext();

        public CultureIconLink GetIconLinkForField(String culture)
        {
            return jobContext.CultureIconLinks?.Where(c => c.Culture.CultureName == culture)?.SingleOrDefault();
        }
    }
}