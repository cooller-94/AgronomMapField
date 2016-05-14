using System.Web;
using System.Web.Optimization;

namespace GoogleMaps
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery")
                .Include("~/Scripts/jquery-{version}.js")
                .Include("~/Scripts/jquery.unobtrusive-ajax.js", "~/Scripts/noty/jquery.noty.js", "~/Scripts/noty/themes/default.js", "~/Scripts/noty/layouts/*.js", "~/Scripts/noty/promise.js","~/Scripts/JQuery.tmpl.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));


            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js", "~/Scripts/bootstrap-multiselect.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css", "~/Content/bootstrap-multiselect.css"));


            bundles.Add(new StyleBundle("~/bundles/cadastre_ua").Include(
                       "~/Scripts/CadastreUA/OpenLayers.js",
                      "~/Scripts/CadastreUA/config.js", 
                      "~/Scripts/CadastreUA/proj4js-combined.js",
                      "~/Scripts/CadastreUA/region_cities.js",
                      "~/Scripts/CadastreUA/index.js", "~/Scripts/CadastreUA/system.js"));

            bundles.Add(new StyleBundle("~/bundles/Utils").Include( "~/Scripts/Utils/Utils.js"));
            bundles.Add(new StyleBundle("~/bundles/WeatherLib").Include("~/Scripts/Utils/Weather/jquery.simpleWeather.js"));
            //bundles.Add(new StyleBundle("~/bundles/ColorPicker").Include("~/Scripts/colorpicker/js/colorpicker.js",
            //     "~/Scripts/colorpicker/js/eye.js",
            //    "~/Scripts/colorpicker/js/layout.js",
            //    "~/Scripts/colorpicker/js/utils.js"));


        }
    }
}
