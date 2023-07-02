import { EntityList } from "./ui_util"
import { ProposalItem } from "./api"
import { lightTheme } from "@dcl/ui-scene-utils"
import { renderWhiteXBtn } from "./ui-text-box"
import { requestQueue } from "./messaging"

export class ProposalQueueUI {
  ui_elements:EntityList = new EntityList()
  canvas:UICanvas
  proposals:Array<ProposalItem> = []
  visible: boolean = true
  x:number
  bus:MessageBus

  constructor(
      xPos:number, 
      canvas:UICanvas,
      bus:MessageBus
  ){
    this.canvas = canvas
    this.x = xPos
    this.bus = bus

    this.render()

    this.hide()
  }

  // add a proposal to the list of proposals, with no duplicates
  // create a corresponding UI item and render if needed
  add(proposal:ProposalItem) {
    log("add ", proposal.title)
    if (this.proposals.map(proposal => proposal.id).indexOf(proposal.id) == -1) {
      this.proposals.push(proposal)
      this.createQueueItemByIndex(this.proposals.length - 1)
    }
  }

  // remove a proposal from the list of proposals
  // delete its corresponding UI items
  remove(proposal:ProposalItem) {
    this.proposals = this.proposals.filter((item:ProposalItem) => {
      if (item.title == proposal.title) {
        return false
      } else {
        return true
      }
    })
    // wipe queue to set new indices for vertical positioning
    this.ui_elements.delete()
    // this.ui_elements.deleteByTextTitle(proposal.title.slice(0,26) + "...")
    // this.ui_elements.deleteByEntityName(`${proposal.title}-rect`)
    this.render()
  }

  render() {
    const queueBg = new UIImage(this.canvas, lightTheme)
    queueBg.sourceWidth = 416
    queueBg.sourceHeight = 356
    queueBg.sourceLeft = 500
    queueBg.sourceTop = 11
    queueBg.width = 250
    queueBg.height = 500
    queueBg.positionX = this.x
    queueBg.name = "queue-bg"

    this.ui_elements.add(queueBg)

    const titleText = new UIText(this.canvas)
    titleText.color = Color4.Black()
    titleText.value = 'Active Queue'
    titleText.fontSize = 24
    titleText.positionX = this.x - 40
    titleText.positionY = 220
    titleText.name = "title-text"

    this.ui_elements.add(titleText)

    for (let i = 0; i < this.proposals.length; i++) {
      this.createQueueItemByIndex(i)
    }

    if (this.visible == false) {
      this.hide()
    }

  }

  hide() {
    this.visible = false
    this.ui_elements.hideAll()
  }

  show() {
    if (!this.visible) {
      this.visible = true
      this.ui_elements.showAll()
    }
  }

  deselectAll() {
    this.ui_elements.deleteByEntityName('delete')
    this.ui_elements.list.map((element:UIImage|UIText) => {
      if (element instanceof UIImage && element.sourceLeft == 530 && element.sourceTop == 670) {
        element.sourceWidth = 200
        element.sourceHeight = 5
        element.sourceLeft = 35
        element.sourceTop = 398
        element.positionX = this.x
      }
      if (element instanceof UIText && element.name == "proposal-title") {
          element.color = Color4.Black()
      }
      return false
    })
  }

  private createTitle(canvas:UICanvas, title:string, index:number, width:number, lines:number):UIText {
    const proposal_title = new UIText(this.canvas)
    proposal_title.name = "proposal-title"
    proposal_title.visible = false
    proposal_title.color = Color4.Black()
    proposal_title.value = title.slice(0,30) + '...'
    proposal_title.fontSize = 12
    proposal_title.positionX = this.x + 10
    proposal_title.positionY = -62 -(index + 1) * 20
    proposal_title.width = width
    proposal_title.height = 48
    proposal_title.textWrapping = false
    proposal_title.vAlign = "top"
    proposal_title.lineCount = lines
    proposal_title.isPointerBlocker = false
    return proposal_title
  }

  private createQueueItemByIndex(index: number) {
    const ypos = 200 -(20 * (index + 1))
    const proposal = this.proposals[index]

    // set up proposal background
    const rect = new UIImage(this.canvas, lightTheme)
    rect.name = `${proposal.title}-rect`
    rect.sourceWidth = 200
    rect.sourceHeight = 5
    rect.sourceLeft = 35
    rect.sourceTop = 398
    rect.width = 220
    rect.height = 16
    rect.positionX = this.x

    // idk what is going on here
    rect.positionY = ypos + 3

    // set up proposal title text
    const proposal_title = this.createTitle(this.canvas, proposal.title, index, 200, 2)

    // add pre-existing proposals to queue while UI is closed
    if (this.visible) {
      proposal_title.visible = true
    }

    // make removable
    rect.onClick = new OnPointerDown(() => {
      this.deselectAll()
      rect.sourceLeft = 530
      rect.sourceTop = 670
      rect.sourceWidth = 1
      rect.sourceHeight = 1
      rect.opacity = 1

      proposal_title.color = Color4.White()

      const xbtn = renderWhiteXBtn(this.canvas, this.x + 155, ypos)
      xbtn.name = 'delete'
      this.ui_elements.add(xbtn)

      // remove from queue, delete from entity list
      xbtn.onClick = new OnPointerDown(() => {
        rect.visible = false
        this.ui_elements.deleteByEntityName(`${proposal_title}-rect`)
        this.bus.emit("proposalRemoved", {
          proposal: proposal
        })
        xbtn.visible = false
        this.ui_elements.deleteByEntityName('delete')
      })
    })

    // register proposal and background
    this.ui_elements.add(proposal_title)
    this.ui_elements.add(rect)
  }
}