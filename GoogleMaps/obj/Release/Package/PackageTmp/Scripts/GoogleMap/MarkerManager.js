var MarkerManager = function (map) {
    this.setMap(map);
}
MarkerManager.prototype = {

    markers: [],
    map: null,

    /**
     * Set the map
     * @access private
     * @param {HTMLElement} map Div with map
     */
    setMap: function (map) {
        this.map = map;
    },

    /**
     * Add new marker to the map
     * @access public
     * @param {google.maps.Marker} marker Marker to add
     */
    addMarker: function (marker) {
        this.markers.push(marker);
    },

    /**
     * Add new markers to the map
     * @access public
     * @param {Array of google.maps.Marker} markers Array of markers to add
     */
    addMarkers: function (markers) {
        this.markers.concat(markers);
    },

    /**
     * Get markers with latitude & longitude
     * @access public
     * @param {google.maps.LatLng} latlng Coordinates
     * @return {Array of google.maps.Marker} Array of markers
     */
    getMarker: function (latlng) {
        var array = [];
        for (var i in this.markers)
            if (this.markers[i].getPosition().equals(latlng))
                array.push(this.markers[i]);
        return array[0];
    },

    /**
     * Remove marker
     * @access public
     * @param {google.maps.Marker} marker Marker to remove
     * @return {google.maps.Marker} Removed marker
     */
    removeMarker: function (marker) {
        var index = this.inArray(marker, this.markers), current;
        if (index > -1) {
            current = this.markers.splice(index, 1);
            current[0].setMap(null);
        }
        return marker;
    },

    /**
     * Remove all marker
     * @access public
     */
    clearMarkers: function () {
        // this.map.clearOverlays();
        for (var i in this.markers)
            this.markers[i].setMap(null);
        this.markers = [];
    },

    /**
     * @access public
     * @return {int} Count of markers on the map
     */
    getMarkerCount: function () {
        return this.markers.length;
    },

    /**
     * @access public
     * @return {Array of google.maps.Marker} Return Array of visible markers
     */
    getVisibleMarkers: function () {
        var array = [];
        for (var i in this.markers) {
            if (this.isVisible(this.markers[i].getPosition()))
                array.push(this.markers[i]);
        }
        return array;
    },

    /**
     * For more information about getBounds look at google groups discussion
     * http://code.google.com/apis/maps/documentation/javascript/events.html#EventListeners
     * @access public
     * @param {google.maps.LatLng} latlng Coordinates of point
     * @return {boolean} is point visible
     */
    isVisible: function (latlng) {
        try {
            return this.map.getBounds().contains(latlng);
        } catch (e) {
            this.thowExcwprion('Map is not loaded yet');
        }
    },

    /**
     * Create a new marker and add it to map
     * Not the best implementation
     * It seems you should write your own
     * @access public
     * @param {google.maps.LatLng} position Coordinates
     * @param {string} color Marker color [red,black,grey,orange,white,yellow,purple,green]
     * @param {boolean} draggable Is marker draggable
     * @return {google.maps.Marker} created marker
     */
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

    /**
     * Fires when bounds are ready
     * @access public
     * @param {Function} callback function
     */
    onBoundsReady: function (fn) {
        google.maps.event.addListenerOnce(this.map, 'bounds_changed', fn);
    },

    /**
     * Search for item in array
     * @access public
     * @param {mixed} elem needle
     * @param {array} array haystack
     * @return {int} Index of item
     */
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

    /**
     * Throw an exception
     * @access private
     * @param {String} message
     */
    thowExcwprion: function (e) {
        throw e;
    }
}