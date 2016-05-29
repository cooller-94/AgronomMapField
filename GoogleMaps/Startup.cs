using Microsoft.Owin;
using Owin;
using Microsoft.Framework.DependencyInjection;
using GoogleMaps.Services;

[assembly: OwinStartupAttribute(typeof(GoogleMaps.Startup))]
namespace GoogleMaps
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            
        }
    }
}
