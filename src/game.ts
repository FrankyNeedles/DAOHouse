//  import {BuilderHUD} from './modules/BuilderHUD'
//  import {spawnGltfX, spawnEntity, spawnBoxX, spawnPlaneX} from './modules/SpawnerFunctions'
import * as teleporters from './modules/Teleporters'

//  const hud = new BuilderHUD()
const DAOScene = new Entity('DAOScene')

engine.addEntity(DAOScene)

const transform4 = new Transform({
  position: new Vector3(32,0,24),
  rotation: Quaternion.Euler(0, 90, 0),
  scale: new Vector3(1, 1, 1)
})

DAOScene.addComponentOrReplace(transform4)

const DAOSceneShape = new GLTFShape("models/DAOHouse.gltf")

DAOSceneShape.withCollisions = true

DAOSceneShape.isPointerBlocker = true

DAOSceneShape.visible = true

DAOScene.addComponentOrReplace(DAOSceneShape)

const DAOStage = new Entity('DAOStage')

engine.addEntity(DAOStage)

const transform3 = new Transform({
  position: new Vector3(32,30,24),
  rotation: Quaternion.Euler(0, 90, 0),
  scale: new Vector3(1, 1, 1)
})

DAOStage.addComponentOrReplace(transform3)

const DAOStageShape = new GLTFShape("models/DAOStage.gltf")

DAOStageShape.withCollisions = true

DAOStageShape.isPointerBlocker = true

DAOStageShape.visible = true

DAOStage.addComponentOrReplace(DAOStageShape)

// hud.attachToEntity(DAOScene)

const teleporterLocations = [
  new Vector3(18.5, 2, 8),
  new Vector3(45.5,2,40),
  new Vector3(18.5,2,40),
  new Vector3(45.5,2,8)
]

let teleporterEntities = teleporters.setupTeleporters(teleporterLocations)
