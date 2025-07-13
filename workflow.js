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
    

/* Implementing Aufgabe 2 */

// Simulierte Zimmerpreise pro Nacht
const roomPrices = {
    single: 50,    // Preis für ein Einzelzimmer
    double: 80,    // Preis für ein Doppelzimmer
    suite: 150     // Preis für eine Suite
};

// Funktion zur Berechnung des Gesamtpreises
function calculateTotalPrice(roomType, nights) {
    const pricePerNight = roomPrices[roomType];
    if (!pricePerNight) {
        throw new Error('Unbekannter Zimmerpreis');
    }
    return pricePerNight * nights;
}

// Funktion zur Bonitätsprüfung (simuliert)
async function performCreditCheck(customerName) {
    // Simulierte Bonitätsprüfung: 80% Wahrscheinlichkeit, dass die Prüfung erfolgreich ist
    const creditCheckResult = Math.random() < 0.8;
    if (creditCheckResult) {
        console.log(`Bonitätsprüfung für ${customerName} war erfolgreich.`);
        return true;
    } else {
        console.log(`Bonitätsprüfung für ${customerName} war nicht erfolgreich.`);
        return false;
    }
}

// Erweiterter Workflow mit Preisberechnung und Ratenzahlung
async function extendedHotelBookingWorkflow(customerPreferences) {
    const { roomType, guestName, nights, paymentOption } = customerPreferences;

    // Berechne den Gesamtpreis
    const totalPrice = calculateTotalPrice(roomType, nights);
    console.log(`Gesamtpreis für ${nights} Nächte im ${roomType}-Zimmer: ${totalPrice} €`);

    // Prüfe die Verfügbarkeit und buche das Zimmer
    const availableRooms = {
        single: [100, 101],
        double: [102, 103],
        suite: [104, 105]
    };

    const roomsToCheck = availableRooms[roomType];
    if (!roomsToCheck || roomsToCheck.length === 0) {
        console.log('Keine Zimmer verfügbar für den gewünschten Typ.');
        return;
    }

    let bookedRoom = null;
    for (const room of roomsToCheck) {
        const isAvailable = await checkRoomAvailability(room);
        if (isAvailable) {
            console.log(`Zimmer ${room} ist verfügbar. Buche Zimmer...`);
            const bookingResult = await bookRoom(room, guestName);
            console.log('Buchungsergebnis:', bookingResult);
            bookedRoom = room;
            break;
        }
    }

    if (!bookedRoom) {
        console.log('Kein passendes Zimmer verfügbar.');
        return;
    }

    // Zahlungsoptionen
    if (paymentOption === 'full') {
        console.log(`${guestName} hat den Gesamtbetrag von ${totalPrice} € bezahlt.`);
    } else if (paymentOption === 'installment') {
        console.log(`${guestName} hat eine Ratenzahlung gewählt. Führe Bonitätsprüfung durch...`);
        const creditCheckPassed = await performCreditCheck(guestName);

        if (creditCheckPassed) {
            console.log(`Ratenzahlung für ${guestName} genehmigt.`);
            console.log(`Der Betrag von ${totalPrice} € wird in monatlichen Raten beglichen.`);
        } else {
            console.log(`Ratenzahlung für ${guestName} abgelehnt. Bitte wählen Sie eine andere Zahlungsoption.`);
        }
    } else {
        console.log('Ungültige Zahlungsoption ausgewählt.');
    }

    console.log(`Buchung für ${guestName} im Zimmer ${bookedRoom} abgeschlossen.`);
}

/** Aufgabe 3 */
// Rollen und ihre Berechtigungen
const roles = {
    serviceEmployee: {
        canBookRoom: true,
        canApproveInstallment: false
    },
    branchManager: {
        canBookRoom: false,
        canApproveInstallment: true
    }
};

// Funktion zur Überprüfung der Berechtigungen
function hasPermission(permission) {
    return currentUserRole[permission];
}

// Funktion zur Rollenänderung
function switchRole(role) {
    if (roles[role]) {
        currentUserRole = roles[role];
        console.log(`Rolle gewechselt zu: ${role}`);
    } else {
        console.log('Ungültige Rolle');
    }
}

// Aktuelle Rolle des Benutzers
let currentUserRole = roles.serviceEmployee; // Standardmäßig Servicemitarbeiter

// Erweiterter Workflow mit Rollen und Verantwortlichkeiten
async function roleBasedHotelBookingWorkflow(customerPreferences) {
    const { roomType, guestName, nights, paymentOption } = customerPreferences;

    // Prüfe, ob der aktuelle Benutzer ein Zimmer buchen darf
    if (!hasPermission('canBookRoom')) {
        console.log('Fehler: Sie haben keine Berechtigung, ein Zimmer zu buchen.');
        return;
    }

    // Berechne den Gesamtpreis
    const totalPrice = calculateTotalPrice(roomType, nights);
    console.log(`Gesamtpreis für ${nights} Nächte im ${roomType}-Zimmer: ${totalPrice} €`);

    // Prüfe die Verfügbarkeit und buche das Zimmer
    const availableRooms = {
        single: [100, 101],
        double: [102, 103],
        suite: [104, 105]
    };

    const roomsToCheck = availableRooms[roomType];
    if (!roomsToCheck || roomsToCheck.length === 0) {
        console.log('Keine Zimmer verfügbar für den gewünschten Typ.');
        return;
    }

    let bookedRoom = null;
    for (const room of roomsToCheck) {
        const isAvailable = await checkRoomAvailability(room);
        if (isAvailable) {
            console.log(`Zimmer ${room} ist verfügbar. Buche Zimmer...`);
            const bookingResult = await bookRoom(room, guestName);
            console.log('Buchungsergebnis:', bookingResult);
            bookedRoom = room;
            break;
        }
    }

    if (!bookedRoom) {
        console.log('Kein passendes Zimmer verfügbar.');
        return;
    }

    // Zahlungsoptionen
    if (paymentOption === 'full') {
        console.log(`${guestName} hat den Gesamtbetrag von ${totalPrice} € bezahlt.`);
    } else if (paymentOption === 'installment') {
        console.log(`${guestName} hat eine Ratenzahlung gewählt.`);

        // Prüfe, ob der aktuelle Benutzer Ratenzahlungen genehmigen darf
        if (!hasPermission('canApproveInstallment')) {
            console.log('Fehler: Sie haben keine Berechtigung, Ratenzahlungen zu genehmigen.');
            console.log('Wechseln sie zur Rolle "branchManager", um fortzufahren.');
            return;
        }

        console.log('Führe Bonitätsprüfung durch...');
        const creditCheckPassed = await performCreditCheck(guestName);

        if (creditCheckPassed) {
            console.log(`Ratenzahlung für ${guestName} genehmigt.`);
            console.log(`Der Betrag von ${totalPrice} € wird in monatlichen Raten beglichen.`);
        } else {
            console.log(`Ratenzahlung für ${guestName} abgelehnt. Bitte wählen Sie eine andere Zahlungsoption.`);
        }
    } else {
        console.log('Ungültige Zahlungsoption ausgewählt.');
    }

    console.log(`Buchung für ${guestName} im Zimmer ${bookedRoom} abgeschlossen.`);
}

// Beispielaufruf des erweiterten Workflows
currentUserRole = roles.serviceEmployee;
const customerPreferences = {
    roomType: 'single',         // Mögliche Werte: 'single', 'double', 'suite'
    guestName: 'Alice Smith',
    nights: 5,                  // Anzahl der Nächte
    paymentOption: 'installment' // Mögliche Werte: 'full' (voller Betrag), 'installment' (Ratenzahlung)
};
switchRole('branchManager');
roleBasedHotelBookingWorkflow(customerPreferences);
