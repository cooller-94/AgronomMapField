//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace GoogleMaps.App_Start
{
    using System;
    using System.Collections.Generic;
    
    public partial class AgrFieldLocation
    {
        public int AgrFieldLocationId { get; set; }
        public int FieldId { get; set; }
        public double lat { get; set; }
        public double lng { get; set; }
    
        public virtual AgrField AgrField { get; set; }
    }
}
