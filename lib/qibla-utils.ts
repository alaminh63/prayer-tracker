/**
 * Calculates the Qibla direction (bearing from North) for a given latitude and longitude.
 * Formula: atan2(sin(Δλ), cos(φ1) * tan(φ2) - sin(φ1) * cos(Δλ))
 * where:
 * φ1 = Latitude of current location
 * φ2 = Latitude of Kaaba (21.4225° N)
 * Δλ = Longitude difference (Longitude of Kaaba - Longitude of current location)
 * Longitude of Kaaba = 39.8262° E
 */
export function calculateQibla(latitude: number, longitude: number): number {
  const KAABA_LAT = 21.4225 * (Math.PI / 180)
  const KAABA_LNG = 39.8262 * (Math.PI / 180)

  const phi1 = latitude * (Math.PI / 180)
  const lambda1 = longitude * (Math.PI / 180)

  const deltaLambda = KAABA_LNG - lambda1

  const y = Math.sin(deltaLambda)
  const x =
    Math.cos(phi1) * Math.tan(KAABA_LAT) -
    Math.sin(phi1) * Math.cos(deltaLambda)

  let qibla = Math.atan2(y, x)
  qibla = qibla * (180 / Math.PI)
  qibla = (qibla + 360) % 360

  return qibla
}
