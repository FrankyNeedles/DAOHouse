//  import {spawnGltfX, spawnEntity, spawnBoxX, spawnPlaneX} from './modules/SpawnerFunctions'
import * as teleporters from './modules/Teleporters'

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

let animator = new Animator()
DAOStage.addComponent(animator)

const stageCLIP = new AnimationState("StageAction")
animator.addClip(stageCLIP)
stageCLIP.play()
stageCLIP.playing = true
stageCLIP.looping = true

const row1CLIP = new AnimationState("1stRowAction")
animator.addClip(row1CLIP)
row1CLIP.play()
row1CLIP.playing = true
row1CLIP.looping = true

const row2CLIP = new AnimationState("2ndRowAction")
animator.addClip(row2CLIP)
row2CLIP.play()
row2CLIP.playing = true
row2CLIP.looping = true

const row3CLIP = new AnimationState("3rdRowAction")
animator.addClip(row3CLIP)
row3CLIP.play()
row3CLIP.playing = true
row3CLIP.looping = true

// hud.attachToEntity(DAOScene)

const teleporterLocations = [
  new Vector3(18.5, 2, 8),
  new Vector3(45.5,2,40),
  new Vector3(18.5,2,40),
  new Vector3(45.5,2,8)
]

let teleporterEntities = teleporters.setupTeleporters(teleporterLocations)


// const ball = new Entity()
// ball.addComponent(new SphereShape())
// ball.getComponent(SphereShape).withCollisions = false
// ball.addComponent(new Transform({position: teleporterLocations[0], scale: new Vector3(.5,.5,.5)}))
// engine.addEntity(ball)

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
