import { describe, it, expect } from 'vitest'

describe('OvejaNegra Validaciones de Negocio', () => {
  it('Debe calcular correctamente el precio estimado por jugador', () => {
    const courtPrice = 22000
    const totalPlayers = 10
    const estimatedPrice = Math.round(courtPrice / totalPlayers)
    expect(estimatedPrice).toBe(2200)
  })

  it('No debe permitir que los jugadores confirmados excedan el cupo total', () => {
    const totalPlayers = 10
    let confirmedPlayers = 9
    const canJoin = confirmedPlayers < totalPlayers
    expect(canJoin).toBe(true)

    confirmedPlayers += 1
    const canJoinFull = confirmedPlayers < totalPlayers
    expect(canJoinFull).toBe(false)
  })

  it('Debe formatear correctamente la moneda en Pesos Argentinos (ARS)', () => {
    const price = 25000
    const formatted = price.toLocaleString('es-AR')
    expect(formatted).toContain('25')
  })
})
