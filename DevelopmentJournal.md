# CareerBridge – Development Journal

## KW 1 – Projektplanung und Vorbereitung

### Erledigte Aufgaben
- Projektidee „CareerBridge“ ausgewählt.
- Ziele und Zielgruppe definiert.
- Erste Anforderungen gesammelt.
- GitHub-Repository erstellt.
- Projektstruktur geplant.
- Aufgaben im Team verteilt.

### Neue Technologien
- Überblick über Vue 3, Pinia und Express.
- Einführung in GitHub für die gemeinsame Entwicklung.

### Herausforderungen
- Auswahl eines geeigneten Projektthemas.
- Planung einer sinnvollen Projektstruktur.

### Lösungen
- Mehrere Projektideen wurden verglichen.
- Gemeinsam wurde entschieden, eine Karriereplattform zu entwickeln.

### ChatGPT-Unterstützung
- Unterstützung bei der Ideenfindung.
- Erklärung der Projektarchitektur.
- Vorschläge zur Strukturierung des Projekts.

### Erkenntnisse
Eine gute Planung spart später viel Entwicklungszeit.

---

## KW 2 – Frontend-Grundlagen

### Erledigte Aufgaben
- Vue-3-Projekt mit Vite erstellt.
- Vue Router integriert.
- Pinia eingerichtet.
- Grundlayout erstellt.
- Navbar und Startseite entwickelt.

### Neue Technologien
- Composition API.
- Vue Router.
- Pinia State Management.
- Vite.

### Herausforderungen
- Verständnis der Komponentenstruktur.
- Navigation zwischen mehreren Seiten.

### Lösungen
- Komponenten in kleine wiederverwendbare Teile aufgeteilt.
- Router-Struktur vereinfacht.

### ChatGPT-Unterstützung
- Erklärung der Composition API.
- Hilfe beim Verständnis von Routing und Pinia.

### Erkenntnisse
Komponenten erleichtern die Wiederverwendung von Code.

### Nächste Woche
Login und Register implementieren.

---

## KW 3 – Benutzerverwaltung

### Erledigte Aufgaben
- Login-Seite entwickelt.
- Registrierungsseite erstellt.
- Formulare validiert.
- Benutzeroberfläche verbessert.
- Erste Benutzerrollen vorbereitet.

### Neue Technologien
- Axios.
- REST-API.
- Formularvalidierung.

### Herausforderungen
- Daten zwischen Frontend und Backend übertragen.
- Fehlerhafte Eingaben behandeln.
- Login-Zustand im Frontend verwalten.

### Lösungen
- Axios für HTTP-Anfragen verwendet.
- Validierungen im Frontend ergänzt.
- Pinia für den Benutzerstatus verwendet.

### ChatGPT-Unterstützung
- Erklärung von Axios.
- Unterstützung beim Verständnis von HTTP-Methoden.
- Hilfe bei Login- und Register-Logik.

### Erkenntnisse
Eine gute Validierung verbessert die Benutzerfreundlichkeit.

### Nächste Woche
Backend entwickeln.

---

## KW 4 – Backend und Datenhaltung

### Erledigte Aufgaben
- Express-Server erstellt.
- REST-API entwickelt.
- CRUD-Endpunkte für Benutzer, Skills, Projekte und Zertifikate erstellt.
- Lokale JSON-Datenhaltung mit `local-db.json` umgesetzt.
- Frontend und Backend über Axios verbunden.

### Neue Technologien
- Node.js.
- Express.js.
- REST API.
- Lokale JSON-Datenhaltung.

### Herausforderungen
- Verbindung zwischen Frontend und Backend.
- Daten dauerhaft speichern.
- Fehler bei API-Anfragen.

### Lösungen
- API-Schritte einzeln getestet.
- Backend-Endpunkte mit Browser und Terminal überprüft.
- `local-db.json` als einfache lokale Datenquelle verwendet.

### ChatGPT-Unterstützung
- Erklärung von Express-Routen.
- Unterstützung beim Verständnis von REST-Endpunkten.
- Hilfe bei der Analyse von Fehlermeldungen.

### Erkenntnisse
Frontend und Backend müssen sauber zusammenarbeiten. Auch eine lokale Datenhaltung muss strukturiert aufgebaut sein.

### Nächste Woche
CRUD-Funktionen erweitern.

---

## KW 5 – CRUD-Funktionen

### Erledigte Aufgaben
- Skills-Seite fertiggestellt.
- Projects-Seite erweitert.
- Certificates-Seite implementiert.
- Suchfunktion ergänzt.
- Bearbeiten- und Löschen-Funktionen verbessert.
- Daten wurden benutzerspezifisch gespeichert.

### Neue Technologien
- CRUD mit REST-API.
- Dynamische Formulare.
- Axios für API-Aufrufe.

### Herausforderungen
- Daten nach Änderungen automatisch aktualisieren.
- Einheitliche Struktur für alle CRUD-Seiten.
- Daten nach Benutzer trennen.

### Lösungen
- Gemeinsames CRUD-Muster verwendet.
- API-Aufrufe vereinheitlicht.
- Jeder Datensatz wurde mit einer Benutzer-ID verknüpft.

### ChatGPT-Unterstützung
- Erklärung von CRUD-Konzepten.
- Hilfe bei der Fehleranalyse.
- Unterstützung bei der Strukturierung der API-Aufrufe.

### Erkenntnisse
Wiederverwendbarer Code reduziert Entwicklungsaufwand. Benutzerspezifische Daten verbessern die Struktur der Anwendung.

### Nächste Woche
Dashboard und Profil entwickeln.

---

## KW 6 – Dashboard und Benutzerprofil

### Erledigte Aufgaben
- Dashboard erstellt.
- Statistik-Karten integriert.
- Fortschrittsanzeige für das Profil eingebunden.
- Profilseite erweitert.
- Benutzerspezifische Daten im Dashboard angezeigt.
- Resume-Seite implementiert.
- Docs-Seite für benutzerspezifische Daten vorbereitet.

### Neue Technologien
- Computed Properties in Vue.
- Pinia State Management.
- Browser Print API für „Save as PDF“.

### Herausforderungen
- Dynamische Daten korrekt darstellen.
- Daten des aktuell angemeldeten Benutzers anzeigen.
- PDF-Speicherung über den Browser sauber darstellen.

### Lösungen
- Pinia für den eingeloggten Benutzer verwendet.
- Dashboard mit berechneten Werten aufgebaut.
- Skills, Projekte und Zertifikate nach Benutzer gefiltert.
- Print-Ansicht für Resume und Docs verbessert.

### ChatGPT-Unterstützung
- Unterstützung beim PDF-Export über den Druckdialog.
- Hilfe beim Verständnis von computed-Eigenschaften.
- Unterstützung beim Filtern benutzerspezifischer Daten.

### Erkenntnisse
Dynamische Dashboards verbessern die Benutzererfahrung. State Management ist wichtig für Login und benutzerspezifische Inhalte.

### Nächste Woche
Tests und Optimierungen.

---

## KW 7 – Tests und Optimierung

### Erledigte Aufgaben
- Anwendung getestet.
- Fehler behoben.
- Responsive Design verbessert.
- Benutzeroberfläche optimiert.
- Navigation und Routing überprüft.
- GitHub aktualisiert.

### Herausforderungen
- Darstellung auf verschiedenen Bildschirmgrößen.
- Kleinere Fehler im Zusammenspiel von Frontend und Backend.
- Probleme beim Wechsel zwischen verschiedenen Benutzerkonten.

### Lösungen
- Mehrere Testläufe durchgeführt.
- Layout schrittweise verbessert.
- Session-Verwaltung angepasst.
- Route Guards überprüft.

### ChatGPT-Unterstützung
- Unterstützung bei der Fehlersuche.
- Erklärung von Vue-Fehlermeldungen.
- Vorschläge zur Codeverbesserung.

### Erkenntnisse
Testen ist ein wichtiger Teil der Softwareentwicklung. Besonders Login, Routing und Benutzerwechsel müssen sorgfältig geprüft werden.

### Nächste Woche
Dokumentation und Abschluss vorbereiten.

---

## KW 8 – Dokumentation und Abschluss

### Erledigte Aufgaben
- Projektdokumentation fertiggestellt.
- Screenshots der Anwendung erstellt.
- GitHub überprüft.
- Präsentation vorbereitet.
- Code bereinigt.
- Finale Tests durchgeführt.

### Herausforderungen
- Alle Projektdokumente vollständig vorbereiten.
- Präsentation verständlich strukturieren.
- Screenshots sinnvoll auswählen und einordnen.

### Lösungen
- Dokumentation überarbeitet.
- Letzte Fehler behoben.
- Screenshots im Repository abgelegt.
- Projektstruktur überprüft.

### ChatGPT-Unterstützung
- Unterstützung bei der Formulierung der Dokumentation.
- Hilfe bei der Struktur der Präsentation.
- Unterstützung bei der Auswahl wichtiger Screenshots.

### Erkenntnisse
Eine gute Dokumentation ist wichtig, damit andere das Projekt verstehen können.

### Nächste Woche
Abgabe und Präsentation.

---

## KW 9 – Abschlussphase und Projektverbesserungen

### Abgeschlossene Aufgaben
- Die Projektstruktur wurde neu organisiert und in Frontend und Backend getrennt.
- Das Dashboard wurde mit benutzerspezifischen Statistiken verbessert.
- Eine benutzerspezifische Dokumentationsseite wurde hinzugefügt.
- Die Funktionen „Drucken“ und „Als PDF speichern“ wurden implementiert.
- Das Design und die Benutzeroberfläche wurden auf allen Seiten vereinheitlicht.
- Probleme bei Authentifizierung, Session-Verwaltung und Routing wurden behoben.
- Abschließende Tests und Fehlerbehebungen wurden durchgeführt.
- Das finale GitHub-Repository wurde vorbereitet und aktualisiert.

### Herausforderungen
- Merge-Konflikte nach der Umstrukturierung des Projekts lösen.
- Frontend und Backend nach der Trennung erfolgreich synchronisieren.
- Sicherstellen, dass jeder Benutzer ausschließlich auf seine eigenen Daten zugreifen kann.
- Eine einheitliche Benutzeroberfläche auf allen Seiten herstellen.

### Lösungen
- GitHub-Änderungen mit Rebase integriert.
- Frontend und Backend getrennt getestet.
- Daten über Benutzer-ID gefiltert.
- Design auf ein einheitliches Blau-Weiß-Theme angepasst.
- Finale Screenshots erstellt und im Repository gespeichert.

### Ergebnis
Die finale Version von CareerBridge wurde erfolgreich fertiggestellt. Die Anwendung ist für die Präsentation und die Abgabe vorbereitet.

### ChatGPT-Unterstützung
- Unterstützung bei der Erstellung und Überarbeitung der Projektdokumentation.
- Hilfe beim Formulieren technischer Inhalte.
- Unterstützung bei Git, Fehleranalyse und Präsentationsvorbereitung.
- Alle Vorschläge wurden geprüft und bei Bedarf manuell angepasst.

---

## Lessons Learned

Während des Projekts haben wir gelernt, wie moderne Webanwendungen mit Vue 3, Pinia, Express und einer lokalen JSON-Datenhaltung entwickelt werden. Besonders wichtig war das Zusammenspiel zwischen Frontend und Backend sowie die strukturierte Planung des Entwicklungsprozesses.

Außerdem haben wir gelernt, Probleme systematisch zu analysieren, Lösungen gemeinsam zu erarbeiten und unsere Fortschritte regelmäßig zu dokumentieren. Die Arbeit mit GitHub hat gezeigt, wie wichtig saubere Commits, regelmäßige Updates und eine klare Projektstruktur sind.

ChatGPT wurde während des Projekts als unterstützendes Lernwerkzeug verwendet. Es half beim Verständnis von Vue.js, Pinia, Express, Routing, API-Aufrufen und GitHub. Außerdem unterstützte es bei der Analyse von Fehlermeldungen, bei der Strukturierung der Dokumentation und bei der Vorbereitung der Abschlusspräsentation. Alle Vorschläge wurden vom Team überprüft, angepasst und in den Projektkontext eingeordnet, bevor sie übernommen wurden.
