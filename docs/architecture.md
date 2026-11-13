# Arquitectura y Diseño del Sistema OvejaNegra

## 1. Problemática
En la provincia de Mendoza, la reserva de canchas de fútbol, pádel y tenis sigue realizándose predominantemente por canales informales (mensajes de WhatsApp o llamadas telefónicas). Esto genera:
- Falta de visibilidad de horarios libres en tiempo real.
- Respuestas demoradas por parte de los administradores.
- Dificultades para que grupos incompletos de amigos consigan rivales o personas para completar el cupo.

## 2. Objetivo General
Desarrollar una aplicación web sencilla, moderna e intuitiva llamada **OvejaNegra**, inspirada en la experiencia de reserva de ATC Sports, que conecte a deportistas con complejos deportivos y organice partidos comunitarios sin burocracia.

## 3. Modelo de Entidad-Relación (Prisma)
- **User:** Gestiona perfiles, roles (PLAYER, VENUE_ADMIN, ADMIN) y credenciales encriptadas.
- **Venue:** Establecimiento deportivo con dirección, horarios de apertura y cierre, y administración asignada.
- **Court:** Cancha dentro del complejo, con tipo de superficie, deporte y precio por turno.
- **CourtSchedule:** Horarios de operación por día de la semana.
- **Booking:** Reserva formal vinculada a usuario, cancha, complejo, fecha y hora. Posee restricción única `@@unique([courtId, date, startTime])` para prevenir turnos dobles.
- **OpenMatch:** Publicación comunitaria con cupos totales y confirmados. Garantizada mediante una reserva (`bookingId`) obligatoria.
- **MatchParticipant:** Relación N a N que registra los jugadores que se han sumado a un partido abierto.

## 4. Diagrama de Flujo de Reserva
1. Usuario busca complejo por Ciudad y Deporte.
2. Accede a la vista de detalle y selecciona cancha deseada.
3. El frontend consulta al backend los slots calculados y filtrados contra reservas existentes.
4. El usuario elige un horario libre y confirma.
5. El backend ejecuta una transacción en PostgreSQL que valida disponibilidad y guarda la reserva.

