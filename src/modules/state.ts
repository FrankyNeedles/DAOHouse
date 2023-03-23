
import { ProposalItem } from './api'

export interface SceneState {
    queue: Array<ProposalItem>
    // last_state_hash: SceneState
}

var my_scene_state:SceneState = {queue:[]}

// export const queryState = (bus:MessageBus) => {
//     bus.on("state update", data) {
//         my_scene_state.update(data.scene_state)
//     }

//     bus.emit("state query", my_scene_state)
// }