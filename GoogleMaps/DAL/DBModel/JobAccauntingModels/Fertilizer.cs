namespace GoogleMaps.DAL.DBModel.JobAccauntingModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Fertilizer
    {
        public int FertilizerID { get; set; }

        public int FertilizerGroupID { get; set; }

        public string FertilizerName { get; set; }

        public virtual FertilizerGroup FertilizerGroup { get; set; }
    }
}
