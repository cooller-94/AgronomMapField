using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GoogleMaps.Services
{
    public interface ICultureIconService
    {
        CultureIconLink GetIconLinkForField(String culture);
        List<CultureIconLink> GetCulureIcons();
        Boolean AddEdit(Int32 cultureId, String link);
    }
}
