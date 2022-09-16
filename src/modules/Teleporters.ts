import * as utils from '@dcl/ecs-scene-utils'
import { movePlayerTo } from '@decentraland/RestrictedActions'
import { hud } from '@dcl/builder-hud'

export const setupTeleporters = (locationArray: Array<Array<Vector3>>): Array<Entity> => {

  const entities = locationArray.map(location => {
    const box = new Entity()

    //create shape for entity and disable its collision
    box.addComponent(new BoxShape())
    box.getComponent(BoxShape).withCollisions = false
    box.getComponent(BoxShape).visible = false

    //set transform component with initial position
    box.addComponent(new Transform({ position: location[0], scale: new Vector3(2, 4, 2), rotation: new Quaternion(0, 0, .6, 0) }))

    // create trigger area object, setting size and relative position
    let triggerBox = new utils.TriggerBoxShape(new Vector3(2, 4, 2))

    //create trigger for entity
    box.addComponent(
      new utils.TriggerComponent(
        triggerBox, //shape
        {
          onCameraEnter: () => {
            movePlayerTo(new Vector3(location[1].x, location[1].y + 10, location[1].z))
          }
        }
      )
    )

    const beam = new Entity('beam')
    const beamShape = new GLTFShape("models/beam.gltf")
    beam.addComponent(beamShape)
    beam.addComponent(
      new Transform({
        position: location[0].add(Vector3.Down().scale(2)),
        rotation: Quaternion.Euler(0, 90, 0),
        scale: new Vector3(.8, .8, .8)
      })
    )
    engine.addEntity(beam)

    //add entity to engine
    engine.addEntity(box)

    // tele pad models
    const tpPad = new Entity('tp-pad')

    engine.addEntity(tpPad)
    
    const transform5 = new Transform({
      position: location[1],
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    })
    
    transform5.rotate(new Vector3(0,1,0), location[2].y)

    tpPad.addComponentOrReplace(transform5)

    const tpPadShape = new GLTFShape("models/tpPad.gltf")

    tpPadShape.withCollisions = true

    tpPadShape.isPointerBlocker = true

    tpPadShape.visible = true

    tpPad.addComponentOrReplace(tpPadShape)
    hud.attachToEntity(tpPad)
    return box
  })

  return entities

}
