namespace GoogleMaps.DAL.DBModel.JobAccauntingModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class JobsAccaunting
    {
        [Key]
        public int JobID { get; set; }

        public DateTime Date { get; set; }

        public decimal Quantity { get; set; }

        public decimal Square { get; set; }

        public int FieldID { get; set; }

        public int WorkKindID { get; set; }

        public int WorkTypeID { get; set; }

        public virtual Field Field { get; set; }

        public virtual WorkType WorkType { get; set; }
    }
}
