import { hud } from '@dcl/builder-hud'
import * as utils from '@dcl/ecs-scene-utils'
import { movePlayerTo } from '@decentraland/RestrictedActions'

export function scene () {
    const DAOScene = new Entity('DAOScene')

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

    return DAOScene
}

export function stage () {
    const DAOStage = new Entity('DAOStage')

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

    return DAOStage
}

export function podiumCollider() {
    const podiumCollider = new Entity()
    podiumCollider.addComponent(new CylinderShape())
    podiumCollider.getComponent(CylinderShape).withCollisions = false
    podiumCollider.getComponent(CylinderShape).visible = false
    podiumCollider.addComponent(new Transform({position: new Vector3(25.1,32.8,20.8), scale: new Vector3(1.5,1.5,1.5)}))
    hud.attachToEntity(podiumCollider)

    // create trigger area object, setting size and relative position
    let triggerBox = new utils.TriggerBoxShape(new Vector3(4,4,4), new Vector3(0,1,0))

    //create trigger for entity
    podiumCollider.addComponent(
      new utils.TriggerComponent(
        triggerBox, //shape
        {
          onCameraEnter: () => {
            movePlayerTo(new Vector3(25.1,36,20.8))
          }

        }

      )
    )
    return podiumCollider
}
