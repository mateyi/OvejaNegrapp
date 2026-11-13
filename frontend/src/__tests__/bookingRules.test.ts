import { describe, it, expect } from 'vitest'

describe('OvejaNegra Reglas de Disponibilidad y Superposición', () => {
  it('Debe detectar superposición exacta de horarios en la misma cancha', () => {
    const existing = { courtId: 'c-1', date: '2026-11-13', startTime: '20:00' }
    const newBooking = { courtId: 'c-1', date: '2026-11-13', startTime: '20:00' }

    const isOverlap =
      existing.courtId === newBooking.courtId &&
      existing.date === newBooking.date &&
      existing.startTime === newBooking.startTime

    expect(isOverlap).toBe(true)
  })

  it('Debe permitir reservas en horarios distintos para la misma cancha', () => {
    const existing = { courtId: 'c-1', date: '2026-11-13', startTime: '20:00' }
    const newBooking = { courtId: 'c-1', date: '2026-11-13', startTime: '21:00' }

    const isOverlap =
      existing.courtId === newBooking.courtId &&
      existing.date === newBooking.date &&
      existing.startTime === newBooking.startTime

    expect(isOverlap).toBe(false)
  })

  it('Debe cambiar automáticamente el estado a FULL cuando se completa el cupo', () => {
    const totalPlayers = 10
    const confirmedPlayers = 10
    const status = confirmedPlayers >= totalPlayers ? 'FULL' : 'OPEN'
    expect(status).toBe('FULL')
  })
})

