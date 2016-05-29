using GoogleMaps.DAL.DBModel;
using GoogleMaps.DAL.DBModel.JobAccauntingModels;
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
        public static FieldModel GetModelFromField(Field field)
        {
            FieldModel fieldModel = new FieldModel();
            fieldModel.Id = field.FieldID;
            fieldModel.FieldTitle = field.FieldName;
            fieldModel.Area = field.Area.HasValue ? Math.Round(field.Area.Value, 2) : 0;
            fieldModel.Owner = field?.OwnerName ?? String.Empty;
            fieldModel.SoildId = field.Soil.SoilID;
            fieldModel.PolygonPoints = new List<Point>();
            fieldModel.CurrentCulture = field.FieldPlanningJobs?.Where(jp => jp.YearPlanning == DateTime.Now.Year).SingleOrDefault()?.Culture.CultureName;
            fieldModel.CultureIconLink = new CultureLinkService().GetIconLinkForField(fieldModel.CurrentCulture)?.CultureIconLinl ?? Constant.DEFAULT_ICON_LINK;


            foreach (DAL.DBModel.JobAccauntingModels.AgrFieldLocation location in field.AgrFieldLocations)
            {
                fieldModel.PolygonPoints.Add(new Point { lat = location.lat, lng = location.lng });
            }

            return fieldModel;
        }

        public static List<FieldModel> GetFieldModelsFromField(List<Field> fields)
        {
            try
            {
                IList<FieldModel> result = new List<FieldModel>();

                foreach (Field field in fields)
                {
                    result.Add(GetModelFromField(field));
                }

                return result.ToList();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public static Field GetFieldFromModel(FormCollection model, out FormAction? action)
        {
            try
            {
                Field field = new Field();
                action = String.IsNullOrEmpty(model["Action"]) ? null : (Enum.Parse(typeof(FormAction), model["Action"]) as FormAction?);
                field.FieldName = model["FieldTitle"];
                field.SoilID = Int32.Parse(model["SoildId"]);
                field.Area = String.IsNullOrEmpty(model["Area"]) ? null : (float.Parse(model["Area"]) as float?);
                field.OwnerName = model["Owner"];
                field.FieldID = Int32.Parse(model["Id"]);

                if (action.HasValue && action.Value == FormAction.Create)
                {
                    List<Point> points = new JavaScriptSerializer().Deserialize<List<Point>>(model["PolygonPoints"]);

                    if (points != null)
                    {
                        foreach (Point point in points)
                        {
                            field.AgrFieldLocations.Add(new DAL.DBModel.JobAccauntingModels.AgrFieldLocation() { lat = point.lat, lng = point.lng });
                        }
                    }
                }

                return field;
            }
            catch (Exception ex)
            {
                action = null;
                return null;
            }

        }

        public static Field GetFieldFromModel(FieldModel fieldModel)
        {
            Field field = new Field();
            field.FieldName = fieldModel.FieldTitle;

            foreach (var point in fieldModel.PolygonPoints)
            {
                field.AgrFieldLocations.Add(new DAL.DBModel.JobAccauntingModels.AgrFieldLocation()
                {
                    lat = point.lat,
                    lng = point.lng
                });
            }

            return field;
        }
    }
}