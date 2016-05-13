using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GoogleMaps.Models
{
    public class JobAccountingModel
    {
        public String Field { get; set; }

        [Display(Name = "Дата")]
        public DateTime Date { get; set; }

        [Display(Name = "Количество")]
        public Int32 Quantity { get; set; }

        [Display(Name = "Обработання плащадь")]
        public Double Square { get; set; }

        [Display(Name = "Вид работы")]
        public String WorkKind { get; set; }

        [Display(Name = "Тип работы")]
        public String WorkType { get; set; }
    }
}