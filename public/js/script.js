const socketio = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((pos) => {
        const { latitude: lat, longitude: long  } = pos.coords;
        socketio.emit("locationSend", { lat, long })
    }, (error) => {
        console.error(error)
    },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });
}


const map = L.map("map").setView([0,0],6);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map)


const obj = {

}


socketio.on("receiveLocation", (data)=>{
    const {id, lat, long} = data;
    map.setView([lat,long],16);
    if(obj[id]){
        obj[id].setLatLng([lat,long])
    }
    else{
        obj[id] = L.marker([lat,long]).addTo(map)
    }
})

socketio.on("userDisconnected", (id)=>{
    if(obj[id]){
        map.removeLayer(obj[id]);
        delete obj[id];
    }
})