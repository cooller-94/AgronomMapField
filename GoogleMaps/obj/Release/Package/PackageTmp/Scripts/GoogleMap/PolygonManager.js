var PolygonManager = function (map) {
    this.setMap(map);
}

PolygonManager.prototype = {

    polygons: [],
    map: null,


    setMap: function (map) {
        this.map = map;
    },

    createPolygon: function (path, fieldId, isEditable) {

        var polygon = this.findPolygon(fieldId);

        if (polygon != null) {
            this.removePolygon(fieldId);
        }

        var fieldMap = new google.maps.Polygon({
            paths: path,
            strokeColor: '#BDB76B',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#BDB76B',
            fillOpacity: 0.35,
            editable: isEditable,
            draggable: isEditable
        });

        fieldMap.setMap(this.map);
        this.polygons.push({ polygon: fieldMap, fieldId: fieldId });
    },

    addPolygon: function (polygon, fieldId) {
        this.polygons.push({ polygon: polygon, fieldId: fieldId });
    },

    removePolygon: function (fieldId) {
        var removedPolygon = this.findPolygon(fieldId);
        removedPolygon.polygon.setMap(null);
        this.polygons = this.polygons.filter(function (item, index) { return item.fieldId != fieldId });
    },

    findPolygon: function (fieldId) {
        return this.polygons.filter(function (item, index) { return item.fieldId == fieldId })[0];
    },
}