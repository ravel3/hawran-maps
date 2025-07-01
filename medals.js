// x / lng - horizontal position from left edge
// y / lat - vertical position from the top edge

const mapPath = 'mapa-przyklad.jpg';
const imageWidth = 2560;
const imageHeight = 1809;

const medals = [
    {
        id: 73,
        name: "Kopanka",
        desc: "Kopanka",
        x: 189.5, y: 1531,
        initial_amount: 5
    },
    {
        id: 43,
        name: "Lipa",
        desc: "Lipa opis",
        x: 259, y: 1313,
        initial_amount: 3
    },
    {
        id: 82,
        name: "Złamane drzewo",
        desc: "Złamane drzewo - opis",
        x: 620.75, y: 1600.875,
        initial_amount: 1
    },
    {
        id: 54,
        name: "Na cerkwisku",
        desc: "Na cerkwisku - opis",
        x: 507.75, y: 1098.5,
        initial_amount: 6
    },
    {
        id: 74,
        name: "Samotny klon",
        desc: "Samotny klon - opis",
        x: 1455, y: 229.75,
        initial_amount: 8
    }
];


const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 3,
    zoomControl: true,
    scrollWheelZoom: true
});

// utility method to get medals coordinates - output in a browser console
map.on('click', function(e) {
    console.log('x: '+e.latlng.lng+', y: '+e.latlng.lat+',');
} );

// const mapImg = new Image();
// mapImg.src = mapPath;
// const imageWidth = mapImg.naturalWidth;
// const imageHeight = mapImg.naturalHeight;

const bounds = [[0, 0], [imageHeight, imageWidth]];
map.setMaxBounds(bounds);

const imageOverlay = L.imageOverlay(mapPath, bounds).addTo(map);

// Sets the view of the map (geographical center and zoom)
map.setView([imageHeight/2, imageWidth/2], 0);


let markers = [];


function getMedalTakenCount(medalId) {
    const takenMedals = JSON.parse(localStorage.getItem('takenMedals') || '{}');
    return takenMedals[medalId] || 0;
}

function updateTakenMedal(medalId) {
    const takenMedals = JSON.parse(localStorage.getItem('takenMedals') || '{}');
    // Każdy użytkownik może zabrać tylko jeden medal o konkretnym ID
    takenMedals[medalId] = 1;
    localStorage.setItem('takenMedals', JSON.stringify(takenMedals));
}

function resetAllMedals() {
    if (confirm('Czy na pewno chcesz zresetować wszystkie medale?')) {
        localStorage.removeItem('takenMedals');
        initializeMap();
        updateCounters();
        updateMedalTable();
    }
}

function takeMedal(medalId, marker) {
    const medal = medals.find(m => m.id === medalId);
    if (!medal) return;


    const takenCount = getMedalTakenCount(medalId);
    if (takenCount >= 1) {
        alert(`Już zabrałeś medal "${medal.name}"! Każdy może zabrać tylko jeden medal tego typu.`);
        return;
    }

    updateTakenMedal(medalId);
    marker.closePopup();
    initializeMap();
    updateCounters();
    updateMedalTable();

    alert(`Medal "${medal.name}" został zebrany!`);
}

// init markers
function initializeMap() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    medals.forEach(medal => {
        const takenCount = getMedalTakenCount(medal.id);

        const lat = medal.y;
        const lng = medal.x;

        const marker = L.marker([lat, lng]).addTo(map);
        var button = "";
        if (takenCount === 0) {
            button = ` <button onclick="takeMedal(${medal.id}, markers[${markers.length}])" 
                                    style="background: #28a745; color: white; border: none; 
                                           padding: 10px 20px; border-radius: 5px; cursor: pointer; 
                                           font-weight: bold; font-size: 14px;">
                                🏆 Zabieram medal
                            </button>`;
        }

        const popupContent = `
                        <div style="text-align: center; min-width: 200px;">
                            <h3 style="margin: 0 0 10px 0; color: #2c5aa0;">🏆 ${medal.name}</h3>
                            <p style="margin: 5px 0; color: #666;">${medal.desc}</p>
                            <p style="margin: 10px 0 15px 0; font-weight: bold; color: #28a745;">
                                Dostępne: ${medal.initial_amount - takenCount} medali
                            </p>
                           ${button}
                        </div>
                    `;

        marker.bindPopup(popupContent);

        marker.on('popupclose', function() {
            map.setMaxBounds(bounds);
        });
        marker.on('popupopen', function() {
            map.setMaxBounds(null);
        });
        markers.push(marker);

    });
}

function updateCounters() {
    let collectedTotal = 0;
    let availableTotal = 0;
    let grandTotal = 0;

    medals.forEach(medal => {
        const takenCount = getMedalTakenCount(medal.id);
        collectedTotal += Math.min(takenCount, 1); // Max 1 na medal
        availableTotal += medal.initial_amount - Math.min(takenCount, 1);
        grandTotal += medal.initial_amount;
    });
}

function updateMedalTable() {
    const tableBody = document.getElementById('medalsTableBody');
    tableBody.innerHTML = '';

    medals.sort((a, b) => a.id - b.id)
        .forEach(medal => {
        const takenCount = getMedalTakenCount(medal.id);
        const availableCount = Math.max(0, medal.initial_amount - takenCount);

        const row = document.createElement('tr');
        row.innerHTML = `<td data-label="Nazwa Medalu">PK${medal.id} ${medal.name}</td>
                        <td data-label="Medale" class="${availableCount > 0 ? 'medal-count-available' : 'medal-count-zero'}">
                        ${availableCount} / ${medal.initial_amount}</td>`;

        tableBody.appendChild(row);
    });
}

function fitMapToScreen() {
    map.invalidateSize();
    map.fitBounds(bounds);
}

// Event listeners for responsiveness
window.addEventListener('resize', function() {
    setTimeout(fitMapToScreen, 100);
});
window.addEventListener('orientationchange', function() {
    setTimeout(fitMapToScreen, 200);
});


imageOverlay.on('load', function() {
    fitMapToScreen();
});

// on app init
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    updateCounters();
    updateMedalTable();
    setTimeout(fitMapToScreen, 100);
});
