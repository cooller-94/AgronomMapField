namespace GoogleMaps.DAL.DBModel.JobAccauntingModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Grade
    {
        public int GradeID { get; set; }

        public string GradeName { get; set; }

        public int CultureID { get; set; }

        public virtual Culture Culture { get; set; }
    }
}
