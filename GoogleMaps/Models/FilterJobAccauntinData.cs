using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GoogleMaps.Models
{
    public class FilterJobAccauntinData
    {
        [Display(Name = "Поле")]
        public Int32? FieldId { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        [Display(Name = "Начальная дата")]
        public DateTime? StartDate { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        [Display(Name = "Конечная дата")]
        public DateTime? EndDate { get; set; }

        [Display(Name = "Год работы")]
        public Int32 Year { get; set; }

        public Int32? CultureId { get; set; }

        public FilterJobAccauntinData()
        {
            StartDate = DateTime.MinValue;
            EndDate = DateTime.MaxValue;
            FieldId = null;
            CultureId = null;
            Year = 2016;
        }
    }
}