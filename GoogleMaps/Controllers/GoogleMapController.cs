using GoogleMaps.App_Start;
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

namespace GoogleMaps.Controllers
{
    public class GoogleMapController : Controller
    {
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
            },"Value","Text");

            ViewBag.Cities = Cities;

            return View();
        }

        [HttpPost]
        public JsonResult AddNewField(FormCollection fieldModel)
        {
            try
            {
                AgrField field = FieldRepository.GetFieldFromModel(fieldModel);
                new FieldService().Create(field);
                return this.GenerateJson(new { IsSuccess = true });
            }
            catch (Exception)
            {
                return this.GenerateJson(new { IsSuccess = false });
            }
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

            List<FieldModel> result = FieldRepository.GetFieldModelsFromField(new FieldService().GetFields());

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

        private JsonResult GenerateJson(Object data)
        {
            return Json(new
            {
                data
            }, JsonRequestBehavior.AllowGet);
        }
    }
}