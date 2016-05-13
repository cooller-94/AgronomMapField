namespace GoogleMaps.DAL.DBModel.JobAccauntingModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class FieldPlanningJob
    {
        public int Id { get; set; }

        public int FieldId { get; set; }

        public int YearPlanning { get; set; }

        public int CultureId { get; set; }

        public virtual Culture Culture { get; set; }

        public virtual Field Field { get; set; }
    }
}
