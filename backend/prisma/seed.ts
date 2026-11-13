import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Sembrando base de datos completa de Mendoza para OvejaNegra...')

  // Limpiar datos previos en orden relacional inverso
  await prisma.matchParticipant.deleteMany({})
  await prisma.openMatch.deleteMany({})
  await prisma.booking.deleteMany({})
  await prisma.courtSchedule.deleteMany({})
  await prisma.court.deleteMany({})
  await prisma.venue.deleteMany({})
  await prisma.user.deleteMany({})

  const defaultPassword = await bcrypt.hash('OvejaNegra2026!', 10)

  // 1. Usuarios Administrador General, Dueños de Complejo y Jugadores
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ovejanegra.com',
      password: defaultPassword,
      name: 'Admin General OvejaNegra',
      phone: '+54 261 423-4567',
      role: 'ADMIN',
    },
  })

  const venueAdmins = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin.godoycruz@ovejanegra.com',
        password: defaultPassword,
        name: 'Carlos Mendoza (Godoy Cruz Fútbol)',
        phone: '+54 261 452-1122',
        role: 'VENUE_ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin.chacras@ovejanegra.com',
        password: defaultPassword,
        name: 'Luciano Corvalán (Chacras Park)',
        phone: '+54 261 496-8877',
        role: 'VENUE_ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin.parque@ovejanegra.com',
        password: defaultPassword,
        name: 'Sofía Carrizo (Parque San Martín Arena)',
        phone: '+54 261 425-3344',
        role: 'VENUE_ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin.guaymallen@ovejanegra.com',
        password: defaultPassword,
        name: 'Martín Quiroga (Guaymallén Padel & Fútbol)',
        phone: '+54 261 431-7788',
        role: 'VENUE_ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin.maipu@ovejanegra.com',
        password: defaultPassword,
        name: 'Rodrigo Benítez (Maipú Sports Club)',
        phone: '+54 261 497-6655',
        role: 'VENUE_ADMIN',
      },
    }),
  ])

  // 15 Jugadores
  const playerUsers = await Promise.all([
    prisma.user.create({ data: { email: 'jugador@ovejanegra.com', password: defaultPassword, name: 'Facundo Morales (Demo)', phone: '+54 261 511-0001', role: 'PLAYER' } }),
    prisma.user.create({ data: { email: 'matias.rodriguez@gmail.com', password: defaultPassword, name: 'Matías Rodríguez', phone: '+54 261 511-0002', role: 'PLAYER' } }),
    prisma.user.create({ data: { email: 'joaquin.lopez@gmail.com', password: defaultPassword, name: 'Joaquín López', phone: '+54 261 511-0003', role: 'PLAYER' } }),
    prisma.user.create({ data: { email: 'lucas.gomez@gmail.com', password: defaultPassword, name: 'Lucas Gómez', phone: '+54 261 511-0004', role: 'PLAYER' } }),
    prisma.user.create({ data: { email: 'ignacio.perez@gmail.com', password: defaultPassword, name: 'Ignacio Pérez', phone: '+54 261 511-0005', role: 'PLAYER' } }),
    prisma.user.create({ data: { email: 'agustin.torres@gmail.com', password: defaultPassword, name: 'Agustín Torres', phone: '+54 261 511-0006', role: 'PLAYER' } }),
    prisma.user.create({ data: { email: 'franco.diaz@gmail.com', password: defaultPassword, name: 'Franco Díaz', phone: '+54 261 511-0007', role: 'PLAYER' } }),
    prisma.user.create({ data: { email: 'tomas.romero@gmail.com', password: defaultPassword, name: 'Tomás Romero', phone: '+54 261 511-0008', role: 'PLAYER' } }),
    prisma.user.create({ data: { email: 'nicolas.sosa@gmail.com', password: defaultPassword, name: 'Nicolás Sosa', phone: '+54 261 511-0009', role: 'PLAYER' } }),
    prisma.user.create({ data: { email: 'gonzalo.castro@gmail.com', password: defaultPassword, name: 'Gonzalo Castro', phone: '+54 261 511-0010', role: 'PLAYER' } }),
    prisma.user.create({ data: { email: 'valentin.ruiz@gmail.com', password: defaultPassword, name: 'Valentín Ruiz', phone: '+54 261 511-0011', role: 'PLAYER' } }),
    prisma.user.create({ data: { email: 'enzo.fernandez.mza@gmail.com', password: defaultPassword, name: 'Enzo Fernández', phone: '+54 261 511-0012', role: 'PLAYER' } }),
    prisma.user.create({ data: { email: 'julian.alvarez.mza@gmail.com', password: defaultPassword, name: 'Julián Álvarez', phone: '+54 261 511-0013', role: 'PLAYER' } }),
    prisma.user.create({ data: { email: 'camila.martinez@gmail.com', password: defaultPassword, name: 'Camila Martínez', phone: '+54 261 511-0014', role: 'PLAYER' } }),
    prisma.user.create({ data: { email: 'sofia.acosta@gmail.com', password: defaultPassword, name: 'Sofía Acosta', phone: '+54 261 511-0015', role: 'PLAYER' } }),
  ])

  // 2. Crear 5 Complejos Deportivos en Mendoza
  const venuesData = [
    {
      name: 'Mendoza Fútbol & Sports Godoy Cruz',
      description: 'El complejo deportivo por excelencia en Godoy Cruz. Césped sintético de última generación FIFA Quality, iluminación LED profesional y tercer tiempo con quincho y bar cervecero.',
      address: 'Armani 1550',
      neighborhood: 'Godoy Cruz Centro',
      city: 'Godoy Cruz',
      phone: '+54 261 452-1122',
      email: 'godoycruz@mendozafutbol.com.ar',
      imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80',
      ],
      openTime: '15:00',
      closeTime: '01:00',
      days: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'],
      adminId: venueAdmins[0].id,
      courts: [
        { name: 'Cancha 1 - Monumental (Fútbol 5)', sport: 'FUTBOL', type: 'OUTDOOR', capacity: 10, pricePerHour: 22000, description: 'Césped sintético monofilamento 50mm, luz LED 400 lux.' },
        { name: 'Cancha 2 - Bombonera (Fútbol 5)', sport: 'FUTBOL', type: 'OUTDOOR', capacity: 10, pricePerHour: 22000, description: 'Césped sintético, red de contención perimetral completa.' },
        { name: 'Cancha 3 - Malvinas (Fútbol 7)', sport: 'FUTBOL', type: 'OUTDOOR', capacity: 14, pricePerHour: 34000, description: 'Cancha reglamentaria fútbol 7, ideal para torneos y desafíos.' },
      ],
    },
    {
      name: 'Chacras Park Pádel & Fútbol Club',
      description: 'Ubicado en el corazón de Chacras de Coria. Entorno natural único con vista a la Cordillera de los Andes. Club house, vestuarios premium y canchas panorámicas.',
      address: 'Ruta Panamericana km 14',
      neighborhood: 'Chacras de Coria',
      city: 'Luján de Cuyo',
      phone: '+54 261 496-8877',
      email: 'info@chacraspark.com.ar',
      imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1626248801379-51a0748a5f96?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      ],
      openTime: '08:00',
      closeTime: '00:00',
      days: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'],
      adminId: venueAdmins[1].id,
      courts: [
        { name: 'Padel Pro 1 (Panorámica)', sport: 'PADEL', type: 'OUTDOOR', capacity: 4, pricePerHour: 18000, description: 'Cancha de blindex panorámico, césped texturado azul mondo.' },
        { name: 'Padel Pro 2 (Cubierta)', sport: 'PADEL', type: 'INDOOR', capacity: 4, pricePerHour: 20000, description: 'Techada con protección UV y viento, césped profesional.' },
        { name: 'Cancha El Viñedo (Fútbol 5)', sport: 'FUTBOL', type: 'OUTDOOR', capacity: 10, pricePerHour: 24000, description: 'Fútbol 5 con césped importado y bar exclusivo.' },
      ],
    },
    {
      name: 'Arena Parque San Martín',
      description: 'A metros de los portones del Parque San Martín, en Ciudad de Mendoza. Fácil acceso, estacionamiento vigilado, canchas techadas para jugar con lluvia o calor.',
      address: 'Av. del Prado s/n (Club Hípico)',
      neighborhood: 'Parque General San Martín',
      city: 'Capital (Mendoza)',
      phone: '+54 261 425-3344',
      email: 'contacto@arenaparque.com.ar',
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      ],
      openTime: '14:00',
      closeTime: '01:00',
      days: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'],
      adminId: venueAdmins[2].id,
      courts: [
        { name: 'Cancha Techada A (Fútbol 5)', sport: 'FUTBOL', type: 'INDOOR', capacity: 10, pricePerHour: 25000, description: 'Tinglado cerrado, climatizado, vestuarios con duchas.' },
        { name: 'Cancha Central (Fútbol 8)', sport: 'FUTBOL', type: 'OUTDOOR', capacity: 16, pricePerHour: 42000, description: 'Dimensiones amplias, césped de alta densidad y tribunas.' },
        { name: 'Court Tenis Polvo de Ladrillo', sport: 'TENIS', type: 'OUTDOOR', capacity: 4, pricePerHour: 15000, description: 'Cancha de polvo de ladrillo tradicional con mantenimiento diario.' },
      ],
    },
    {
      name: 'Guaymallén Padel & Fútbol 5',
      description: 'El punto de encuentro clásico de Guaymallén. Cantina criolla con empanadas mendocinas, pantalla gigante para ver los partidos y 4 canchas impecables.',
      address: 'Bandera de Los Andes 3420',
      neighborhood: 'Villa Nueva',
      city: 'Guaymallén',
      phone: '+54 261 431-7788',
      email: 'guaymallen.sports@gmail.com',
      imageUrl: 'https://images.unsplash.com/photo-1518604666864-74239527e770?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1518604666864-74239527e770?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1563299796-17596ed6b017?auto=format&fit=crop&w=1200&q=80',
      ],
      openTime: '16:00',
      closeTime: '02:00',
      days: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'],
      adminId: venueAdmins[3].id,
      courts: [
        { name: 'Pista 1 Padel Crystal', sport: 'PADEL', type: 'OUTDOOR', capacity: 4, pricePerHour: 16000, description: 'Vidrio templado 12mm e iluminación LED de alta potencia.' },
        { name: 'Cancha El Potrero (Fútbol 5)', sport: 'FUTBOL', type: 'OUTDOOR', capacity: 10, pricePerHour: 20000, description: 'Césped sintético bicoloreado, pelota oficial incluida.' },
      ],
    },
    {
      name: 'Maipú Arena Multideportes',
      description: 'Instalaciones modernas en la zona Este de Mendoza. Canchas multifunción, básquet con piso flotante de madera y fútbol 6 con césped monofilamento.',
      address: 'Ozamis Sur 1100',
      neighborhood: 'Maipú Centro',
      city: 'Maipú',
      phone: '+54 261 497-6655',
      email: 'contacto@maipusports.com',
      imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1200&q=80',
      ],
      openTime: '15:00',
      closeTime: '00:00',
      days: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'],
      adminId: venueAdmins[4].id,
      courts: [
        { name: 'Cancha Los Andes (Fútbol 6)', sport: 'FUTBOL', type: 'OUTDOOR', capacity: 12, pricePerHour: 26000, description: 'Medidas especiales para 6 vs 6 con arcos reglamentarios.' },
        { name: 'Estadio Cubierto Básquet', sport: 'BASQUET', type: 'INDOOR', capacity: 10, pricePerHour: 22000, description: 'Piso de parquet amortiguado con tableros de acrílico reglamentarios.' },
      ],
    },
  ]

  const createdVenues = []
  const createdCourts = []

  for (const vData of venuesData) {
    const { courts, ...vInfo } = vData
    const venue = await prisma.venue.create({
      data: {
        ...vInfo,
        days: vInfo.days as any,
      },
    })
    createdVenues.push(venue)

    for (const cData of courts) {
      const court = await prisma.court.create({
        data: {
          ...cData,
          sport: cData.sport as any,
          type: cData.type as any,
          venueId: venue.id,
        },
      })
      createdCourts.push(court)

      // Horarios por cancha
      const days = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO']
      for (const day of days) {
        await prisma.courtSchedule.create({
          data: {
            courtId: court.id,
            dayOfWeek: day as any,
            openTime: venue.openTime,
            closeTime: venue.closeTime,
            slotDuration: 60,
          },
        })
      }
    }
  }

  // 3. Crear Reservas y Partidos Abiertos
  const today = new Date()
  const dateStr = today.toISOString().split('T')[0]
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]
  const nextDay = new Date(today)
  nextDay.setDate(nextDay.getDate() + 2)
  const nextDayStr = nextDay.toISOString().split('T')[0]

  // Reserva 1: Mendoza Fútbol - Cancha 1 (20:00 a 21:00 de hoy) - Con Partido Abierto
  const booking1 = await prisma.booking.create({
    data: {
      userId: playerUsers[0].id,
      courtId: createdCourts[0].id,
      venueId: createdVenues[0].id,
      date: new Date(dateStr),
      startTime: '20:00',
      endTime: '21:00',
      totalPrice: createdCourts[0].pricePerHour,
      status: 'CONFIRMED',
      notes: 'Partido abierto organizado por Facundo',
    },
  })

  const openMatch1 = await prisma.openMatch.create({
    data: {
      organizerId: playerUsers[0].id,
      bookingId: booking1.id,
      courtId: createdCourts[0].id,
      venueId: createdVenues[0].id,
      title: 'Fútbol 5 nocturno entre amigos',
      sport: 'FUTBOL',
      format: '5v5',
      totalPlayers: 10,
      confirmedPlayers: 7,
      estimatedPrice: 2200,
      description: 'Jugamos tranqui, buen nivel pero buena onda. ¡Faltan 3 para completar!',
      status: 'OPEN',
      date: new Date(dateStr),
      startTime: '20:00',
      endTime: '21:00',
    },
  })

  // Participantes del partido 1
  for (let i = 0; i < 7; i++) {
    await prisma.matchParticipant.create({
      data: {
        matchId: openMatch1.id,
        userId: playerUsers[i].id,
      },
    })
  }

  // Reserva 2: Mendoza Fútbol - Cancha 3 (Fútbol 7) - Mañana 21:00 - Partido Completo
  const booking2 = await prisma.booking.create({
    data: {
      userId: playerUsers[1].id,
      courtId: createdCourts[2].id,
      venueId: createdVenues[0].id,
      date: new Date(tomorrowStr),
      startTime: '21:00',
      endTime: '22:00',
      totalPrice: createdCourts[2].pricePerHour,
      status: 'CONFIRMED',
    },
  })

  const openMatch2 = await prisma.openMatch.create({
    data: {
      organizerId: playerUsers[1].id,
      bookingId: booking2.id,
      courtId: createdCourts[2].id,
      venueId: createdVenues[0].id,
      title: 'Clásico de los Jueves Fútbol 7',
      sport: 'FUTBOL',
      format: '7v7',
      totalPlayers: 14,
      confirmedPlayers: 14,
      estimatedPrice: 2430,
      description: 'Cupo completo. Listos para jugar.',
      status: 'FULL',
      date: new Date(tomorrowStr),
      startTime: '21:00',
      endTime: '22:00',
    },
  })

  for (let i = 0; i < 14; i++) {
    await prisma.matchParticipant.create({
      data: {
        matchId: openMatch2.id,
        userId: playerUsers[i].id,
      },
    })
  }

  // Reserva 3: Chacras Park - Padel Pro 1 - Pasado mañana 19:00 - Partido Abierto Padel
  const booking3 = await prisma.booking.create({
    data: {
      userId: playerUsers[2].id,
      courtId: createdCourts[3].id,
      venueId: createdVenues[1].id,
      date: new Date(nextDayStr),
      startTime: '19:00',
      endTime: '20:00',
      totalPrice: createdCourts[3].pricePerHour,
      status: 'CONFIRMED',
    },
  })

  const openMatch3 = await prisma.openMatch.create({
    data: {
      organizerId: playerUsers[2].id,
      bookingId: booking3.id,
      courtId: createdCourts[3].id,
      venueId: createdVenues[1].id,
      title: 'Desafío Pádel 4ta / 5ta categoría',
      sport: 'PADEL',
      format: '2v2',
      totalPlayers: 4,
      confirmedPlayers: 2,
      estimatedPrice: 4500,
      description: 'Buscamos pareja o dos jugadores para cerrar partido parejo de pádel.',
      status: 'OPEN',
      date: new Date(nextDayStr),
      startTime: '19:00',
      endTime: '20:00',
    },
  })

  await prisma.matchParticipant.create({ data: { matchId: openMatch3.id, userId: playerUsers[2].id } })
  await prisma.matchParticipant.create({ data: { matchId: openMatch3.id, userId: playerUsers[3].id } })

  // Reserva 4: Arena Parque San Martín - Cancha Techada A - Mañana 18:00 (Reserva Simple sin partido público)
  await prisma.booking.create({
    data: {
      userId: playerUsers[4].id,
      courtId: createdCourts[6].id,
      venueId: createdVenues[2].id,
      date: new Date(tomorrowStr),
      startTime: '18:00',
      endTime: '19:00',
      totalPrice: createdCourts[6].pricePerHour,
      status: 'CONFIRMED',
      notes: 'Entrenamiento privado equipo de veteranos',
    },
  })

  console.log('✅ Base de datos sembrada con éxito!')
  console.log('📍 5 Complejos de Mendoza registrados con fotos reales:')
  createdVenues.forEach((v) => console.log(`   - ${v.name} (${v.city})`))
  console.log(`🏟️ ${createdCourts.length} canchas creadas con horarios de atención.`)
  console.log(`⚽ 3 Partidos configurados (Abierto Fútbol 5, Completo Fútbol 7, Abierto Pádel).`)
  console.log(`👤 Credenciales de prueba:`)
  console.log(`   - Admin General: admin@ovejanegra.com / OvejaNegra2026!`)
  console.log(`   - Admin Complejo: admin.godoycruz@ovejanegra.com / OvejaNegra2026!`)
  console.log(`   - Jugador: jugador@ovejanegra.com / OvejaNegra2026!`)
}

main()
  .catch((e) => {
    console.error('Error durante seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
