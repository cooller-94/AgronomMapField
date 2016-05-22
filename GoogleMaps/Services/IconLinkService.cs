using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using GoogleMaps.HelperClasses;
using System.Data.Entity;

namespace GoogleMaps.Services
{
    public class CultureLinkService
    {
        private JobAccauntingContext jobContext = new JobAccauntingContext();

        public CultureIconLink GetIconLinkForField(String culture)
        {
            return jobContext.CultureIconLinks?.Where(c => c.Culture.CultureName == culture)?.SingleOrDefault();
        }

        public List<CultureIconLink> GetCulureIcons()
        {
            return jobContext.CultureIconLinks.ToList();
        }

        public Boolean AddEdit(Int32 cultureId, String link)
        {
            try
            {
                var cultureIcon = jobContext.CultureIconLinks.Where(p => p.CultureId == cultureId).SingleOrDefault();

                if (cultureIcon == null)
                {
                    cultureIcon = new CultureIconLink()
                    {
                        CultureId = cultureId,
                        CultureIconLinl = link
                    };

                    jobContext.Entry<CultureIconLink>(cultureIcon).State = EntityState.Added;
                }
                else
                {
                    cultureIcon.CultureIconLinl = link;
                    jobContext.Entry<CultureIconLink>(cultureIcon).State = EntityState.Modified;
                }

                jobContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}