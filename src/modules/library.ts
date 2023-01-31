
import * as ui from 'ui'
import { ProposalItem, proposalItem } from './api'

export function spawnProposals(engine:Engine) {
    spawnBookshelf(12, 17, 14.5)
    spawnBookshelf(52.9, 17, 14.5, true)
}

const spawnBookshelf = (from: number, fromZ: number, toZ: number, flip:boolean=false) => {
    let sign = 1

    if (flip) {
        sign = -1
    }
    
    //front
    for (let i = 0; i < 98; i++) {
        for (let j = .75; j <= 2.5; j+=.75) {
            const pos = new Vector3(
                from - 0.2 - sign * Math.cos(Math.abs(i - 50)/25),
                j,
                fromZ + (toZ * i / 100)
            )
            spawnProposal(pos)
        }
    }

    //back
    for (let i = 0; i < 98; i++) {
        for (let j = .75; j <= 2.5; j+=.75) {
            const pos = new Vector3(
                from - 0.8 - sign * Math.cos(Math.abs(i - 50)/25),
                j,
                fromZ + (toZ * i / 100)
            )
            spawnProposal(pos)
        }
    }
}

const spawnProposal = (pos:Vector3) => {
    const book = new Entity()
    book.addComponent(new BoxShape())
    book.getComponent(BoxShape).withCollisions = false
    book.addComponent(new Transform({position: pos, scale: new Vector3(.1,.5,.3)}))
    book.getComponent(Transform).lookAt(new Vector3(32, 1, 24))
    book.addComponent(new OnPointerDown((e) => {
        ui.renderSingleProposalView()
    }))
    engine.addEntity(book)
}

export const spawnProposalsFromQueue = () => {
    const sceneMessageBus = new MessageBus()
    
    sceneMessageBus.on("proposalsAdded", (data) => {
        data.proposals.map((proposal:ProposalItem) => {
            spawnProposal(new Vector3(32 + (Math.random() * 3 - 1.5), 2+ (Math.random() * 2 - .5), 24 + (Math.random() * 3 - 1.5)))
        })
    })
}