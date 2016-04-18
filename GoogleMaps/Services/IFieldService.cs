using GoogleMaps.App_Start;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GoogleMaps.Services
{
    public interface IFieldService
    {
        void Create(AgrField field);
        List<AgrField> GetFields();
    }
}
