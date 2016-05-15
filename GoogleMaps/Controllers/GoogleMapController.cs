using GoogleMaps.DAL.DBModel;
using GoogleMaps.DAL.DBModel.JobAccauntingModels;
using GoogleMaps.HelperClasses;
using GoogleMaps.Models;
using GoogleMaps.Repository;
using GoogleMaps.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.Services;

namespace GoogleMaps.Controllers
{
    [Authorize]
    public class GoogleMapController : Controller
    {
        private FieldService fieldService = new FieldService();
        private JobAccauntingService jobService = new JobAccauntingService();
        private JobPlanningService jobPlanningService = new JobPlanningService();
        // GET: GoogleMap
        public ActionResult Index()
        {
            var Cities = new SelectList(new List<SelectListItem>
            {
                new SelectListItem {Selected = true,Text = "Select", Value = "-1" },
                new SelectListItem() {Selected = false, Text = "Ивано-Франковск", Value =  "2600000000"},
                new SelectListItem() {Selected = false, Text = "Крым", Value =  "100000000"},
                new SelectListItem() {Selected = false, Text = "Винницкая", Value =  "500000000"},
                new SelectListItem() {Selected = false, Text = "Волынская", Value =  "700000000"},
                new SelectListItem() {Selected = false, Text = "Днепропетровская", Value =  "1200000000"},
            }, "Value", "Text");

            ViewBag.Cities = Cities;
            ViewBag.Cultures = CultureHelper.GetCultureValues();

            return View();
        }

        [HttpPost]
        public JsonResult AddNewField(FormCollection fieldModel)
        {
            Int32? fieldId = 0;
            Field field = FieldRepository.GetFieldFromModel(fieldModel);

            if (fieldService.Create(field, out fieldId))
            {
                return this.GenerateJson(new { IsSuccess = true, FieldId = fieldId });
            }

            return this.GenerateJson(new { IsSuccess = false });
        }

        [HttpPost]
        public JsonResult AddFieldLocation(Int32 fieldId, List<Point> polygon)
        {
            if (polygon == null || polygon.Count == 0)
            {
                return this.GenerateJson(new { IsSuccess = false, ErrorMessage = "Произошла ошибка. Неверный данные" });
            }

            return this.GenerateJson(new { IsSuccess = fieldService.AddLocation(fieldId, polygon) });
        }

        public ActionResult GetFieldInfo(Int32? fieldId)
        {
            if (!fieldId.HasValue)
            {
                return PartialView("~/Views/GoogleMap/FieldInfo.cshtml", new FieldModel());
            }

            return PartialView("~/Views/GoogleMap/FieldInfo.cshtml", new FieldModel());
        }

        public JsonResult LoadFields()
        {

            List<FieldModel> result = FieldRepository.GetFieldModelsFromField(fieldService.GetFields());

            if (result != null)
            {
                return Json(new
                {
                    IsSuccess = true,
                    Fields = result
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new
                {
                    IsSuccess = false
                }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult LoadField(Int32? id)
        {
            FieldModel model = FieldRepository.GetModelFromField(fieldService.GetField(id.Value));
            return model != null ? Json(new { IsSuccess = true, Field = model }, JsonRequestBehavior.AllowGet) : Json(new { IsSuccess = true }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetWindowInfo()
        {
            return PartialView("~/Views/GoogleMap/WindowInfo.cshtml");
        }

        private JsonResult GenerateJson(Object data)
        {
            return Json(new
            {
                data
            }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetFieldPartial(Int32 fieldId)
        {
            FieldModel model = FieldRepository.GetModelFromField(fieldService.GetField(fieldId));

            if (model == null)
            {
                return this.GenerateJson(new { IsSuccess = false, Message = "Для данного поля нет данных" });
            }

            return PartialView("~/Views/GoogleMap/FieldView.cshtml", model);
        }

        public ActionResult GetJobAccaunting(ShortFilterJobAccauntingModel filter)
        {
            List<JobAccountingModel> model = new List<JobAccountingModel>();
            model = JobAccountingRepository.GetJobAccountinModelFromJob(jobService.GetJobAccauntings(filter));

            if (model == null)
            {
                return this.GenerateJson(new { IsSuccess = false, Message = "Для данного поля нет данных" });
            }

            return PartialView("~/Views/GoogleMap/JobAccauntingView.cshtml", model);
        }

        public ActionResult GetJobPlaning(FilterJobPlanningModel filter)
        {
            List<JobPlanningModel> model = new List<JobPlanningModel>();
            model = JobPlanningRepository.GetJobPlanningModelFromFieldPlanning(jobPlanningService.GetFieldJobPlannings(filter));

            if (model == null)
            {
                return this.GenerateJson(new { IsSuccess = false, Message = "Для данного поля нет данных" });
            }

            return PartialView("~/Views/GoogleMap/JobPlanningView.cshtml", model);
        }

        #region Statistics

        public ActionResult GetAreaInfo(Int32? year)
        {
            List<FieldPlanningJob> jobs = jobPlanningService.GetJobPlanningByYear(year.HasValue ? year.Value : DateTime.Now.Year);

            return this.GenerateJson(new
            {
                IsSuccess = true,
                Cultures = jobs.GroupBy(j => j.Culture.CultureID).SelectMany(item => item.Select(s => new { Culture = s.Culture.CultureName, Area = item.Sum(c => c.Field.Area) }).Distinct())
            });
        }

        [HttpPost]
        public ActionResult GetJobForCalendar(FilterJobAccauntinData filter)
        {
            var jobs = jobService.GetJobsAccauntings(filter);

            return this.GenerateJson(new
            {
                IsSuccess = true,
                Jobs = jobs.Select(s => new { Year = s.Date.Year, Month = s.Date.Month, Day = s.Date.Day, Area = s.Square })
            });
        }

        public ActionResult GetJobAccauntingFilter()
        {
            FilterJobAccauntinData model = new FilterJobAccauntinData();
            ViewBag.Fields = new List<SelectListItem>(fieldService.GetFields().Select(c => new SelectListItem() { Text = c.FieldName, Value = c.FieldID.ToString() }));

            ViewBag.Years = new List<SelectListItem>
            {
                new SelectListItem {Text = "Select", Value = "-1" },
                new SelectListItem() { Text = "2012", Value =  "2012"},
                new SelectListItem() { Text = "2013", Value =  "2013"},
                new SelectListItem() { Text = "2014", Value =  "2014"},
                new SelectListItem() { Text = "2015", Value =  "2015"},
                new SelectListItem() { Text = "2016", Value =  "2016"},
            };

            return PartialView("~/Views/GoogleMap/JobAccauntingFilterPartial.cshtml", model);
        }

        #endregion Statistics
    }
}