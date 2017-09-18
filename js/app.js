var map;

// Create a new blank array for all the listing markers.
var markers = [];
var infowindow;
var locations = [
    { title: 'Iolani Palace', location: { lat: 21.306757, lng: -157.85877 } },
    { title: 'Ala Moana Beach Park', location: { lat: 21.28967, lng: -157.848485 } },
    { title: 'Waikiki Aquarium', location: { lat: 21.265892, lng: -157.821723 } },
    { title: 'Honolulu Zoo', location: { lat: 21.27109, lng: -157.821478 } },
    { title: 'Kahanamoku Beach', location: { lat: 21.281067, lng: -157.839467 } },
    { title: 'Kakaako Waterfront Park', location: { lat: 21.293773, lng: -157.864222 } },
    { title: 'Duke Kahanamoku Statue', location: { lat: 21.27552, lng: -157.825324 } },
    { title: 'Magic Island Lagoon', location: { lat: 21.283032, lng: -157.846867 } },
];

function initMap() {
    // Create a styles array to use with the map.
    var styles = [{
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#e85113"
            }]
        },
        {
            "featureType": "administrative",
            "elementType": "labels.text.stroke",
            "stylers": [{
                    "color": "#ffffff"
                },
                {
                    "weight": 6
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{
                    "lightness": 20
                },
                {
                    "color": "#efe9e4"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "all",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                    "visibility": "on"
                },
                {
                    "color": "#f0e4d3"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{
                "lightness": -100
            }]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "lightness": 100
            }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                    "color": "#efe9e4"
                },
                {
                    "lightness": -25
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                    "color": "#efe9e4"
                },
                {
                    "lightness": -40
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [{
                    "color": "#efe9e4"
                },
                {
                    "lightness": -10
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [{
                    "color": "#efe9e4"
                },
                {
                    "lightness": -20
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{
                "color": "#19a0d8"
            }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{
                "lightness": -100
            }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "lightness": 100
            }]
        }
    ];

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 21.2961789, lng: -157.8567024 },
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    infowindow = new google.maps.InfoWindow();

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    var bounds = new google.maps.LatLngBounds();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i,
            map: map
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        bounds.extend(marker.position);
    }
    map.fitBounds(bounds);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        if (infowindow.marker != null)
            infowindow.marker.setAnimation(null);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        infowindow.marker = marker;
        var image = 'Image could not be loaded.';

        var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&tags=' + marker.title + '&name=value&api_key=0f9ab3806201c92011b96c6349dc71e8&format=json&' +
            'lat=' + marker.position.lat() + '&lon=' + marker.position.lng() + '&sort=interestingness-des&per_page=1&extras=url_t&jsoncallback=?'
        var photosrc;
        $.getJSON(url, function(data) {
            if (data.photos.photo[0] && data.photos.photo[0].url_t) {
                image = '<img src="' + data.photos.photo[0].url_t + '">';
            }

            infowindow.setContent('<div>' + marker.title + '<br>' + image + '</div>');
        }).fail(function() {
            image = 'Flickr tmage could not be loaded.';
            infowindow.setContent('<div>' + marker.title + '<br>' + image + '</div>');
        });

        //infowindow.setContent('<div>' + marker.title + '<img src="' + photosrc + '"></div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
            marker.setAnimation(null);
        });
    }
}

function showMarker(location) {
    markers.forEach(function(marker) {
        if (marker.title == location.title) {
            populateInfoWindow(marker);
            return;
        }
    });
}

// This function will loop through the markers array and display them all.
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_xpin_icon&chld=pin|aquarium|' + markerColor);
    return markerImage;
}

function gm_authFailure() {
    var $map = $('#map');
    $map.text(" There is an issue loading Google maps. Please try again later.");
};

var ViewModel = function() {
    var self = this;
    this.locationList = ko.observableArray([]);
    this.filter = ko.observable("");
    this.filtered = ko.computed(function() {
        if (!self.filter()) {
        	// show all locations and markers
            self.locationList.removeAll();
            locations.forEach(function(loc) {
                self.locationList.push(loc);
            });
            markers.forEach(function(marker) {
                marker.setMap(map)
            });
        } else {
        	// show specific locations and markers
            self.locationList.removeAll();
            hideListings();
            locations.forEach(function(loc) {
                if (loc.title.toLowerCase().includes(self.filter().toLowerCase())) {
                    self.locationList().push(loc);
                    markers.forEach(function(marker) {
                        if (marker.title == loc.title)
                            marker.setMap(map)
                    });
                }
            });
        }

        return self.locationList();
    }, this);
}

ko.applyBindings(new ViewModel())