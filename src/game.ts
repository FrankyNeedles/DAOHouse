//  import {spawnGltfX, spawnEntity, spawnBoxX, spawnPlaneX} from './modules/SpawnerFunctions'

import * as teleporters from './modules/Teleporters'
import { setTimeout } from '@dcl/ecs-scene-utils'
import * as setups from './modules/setups'
import * as ui from './modules/ui'

ui.setupUi()

engine.addEntity(setups.scene())
engine.addEntity(setups.stage())
engine.addEntity(setups.podiumCollider())

const teleporterLocations = [
  [new Vector3(18.5, 2, 8), new Vector3(15.5, 27.7, 6), new Vector3(0,-50,0)],
  [new Vector3(45.5,2,40), new Vector3(47.5, 27.7, 42), new Vector3(0,130,0)],
  [new Vector3(18.5,2,40), new Vector3(14.5,27.7,42), new Vector3(0,45,0)],
  [new Vector3(45.5,2,8),  new Vector3(48.5,27.7,7), new Vector3(0,-135,0)]
]

let teleporterEntities = teleporters.setupTeleporters(teleporterLocations)

// TODO: remove these dev tools
// get position all the time for dev convenience
let timer: number = 10

export class LoopSystem {
  update(dt: number) {
    if (timer > 0) {
      timer -= dt
    } else {
      timer = 10
      log(Camera.instance.feetPosition)
    }
  }
}

engine.addSystem(new LoopSystem())

// @Component("lerpData")

// export class LerpData {
//   origin: Vector3 = Vector3.Zero()
//   target: Vector3 = Vector3.Zero()
//   fraction: number = 0
// }

// export class LerpMove implements ISystem {
//   update(dt: number) {
//     let transform = ball.getComponent(Transform)
//     let lerp = ball.getComponent(LerpData)
//     if (lerp.fraction < 1) {
//       transform.position = Vector3.Lerp(lerp.origin, lerp.target, lerp.fraction)
//       lerp.fraction += dt / 3
//     }
//   }
// }


// ball.addComponent(new LerpData())

// export class AnimateTele implements ISystem {
//   update() {
//     teleporterLocations.map(loc => {
//       const lerper = new LerpMove()
//       let inZone = false
//       if (Vector3.Distance(loc,Camera.instance.position) < 10) {
//         engine.addSystem(lerper)
//         ball.getComponent(LerpData).origin = loc
//         ball.getComponent(LerpData).target = loc.add(Vector3.Up())
//         inZone = true
//       } else if (Vector3.Distance(loc,Camera.instance.position) >= 10 && inZone){
//         ball.getComponent(LerpData).origin = loc.add(Vector3.Up())
//         ball.getComponent(LerpData).target = loc
//         inZone = false
//       } 
//     })
//   }
// }

// engine.addSystem(new AnimateTele())
