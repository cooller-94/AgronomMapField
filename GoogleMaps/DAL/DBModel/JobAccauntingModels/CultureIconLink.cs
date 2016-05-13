namespace GoogleMaps.DAL.DBModel.JobAccauntingModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class CultureIconLink
    {
        public int Id { get; set; }

        public int CultureId { get; set; }

        public string CultureIconLinl { get; set; }

        public virtual Culture Culture { get; set; }
    }
}
