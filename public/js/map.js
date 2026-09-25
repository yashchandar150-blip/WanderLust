console.log(mapToken);
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    center: listing.geometry.coordinates,
    style: 'mapbox://styles/mapbox/streets-v12',
    zoom: 2
});

console.log(listing.geometry.coordinates);

const marker1 = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h4>${listing.location}</h4>
                      <p>Exact Location provide after booking</p>`)
    )
    .addTo(map);