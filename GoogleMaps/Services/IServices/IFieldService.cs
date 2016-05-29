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
        bool AddLocation(int fieldId, List<Point> polygon);
        Boolean EditLocation(Int32 fieldId, List<Point> newPolygon);
        Boolean Create(Field field, out Int32? fieldId);
        Boolean Delete(Int32 fieldId);
        Boolean Edit(Field field);
        List<Field> GetFields();
        Field GetField(Int32 id);
        Field GetField(String fieldName);
    }
}
