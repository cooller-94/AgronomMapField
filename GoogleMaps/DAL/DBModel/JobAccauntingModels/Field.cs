namespace GoogleMaps.DAL.DBModel.JobAccauntingModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Field
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Field()
        {
            FieldPlanningJobs = new HashSet<FieldPlanningJob>();
            AgrFieldLocations = new HashSet<AgrFieldLocation>();
            JobsAccauntings = new HashSet<JobsAccaunting>();
        }

        public int FieldID { get; set; }

        public string FieldName { get; set; }

        public float? Area { get; set; }

        public string OwnerName { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<FieldPlanningJob> FieldPlanningJobs { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<AgrFieldLocation> AgrFieldLocations { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<JobsAccaunting> JobsAccauntings { get; set; }
    }
}
