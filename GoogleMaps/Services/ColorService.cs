using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using GoogleMaps.HelperClasses;

namespace GoogleMaps.Services
{
    public class ColorService
    {
        private JobAccauntingContext jobContext = new JobAccauntingContext();

        public CultureIconLink GetColorForField(FieldJobState state)
        {
            return jobContext.CultureIconLinks?.Where(c => c.Culture.CultureName == state.Culture)?.SingleOrDefault();
        }
    }
}