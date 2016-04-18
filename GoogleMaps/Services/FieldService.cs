using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using GoogleMaps.App_Start;

namespace GoogleMaps.Services
{
    public class FieldService : IFieldService
    {
        private DB_AGREntities dbContext = new DB_AGREntities();

        public void Create(AgrField field)
        {
            if (field != null)
            {
                dbContext.AgrFields.Add(field);
                field.PropertyType = new PropertyType() { Title = "2" };
                dbContext.SaveChanges();
                
            }
        }
        public List<AgrField> GetFields()
        {
            List<AgrField> fields = dbContext.AgrFields.ToList();
            return fields;
        }
    }
}