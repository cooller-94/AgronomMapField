var MarkerManager = function (map) {
    this.setMap(map);
}
MarkerManager.prototype = {

    markers: [],
    map: null,

    setMap: function (map) {
        this.map = map;
    },

    addMarker: function (marker, fieldId) {
        this.markers.push({ marker: marker, fieldId: fieldId });
    },

    addMarkers: function (markers) {
        this.markers.concat(markers);
    },

    getMarker: function (latlng) {
        var array = [];
        for (var i in this.markers)
            if (this.markers[i].getPosition().equals(latlng))
                array.push(this.markers[i]);
        return array[0];
    },

    getMarkerByFieldId: function (fieldId) {
        var marker = this.markers.filter(function (item, index) { return item.fieldId == fieldId })[0];
        return marker == null ? null : marker.marker;
    },

    removeMarker: function (marker) {
        var index = this.inArray(marker, this.markers), current;
        if (index > -1) {
            current = this.markers.splice(index, 1);
            current[0].setMap(null);
        }
        return marker;
    },

    removeMarkerByFieldId: function (fieldId) {
        var removedMarker = this.getMarkerByFieldId(fieldId);
        google.maps.event.clearListeners(removedMarker, 'click');
        removedMarker.setMap(null);
        this.markers = this.markers.filter(function (item, index) { return item.fieldId != fieldId });
    },

    clearMarkers: function () {
        // this.map.clearOverlays();
        for (var i in this.markers)
            this.markers[i].setMap(null);
        this.markers = [];
    },

    getMarkerCount: function () {
        return this.markers.length;
    },


    getVisibleMarkers: function () {
        var array = [];
        for (var i in this.markers) {
            if (this.isVisible(this.markers[i].getPosition()))
                array.push(this.markers[i]);
        }
        return array;
    },

    isVisible: function (latlng) {
        try {
            return this.map.getBounds().contains(latlng);
        } catch (e) {
            this.thowExcwprion('Map is not loaded yet');
        }
    },

    createMarker: function (position, markImage, animation, fieldId) {
        var marker = new google.maps.Marker({
            map: this.map,
            position: position,
            icon: markImage,
            animation: animation
        });
        this.addMarker(marker, fieldId);
        return marker;
    },

    onBoundsReady: function (fn) {
        google.maps.event.addListenerOnce(this.map, 'bounds_changed', fn);
    },

    inArray: function (elem, array) {
        if (array.indexOf) {
            return array.indexOf(elem);
        }

        for (var i = 0, length = array.length; i < length; i++) {
            if (array[i] === elem) {
                return i;
            }
        }

        return -1;
    },

    thowExcwprion: function (e) {
        throw e;
    }
}