//  import {spawnGltfX, spawnEntity, spawnBoxX, spawnPlaneX} from './modules/SpawnerFunctions'

import * as teleporters from './modules/Teleporters'
import { MoveTransformComponent, setTimeout } from '@dcl/ecs-scene-utils'
import * as setups from './modules/setups'
import * as ui from './modules/ui'
import * as books from './modules/library'
import { movePlayerTo } from '@decentraland/RestrictedActions'
import { lightTheme } from '@dcl/ui-scene-utils'


engine.addEntity(setups.scene())
engine.addEntity(setups.stage())
engine.addEntity(setups.podiumCollider())

ui.setupProposalList()
ui.setupProposalQueue()

books.spawnProposalsFromQueue()

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

books.spawnProposals(engine)
teleporters.setupEffects(engine, teleporterLocations)

// teleport for debug reasons
// setTimeout(5000, () => {
//   movePlayerTo(new Vector3(30,32,32))
// })

