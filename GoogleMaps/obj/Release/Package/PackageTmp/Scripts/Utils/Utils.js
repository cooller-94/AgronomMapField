var Util = {
    EarthRadius: 6378137,
    OriginShift: 2 * Math.PI * 6378137 / 2,

    //functions
    MetersToLatLon: function (point) {
        var ll = {};
        ll.Longitude = (point.X / Util.OriginShift) * 180;
        ll.Latitude = (point.Y / Util.OriginShift) * 180;
        ll.Latitude = 180 / Math.PI * (2 * Math.atan(Math.exp(ll.Latitude * Math.PI / 180)) - Math.PI / 2);
        return ll;
    }
}