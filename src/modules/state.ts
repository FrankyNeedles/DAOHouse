
import { ProposalItem } from './api'

export interface SceneState {
    queue: Array<ProposalItem>
    // last_state_hash: SceneState
}

var my_scene_state:SceneState = {queue:[]}

// query queue (broadcast)
//     all respond with queue
//     all sum all queues
// add proposal (broadcast)
// remove proposal (broadcast)

