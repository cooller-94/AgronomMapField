using GoogleMaps.App_Start;
using GoogleMaps.HelperClasses;
using GoogleMaps.Models;
using GoogleMaps.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace GoogleMaps.Repository
{
    public class FieldRepository
    {
        public static FieldModel GetModelFromField(AgrField field)
        {
            FieldModel fieldModel = new FieldModel();
            fieldModel.FieldTitle = field.Title;
            fieldModel.Area = field.Area;
            fieldModel.PolygonPoints = new List<Point>();

            foreach (AgrFieldLocation location in field.AgrFieldLocations)
            {
                fieldModel.PolygonPoints.Add(new Point{ lat = location.lat, lng = location.lng });
            }

            return fieldModel;
        }

        public static List<FieldModel> GetFieldModelsFromField(List<AgrField> fields)
        {
            try
            {
                IList<FieldModel> result = new List<FieldModel>();

                foreach (AgrField field in fields)
                {
                    result.Add(GetModelFromField(field));
                }

                return result.ToList();
            }
            catch(Exception)
            {
                return null;
            }
        }

        public static AgrField GetFieldFromModel(FormCollection model)
        {
            try {
                AgrField field = new AgrField();
                field.Title = model["FieldTitle"];
                field.Area = float.Parse(model["Area"]);
                List<Point> points = new JavaScriptSerializer().Deserialize<List<Point>>(model["PolygonPoints"]);

                foreach (Point point in points)
                {
                    field.AgrFieldLocations.Add(new AgrFieldLocation() { lat = point.lat, lng = point.lng });
                }

                return field;
            }
            catch(Exception)
            {
                return null;
            }

        }

        public static AgrField GetFieldFromModel(FieldModel fieldModel)
        {
            AgrField field = new AgrField();
            field.Title = fieldModel.FieldTitle;
            field.Area = (float)fieldModel.Area;

            foreach (var point in fieldModel.PolygonPoints)
            {
                field.AgrFieldLocations.Add(new AgrFieldLocation()
                {
                    lat = point.lat,
                    lng = point.lng
                });
            }

            return field;
        }

        public static Boolean AddField(AgrField field)
        {
            try
            {
                new FieldService().Create(field);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}