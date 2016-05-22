var MarkerManager = function (map) {
    this.setMap(map);
}
MarkerManager.prototype = {

    markers: [],
    map: null,

    setMap: function (map) {
        this.map = map;
    },

    addMarker: function (marker) {
        this.markers.push(marker);
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

    removeMarker: function (marker) {
        var index = this.inArray(marker, this.markers), current;
        if (index > -1) {
            current = this.markers.splice(index, 1);
            current[0].setMap(null);
        }
        return marker;
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

    createMarker: function (position, markImage, animation) {
        var marker = new google.maps.Marker({
            map: this.map,
            position: position,
            icon: markImage,
            animation: animation
        });
        this.addMarker(marker);
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