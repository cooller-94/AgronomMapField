namespace GoogleMaps.DAL.DBModel.JobAccauntingModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ChemicalGroup
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public ChemicalGroup()
        {
            Pesticides = new HashSet<Pesticide>();
        }

        public int ChemicalGroupID { get; set; }

        public string Name { get; set; }

        public string Property { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Pesticide> Pesticides { get; set; }
    }
}
