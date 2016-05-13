namespace GoogleMaps.DAL.DBModel.JobAccauntingModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Pesticide
    {
        public int PesticideID { get; set; }

        [Required]
        public string PesticideName { get; set; }

        [Required]
        public string ActiveSubstance { get; set; }

        public DateTime RegistrationDate { get; set; }

        public int ChemicalGroupID { get; set; }

        public virtual ChemicalGroup ChemicalGroup { get; set; }
    }
}
