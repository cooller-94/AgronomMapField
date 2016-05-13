using GoogleMaps.DAL.DBModel;
using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using GoogleMaps.HelperClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GoogleMaps.Services
{
    public interface IFieldService
    {
        //Boolean Create(AgrField field, out Int32? fieldId);
        Boolean Create(Field field, out Int32? fieldId);
        Boolean AddLocation(Int32 fieldId, List<Point> polygon);
        //List<AgrField> GetFields();
        //AgrField GetField(Int32 id);
    }
}
