namespace GoogleMaps.DAL.DBModel.JobAccauntingModels
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class JobAccauntingContext : DbContext
    {
        public JobAccauntingContext()
            : base("name=JobAccauntingContext")
        {
        }

        public virtual DbSet<C__MigrationHistory> C__MigrationHistory { get; set; }
        public virtual DbSet<ChemicalGroup> ChemicalGroups { get; set; }
        public virtual DbSet<CultureIconLink> CultureIconLinks { get; set; }
        public virtual DbSet<Culture> Cultures { get; set; }
        public virtual DbSet<FertilizerGroup> FertilizerGroups { get; set; }
        public virtual DbSet<Fertilizer> Fertilizers { get; set; }
        public virtual DbSet<FieldPlanningJob> FieldPlanningJobs { get; set; }
        public virtual DbSet<Field> Fields { get; set; }
        public virtual DbSet<Grade> Grades { get; set; }
        public virtual DbSet<JobsAccaunting> JobsAccauntings { get; set; }
        public virtual DbSet<Pesticide> Pesticides { get; set; }
        public virtual DbSet<Soil> Soils { get; set; }
        public virtual DbSet<Tillage> Tillages { get; set; }
        public virtual DbSet<WorkKind> WorkKinds { get; set; }
        public virtual DbSet<WorkType> WorkTypes { get; set; }
        public virtual DbSet<AgrFieldLocation> AgrFieldLocations { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Culture>()
                .HasMany(e => e.CultureIconLinks)
                .WithRequired(e => e.Culture)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Culture>()
                .HasMany(e => e.FieldPlanningJobs)
                .WithRequired(e => e.Culture)
                .WillCascadeOnDelete(false);
        }
    }
}
