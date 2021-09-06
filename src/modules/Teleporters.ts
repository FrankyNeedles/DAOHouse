import * as utils from '@dcl/ecs-scene-utils'
import { movePlayerTo } from '@decentraland/RestrictedActions'

export const setupTeleporters = (locationArray:Array<Vector3>):Array<Entity> => {

    const entities = locationArray.map(location => {
       const box = new Entity()
  
       //create shape for entity and disable its collision
       box.addComponent(new BoxShape())
       box.getComponent(BoxShape).withCollisions = false
       box.getComponent(BoxShape).visible = false
   
       //set transform component with initial position
       box.addComponent(new Transform({ position: location, scale: new Vector3(2,4,2), rotation: new Quaternion(0,0,.6,0) }))
   
       // create trigger area object, setting size and relative position
       let triggerBox = new utils.TriggerBoxShape(new Vector3(2,4,2))
   
       //create trigger for entity
       box.addComponent(
         new utils.TriggerComponent(
           triggerBox, //shape
         {
           onCameraEnter :() => {
             movePlayerTo(new Vector3(40, 40, 25))
           }
         
         }
           
         )
       )

       
        const beam = new Entity('beam')
        const beamShape = new GLTFShape("models/beam.gltf")
        beam.addComponent(beamShape)
        beam.addComponent(
          new Transform({
            position: location.add(Vector3.Down().scale(2)),
            rotation: Quaternion.Euler(0,90,0),
            scale: new Vector3(.8,.8,.8)
          })
        )
        engine.addEntity(beam)
   
       //add entity to engine
       engine.addEntity(box)
       return box
    })
  
    return entities
  
  }
