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

    // get rotation
    // const opp = location[0].x - 24
    // const adj = location[0].z - 32
    // let yRotation

    // get top location
    // let toLocation = new Vector3(location.x, 28, location.z)

    // yRotation = Math.atan(adj/opp) * 180 / Math.PI
    // if (opp < 0 && adj > 0) {
    //   yRotation += 90
    // } else if (opp < 0 && adj < 0) {
    //   // toLocation.x -= 2
    //   // toLocation.z -= 3
    //   yRotation += 233
    // } else if (opp > 0 && adj < 0) {
    //   yRotation -= 90
    // } else {
    //   yRotation += 110
    // }

    // log(yRotation + " final angle")
    
    const transform5 = new Transform({
      position: location[1],
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    })
    
    // transform5.lookAt(new Vector3(24, 28, 32))
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
