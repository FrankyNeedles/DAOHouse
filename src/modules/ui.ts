import { map } from '@dcl/ecs-scene-utils'
import * as ui from '@dcl/ui-scene-utils'
import * as api from './api'
import { makeAddButton, makeExitButton } from './buttons'
import { requestQueue } from './messaging'
import { createScrollBox } from './ui-text-box'
import { clearUi, toggleUi, indexById, EntityList } from './ui_util'
import { ProposalQueueUI } from './ProposalQueueUI'
import { ProposalListUI } from './ProposalListUI'
import { CurrentProposalUI } from './CurrentProposalUI'

const sceneMessageBus = new MessageBus()

export interface PropList<T> {
    [index: string]: T
}

const globalX = -80
const margin = 20

export const lightTheme = new Texture('https://decentraland.org/images/ui/light-atlas-v3.png')

function setUpUI():{canvas:UICanvas, proposal_queue_ui:ProposalQueueUI, proposal_list_ui:ProposalListUI, current_proposal_ui:CurrentProposalUI} {
    const canvas = new UICanvas()
    const proposal_queue_ui = new ProposalQueueUI(380, canvas)
    const proposal_list_ui = new ProposalListUI(canvas, globalX)
    const current_proposal_ui = new CurrentProposalUI(canvas, globalX)
    return { canvas, proposal_queue_ui, proposal_list_ui, current_proposal_ui }
}

export const gui = setUpUI()

export const setupProposalList = () => {
    // refresh list of props
    gui.proposal_list_ui.getProposals()

    // register add button
    gui.proposal_list_ui.addButton.onClick = new OnPointerDown(() => {
        sceneMessageBus.emit("proposalsAdded", {proposals: gui.proposal_list_ui.selected_proposals})
        gui.proposal_list_ui.deselect()
    })

    // register exit button
    gui.proposal_list_ui.exitButton.onClick = new OnPointerDown(() => {
        gui.proposal_list_ui.hide()
        gui.proposal_queue_ui.hide()
      })
}

export const setupProposalQueue = () => {

    // listen for proposals added to the queue
    sceneMessageBus.on("proposalsAdded", (data) => {
        const proposals:Array<api.ProposalItem> = data.proposals
        proposals.map(proposal => {
            gui.proposal_queue_ui.add(proposal)
            gui.current_proposal_ui.recieve(proposal)
        })
    })

    // listen for proposals removed from the queue
    sceneMessageBus.on("proposalRemoved", (data) => {
        gui.proposal_queue_ui.remove(data.proposal)
    })

    // send all queued proposals to everyone listening
    // usage: acts as an add-only global sync
    sceneMessageBus.on("requestQueue", () => {
        sceneMessageBus.emit("proposalsAdded", {proposals: gui.proposal_queue_ui.proposals})
    })

    // gui.proposal_queue_ui.show()
}

export const setupPodiums = (locations:Array<Array<any>>) => {
    locations.map((location:Array<any>) => {
        const box = new Entity()
        box.addComponent(new BoxShape())
        box.getComponent(BoxShape).withCollisions = false
        box.getComponent(BoxShape).visible = true
        box.getComponent(BoxShape).isPointerBlocker = true
        box.addComponent(new Transform({
            position: location[0], 
            scale: new Vector3(.8,.1,.8), 
            rotation: location[1]}))
        box.addComponent(new OnPointerDown(() => {
            sceneMessageBus.emit("requestQueue", {})
            gui.proposal_queue_ui.show()
            gui.proposal_list_ui.show()
        }))
        engine.addEntity(box)
    })
}

setupPodiums([
    [new Vector3(32,1.2,16), Quaternion.Euler(36, 180, 0)], 
    [new Vector3(32,1.2,32), Quaternion.Euler(36, 0, 0)]])

