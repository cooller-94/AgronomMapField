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

        public ActionResult GetWindowInfo(Int32? fieldId)
        {
            JobModel model = new JobModel();
            Field field = fieldService.GetField(fieldId.Value);

            if (field == null)
            {
                return this.GenerateJson(new { IsSuccess = false, Message = "Для данного поля нет данных" });
            }

            model = JobAccountingRepository.GetJobModelFromFromField(field);

            return PartialView("~/Views/GoogleMap/WindowInfo.cshtml", model);
        }

        private JsonResult GenerateJson(Object data)
        {
            return Json(new
            {
                data
            }, JsonRequestBehavior.AllowGet);
        }

    }
}