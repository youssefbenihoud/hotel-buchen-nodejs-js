// Funktion zum Prüfen der Verfügbarkeit eines Zimmers
async function checkRoomAvailability(roomNumber) {
    const response = await fetch(`http://localhost:8080/hotels/berlin/rooms/${roomNumber}`);
    const room = await response.json();
    return room.status === 'free';
}

// Funktion zum Buchen eines Zimmers

async function bookRoom(roomNumber, guestName) {
    const response = await fetch(`http://localhost:8080/hotels/berlin/rooms/${roomNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'occupied', guest: guestName })
    });
    const result = await response.json();
    return result;
}


// Hauptworkflow

async function hotelBookingWorkflow(customerPreferences) {
    const { roomType, guestName } = customerPreferences;

    // Simulierte Zimmerliste basierend auf Kundenwünschen
    const availableRooms = {
        single: [100, 101],
        double: [102, 103],
        suite: [104, 105]
    };

    // Wähle ein passendes Zimmer basierend auf dem Typ
    const roomsToCheck = availableRooms[roomType];
    if (!roomsToCheck || roomsToCheck.length === 0) {
        console.log('Keine Zimmer verfügbar für den gewünschten Typ.');
        return;
    }

    // Prüfe die Verfügbarkeit der Zimmer
    for (const room of roomsToCheck) {
        const isAvailable = await checkRoomAvailability(room);
        if (isAvailable) {
            console.log(`Zimmer ${room} ist verfügbar. Buche Zimmer...`);
            const bookingResult = await bookRoom(room, guestName);
            console.log('Buchungsergebnis:', bookingResult);
            console.log(`Zimmer ${room} erfolgreich für ${guestName} gebucht.`);
            return;
        }
    }

    console.log('Kein passendes Zimmer verfügbar.');
}
    


// Beispielaufruf des Workflows
// Der Servicemitarbeiter gibt die Kundenwünsche ein:
const customerPreferences = {
    roomType: 'single', // Mögliche Werte: 'single', 'double', 'suite'
    guestName: 'Alice Smith'
};

hotelBookingWorkflow(customerPreferences);