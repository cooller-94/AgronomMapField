using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GoogleMaps.Models
{
    public class ShortFilterJobAccauntingModel
    {
        public Int32 FieldId { get; set; }
        public DateTime? StartDate { get; set; }

        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        [Display(Name = "Конечная дата")]
        public DateTime? EndDate { get; set; }

        public ShortFilterJobAccauntingModel()
        {
            StartDate = DateTime.MinValue;
            EndDate = DateTime.MaxValue;
        }
    }
}