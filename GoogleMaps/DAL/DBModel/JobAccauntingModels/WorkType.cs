namespace GoogleMaps.DAL.DBModel.JobAccauntingModels
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class WorkType
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public WorkType()
        {
            JobsAccauntings = new HashSet<JobsAccaunting>();
        }

        public int WorkTypeID { get; set; }

        public int WorkKindID { get; set; }

        public string TypeOfWork { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<JobsAccaunting> JobsAccauntings { get; set; }

        public virtual WorkKind WorkKind { get; set; }
    }
}
