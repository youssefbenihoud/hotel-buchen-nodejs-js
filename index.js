const express = require('express');
const app = express();
const port = 8080; // Du kannst den Port ändern, falls 8080 bereits belegt ist.

// Middleware zum Parsen von JSON
app.use(express.json());

// Simulierte Datenbank (in-memory)
let rooms = {
    100: { status: 'free', guest: null },
    101: { status: 'free', guest: null },
    102: { status: 'occupied', guest: 'John Doe' },
    // Fügen Sie hier weitere Zimmer hinzu
};

// GET /hotels/berlin/rooms - Alle Zimmer abrufen
app.get('/hotels/berlin/rooms', (req, res) => {
    const roomNumbers = Object.keys(rooms);
    res.json(roomNumbers);
});

// GET /hotels/berlin/rooms/:roomNumber - Status eines bestimmten Zimmers abrufen
app.get('/hotels/berlin/rooms/:roomNumber', (req, res) => {
    const roomNumber = req.params.roomNumber;
    const room = rooms[roomNumber];
    if (room) {
        res.json(room);
    } else {
        res.status(404).json({ error: 'Zimmer nicht gefunden' });
    }
});

// PUT /hotels/berlin/rooms/:roomNumber - Status eines Zimmers ändern
app.put('/hotels/berlin/rooms/:roomNumber', (req, res) => {
    const roomNumber = req.params.roomNumber;
    const newStatus = req.body.status;
    const guestName = req.body.guest;

    if (!rooms[roomNumber]) {
        return res.status(404).json({ error: 'Zimmer nicht gefunden' });
    }

    if (newStatus === 'free') {
        rooms[roomNumber] = { status: 'free', guest: null };
    } else if (newStatus === 'occupied' && guestName) {
        rooms[roomNumber] = { status: 'occupied', guest: guestName };
    } else {
        return res.status(400).json({ error: 'Ungültige Statusänderung' });
    }

    res.json({ message: 'Zimmerstatus aktualisiert', room: rooms[roomNumber] });
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});