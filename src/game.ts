//  import {BuilderHUD} from './modules/BuilderHUD'
//  import {spawnGltfX, spawnEntity, spawnBoxX, spawnPlaneX} from './modules/SpawnerFunctions'

//  const hud = new BuilderHUD()
const defaultbuilding = new Entity('defaultbuilding')
engine.addEntity(defaultbuilding)
const transform4 = new Transform({
  position: new Vector3(32,0,24),
  rotation: Quaternion.Euler(0, 90, 0),
  scale: new Vector3(1, 1, 1)
})
defaultbuilding.addComponentOrReplace(transform4)
const gltfShape2 = new GLTFShape("models/DAOHouse.gltf")
gltfShape2.withCollisions = true
gltfShape2.isPointerBlocker = true
gltfShape2.visible = true
defaultbuilding.addComponentOrReplace(gltfShape2)
// hud.attachToEntity(defaultbuilding)