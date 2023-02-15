@Component("particle")
export class Particle {
  speed: number
  size: number
  constructor(speed: number, size: number) {
    this.speed = speed
    this.size = size
  }
}