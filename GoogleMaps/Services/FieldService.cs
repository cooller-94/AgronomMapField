using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using GoogleMaps.DAL.DBModel;
using GoogleMaps.HelperClasses;
using GoogleMaps.DAL.DBModel.JobAccauntingModels;

namespace GoogleMaps.Services
{
    public class FieldService
    {
        private JobAccauntingContext jobContext = new JobAccauntingContext();

        public bool AddLocation(int fieldId, List<Point> polygon)
        {
            try
            {
                Field field = jobContext.Fields.Find(fieldId);

                if (field == null)
                {
                    return false;
                }

                foreach (Point point in polygon)
                {
                    field.AgrFieldLocations.Add(new DAL.DBModel.JobAccauntingModels.AgrFieldLocation() { lat = point.lat, lng = point.lng });
                }

                jobContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public Boolean Create(Field field, out Int32? fieldId)
        {
            try
            {
                if (field != null)
                {
                    jobContext.Fields.Add(field);
                    jobContext.SaveChanges();
                    fieldId = field.FieldID;
                    return true;
                }
                else
                {
                    fieldId = null;
                    return false;
                }
            }
            catch (Exception ex)
            {
                fieldId = null;
                return false;
            }
        }

        public List<Field> GetFields()
        {
            List<Field> fields = jobContext.Fields.ToList();
            return fields;
        }

        public Field GetField(Int32 id)
        {
            return jobContext.Fields.Find(id);
        }
    }
}