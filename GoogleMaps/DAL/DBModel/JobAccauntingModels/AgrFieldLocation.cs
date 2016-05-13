namespace GoogleMaps.DAL.DBModel.JobAccauntingModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("AgrFieldLocation")]
    public partial class AgrFieldLocation
    {
        [Key]
        [Column(Order = 0)]
        public int AgrFieldLocationId { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int FieldId { get; set; }

        public double lat { get; set; }

        public double lng { get; set; }

        public virtual Field Field { get; set; }
    }
}
