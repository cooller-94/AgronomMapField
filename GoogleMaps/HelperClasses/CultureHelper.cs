using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using GoogleMaps.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GoogleMaps.HelperClasses
{
    public static class CultureHelper
    {
        public static List<SelectListItem> GetCultureValues()
        {
            List<SelectListItem> items = new List<SelectListItem>();
            List<Culture> cultures = new CultureService().GetCultures();
            SelectListGroup group = new SelectListGroup() { Name = "Культуры" };

            foreach (var culture in cultures)
            {
                items.Add(new SelectListItem { Text = culture.CultureName, Value = culture.CultureID.ToString(), Selected = true, Group = group });
            }

            return items;
        }
    }
}