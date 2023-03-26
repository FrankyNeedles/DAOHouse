import { EntityList } from "./ui_util"
import { ProposalItem } from "./api"
import { lightTheme } from "@dcl/ui-scene-utils"

export class ProposalQueueUI {
  list:EntityList = new EntityList()
  canvas:UICanvas
  proposals:Array<ProposalItem> = []
  visible: boolean = true
  x:number

  constructor(
      xPos:number, 
      canvas:UICanvas, 
  ){
    this.canvas = canvas
    this.x = xPos

    const queueBg = new UIImage(canvas, lightTheme)
    queueBg.sourceWidth = 416
    queueBg.sourceHeight = 356
    queueBg.sourceLeft = 500
    queueBg.sourceTop = 11
    queueBg.width = 250
    queueBg.height = 500
    queueBg.positionX = xPos

    this.list.add(queueBg)

    const titleText = new UIText(canvas)
    titleText.color = Color4.Black()
    titleText.value = 'Active Queue'
    titleText.fontSize = 24
    titleText.positionX = xPos - 40
    titleText.positionY = 220

    this.list.add(titleText)

    this.hide()
  }

  // add a proposal to the list of proposals, with no duplicates
  // create a corresponding UI item and render if needed
  add(proposal:ProposalItem) {
    log("add ", proposal.title)
    if (this.proposals.map(proposal => proposal.id).indexOf(proposal.id) == -1) {
      this.proposals.push(proposal)
      this.createQueueItem(this.proposals.length - 1)
    }
  }

  // remove a proposal from the list of proposals
  // delete its corresponding UI item
  remove(proposal:ProposalItem) {
    this.proposals = this.proposals.filter((item:ProposalItem) => {
      if (item.id == proposal.id) {
          return false
      } else {
          return true
      }
    })
    this.list.deleteByTextTitle(proposal)
  }

  hide() {
    this.visible = false
    this.list.hideAll()
  }

  show() {
    if (!this.visible) {
      this.visible = true
      this.list.showAll()
    }
  }

  private createQueueItem(index: number) {
    log("create ", this.proposals[index].title)
    const proposal = this.proposals[index]
    const proposal_title = new UIText(this.canvas)
    proposal_title.visible = false
    proposal_title.color = Color4.Black()
    proposal_title.value = proposal.title
    proposal_title.fontSize = 12
    proposal_title.positionX = this.x + 20
    proposal_title.positionY = 200 -(48 * (index + 1))
    proposal_title.width = 210
    proposal_title.textWrapping = true
    // proposal_title.vAlign = "top"
    proposal_title.lineCount = 2

    if (this.visible) {
      proposal_title.visible = true
    }

    this.list.add(proposal_title)
  }
}