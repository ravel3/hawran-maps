// Konfiguracja medalów dla Beskidu Niskiego
// Współrzędne X,Y odnoszą się do pozycji na obrazie mapy (1536x1085 px)
// X - pozycja pozioma od lewej krawędzi (0-1536)
// Y - pozycja pionowa od górnej krawędzi (0-1085)
//  y=1809-
const medale = [
    {
        id: 1,
        nazwa: "Kopanka",
        opis: "Kopanka",
        x: 190,
        y: 1531,
        poczatkowa_ilosc: 5
    },
    {
        id: 2,
        nazwa: "Lipa", 
        opis: "Lipa opis",
        x: 259,
        y: 1313,
        poczatkowa_ilosc: 3
    },
    {
        id: 3,
        nazwa: "Złamane drzewo",
        opis: "Złamane drzewo - opis",
        x: 620,
        y: 1603,
        poczatkowa_ilosc: 4
    }
];

// Funkcja pomocnicza do wyświetlania informacji o medalach
function wyswietlInfoMedale() {
    console.log("=== MEDALE BESKIDU NISKIEGO ===");
    medale.forEach(medal => {
        console.log(`${medal.id}. ${medal.nazwa} (${medal.x}, ${medal.y}) - ${medal.poczatkowa_ilosc} szt.`);
    });
    console.log(`Łącznie ${medale.length} medali do zdobycia!`);
}
