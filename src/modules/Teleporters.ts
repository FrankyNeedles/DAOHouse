import * as utils from '@dcl/ecs-scene-utils'
import { movePlayerTo } from '@decentraland/RestrictedActions'
import { hud } from '@dcl/builder-hud'
import { Particle } from 'particle'

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
            movePlayerTo(new Vector3(location[1].x, location[1].y + 10, location[1].z), new Vector3(22, 38, 25))
            
          }
        }
      )
    )

    // const beam = new Entity('beam')
    // const beamShape = new GLTFShape("models/beam.gltf")
    // beam.addComponent(beamShape)
    // beam.addComponent(
    //   new Transform({
    //     position: location[0].add(Vector3.Down().scale(2)),
    //     rotation: Quaternion.Euler(0, 90, 0),
    //     scale: new Vector3(.8, .8, .8)
    //   })
    // )
    // engine.addEntity(beam)

    //add entity to engine
    engine.addEntity(box)

    // tele pad models
    const tpPad = new Entity('tp-pad')

    engine.addEntity(tpPad)
    
    const transform5 = new Transform({
      position: location[1],
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(4,4,4)
    })
    
    transform5.rotate(new Vector3(0,1,0), location[2].y)

    tpPad.addComponentOrReplace(transform5)

    const tpPadShape = new GLTFShape("models/tp_stairs.gltf")

    tpPadShape.withCollisions = true

    tpPadShape.isPointerBlocker = true

    tpPadShape.visible = true

    tpPad.addComponentOrReplace(tpPadShape)
    // hud.attachToEntity(tpPad)
    return box
  })

  return entities

}

const movableEntities = engine.getComponentGroup(Particle)

export class PhysicsSystem implements ISystem {
  update(dt: number) {
    // Iterate over component group
    for (let entity of movableEntities.entities) {
      entity.getComponent(Transform).position.y = 
        (entity.getComponent(Transform).position.y + entity.getComponent(Particle).speed) % 8
      entity.getComponent(Transform).scale.y = 
        .8 - (entity.getComponent(Transform).position.y / 8)
        entity.getComponent(Transform).scale.x = 
        .8 - (entity.getComponent(Transform).position.y / 8)
        entity.getComponent(Transform).scale.z = 
        .8 - (entity.getComponent(Transform).position.y / 8)
    }
  }
}


engine.addSystem(new PhysicsSystem)
export function setupEffects(engine:Engine, location:Array<Array<Vector3>>) {
  const spawnParticle = (pos:Vector3) => {
    const particle = new Entity()
    particle.addComponent(new BoxShape())
    particle.getComponent(BoxShape).withCollisions = false
    particle.addComponent(new Transform({position: pos, scale: new Vector3(1,1,1)}))
    particle.addComponent(new Billboard())

    particle.addComponent(new Particle(Math.random() / 8 + .05, 1))

    engine.addEntity(particle)
  }

  const spawnParticles = (pos: Vector3) => {
    for (let i = -1.5; i < 3.5; i+=.5) {
      utils.setTimeout((i + 5.5) * 1000, () => {
        spawnParticle(new Vector3(Math.cos(i*2 % 2) * 1.5 - .5 + pos.x, pos.y, pos.z - Math.sin(i*2 % 2) * 1.5 + .5))
      })
    }
  }

  location.map((location:Array<Vector3>) => {
    spawnParticles(location[0])
  })

}
