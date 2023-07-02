import { lightTheme } from "@dcl/ui-scene-utils"
import { makeAddButton } from "./buttons"
import { EntityList } from "./ui_util"
import * as api from "./api"

export class ProposalListUI {
  ui_elements = new EntityList()
  canvas: UICanvas
  x:number
  addButton:UIImage
  exitButton:UIImage
  proposals:Array<api.ProposalItem> = []
  selected_proposals:Array<api.ProposalItem> = []
  visible:boolean = true

  constructor(canvas:UICanvas, globalX:number) {
    this.x = globalX
    this.canvas = canvas

    const background = new UIImage(canvas, lightTheme)
    background.sourceWidth = 416
    background.sourceHeight = 356
    background.sourceLeft = 500
    background.sourceTop = 11
    background.width = 600
    background.height = 500
    background.positionX = globalX
    
    this.ui_elements.add(background)

    const titleText = new UIText(canvas)
    titleText.color = Color4.Black()
    titleText.value = 'Recent Proposals'
    titleText.fontSize = 24
    titleText.positionX = -220 + globalX
    titleText.positionY = 220

    this.ui_elements.add(titleText)

    const subtitleText = new UIText(canvas)
    subtitleText.color = Color4.Black()
    subtitleText.value = 'Active Proposals'
    subtitleText.fontSize = 16
    subtitleText.positionX = -220 + globalX
    subtitleText.positionY = 180

    this.ui_elements.add(subtitleText)

    const addButton = makeAddButton(canvas, lightTheme, globalX)

    this.addButton = addButton

    this.ui_elements.add(addButton)

    const addText = new UIText(addButton)
    addText.isPointerBlocker = false
    addText.value = 'Add +'
    addText.color = Color4.White()
    addText.fontSize = 18
    addText.positionX = "23%"
    addText.positionY = "45%"

    this.ui_elements.add(addText)

    // // open button
    // const openButton = new UIImage(canvas, lightTheme)
    // openButton.sourceLeft = 583
    // openButton.sourceTop = 381
    // openButton.sourceWidth = 64
    // openButton.sourceHeight = 64
    // openButton.positionX = -10
    // openButton.positionY = 210
    // openButton.hAlign = "right"
    // openButton.width = 35
    // openButton.height = 35
    // openButton.visible = false
    // openButton.isPointerBlocker = false

    // this.ui_elements.add(openButton)

    // openButton.onClick = new OnPointerDown(() => {
    //     this.ui_elements.toggle()
    // })

    // Exit button
    const exitButton = new UIImage(canvas, lightTheme)
    this.exitButton = exitButton

    exitButton.sourceLeft = 583
    exitButton.sourceTop = 381
    exitButton.sourceWidth = 64
    exitButton.sourceHeight = 64
    exitButton.positionX = 180
    exitButton.positionY = 210
    exitButton.width = 35
    exitButton.height = 35

    this.ui_elements.add(exitButton)
    this.deselect()

    this.hide()

  }

  deselect() {
    log("deselecting")
    this.ui_elements.map((element:UIImage|UIText) => {
      if (element instanceof UIImage && element.sourceLeft == 530 && element.sourceTop == 670) {
        element.sourceWidth = 200
        element.sourceHeight = 5
        element.sourceLeft = 35
        element.sourceTop = 398
        element.width = 540
        element.height = 16
        element.positionX = this.x
      }
      if (element instanceof UIText && element.name == "proposal-title") {
          element.color = Color4.Black()
      }
      return false
    })
  }

  deselectOneProposalByName(name:string) {
    const elements = this.ui_elements.list.filter((e:UIImage | UIText) => {
      return e.name == name
    })
    
    elements.map((element) => {
      if (element instanceof UIImage) {
        element.sourceWidth = 200
        element.sourceHeight = 5
        element.sourceLeft = 35
        element.sourceTop = 398
      }
      if (element instanceof UIText) {
        element.color = Color4.Black()
      }
    })

  }

  show() {
    if (!this.visible) {
      this.ui_elements.showAll()
      this.visible = true
    }
  }

  hide() {
    if (this.visible) {
      this.ui_elements.hideAll()
      this.visible = false
      this.deselect()
    }
  }

  removeProposal(title:string) {
    this.selected_proposals = this.selected_proposals.filter((proposal:api.ProposalItem) => {
      if (proposal.title == title) {
        return false
      } else {
        return true
      }
    })
  }

  async getProposals():Promise<Array<api.ProposalItem>> {
    const proposals = await api.proposalItemDataSet()
    this.proposals = proposals
    this.renderProposals()
    this.hide()
    return proposals
  }
  
  renderProposals() {
    log(this.proposals)
    let spacer = -125

    // render list of all proposals and set up message send
    this.proposals.map((proposalItem:api.ProposalItem) => {    
      // draw the UI for each proposal
      const rect = new UIImage(this.canvas, lightTheme)
      rect.sourceWidth = 200
      rect.sourceHeight = 5
      rect.sourceLeft = 35
      rect.sourceTop = 398
      rect.width = 540
      rect.height = 16
      rect.positionX = this.x
      rect.positionY = spacer

      rect.visible = this.visible

      this.ui_elements.add(rect)
      
      const title = new UIText(rect)
      title.isPointerBlocker = false
      title.color = Color4.Black()
      title.value = proposalItem.title
      title.fontSize = 12
      title.positionX = -210
      title.positionY = 18

      title.visible = this.visible

      this.ui_elements.add(title)

      // set up selection UI behavior
      rect.onClick = new OnPointerDown(() => {
          if (this.selected_proposals.indexOf(proposalItem) != -1) {
            this.removeProposal(proposalItem.title)
            // implement click to toggle selection
          }
          this.selected_proposals.push(proposalItem)

          rect.sourceLeft = 530
          rect.sourceTop = 670
          rect.sourceWidth = 1
          rect.sourceHeight = 1
          rect.opacity = 1

          title.color = Color4.White()
          title.name = "proposal-title"

          this.addButton.sourceLeft = 512
          this.addButton.sourceTop = 662
          this.addButton.sourceWidth = 180
          this.addButton.sourceHeight = 50
      })

      spacer += 20
    })
  }

  render() {
    // reset vertical spacing
    let yOffset = 0
  
    // Render each item of the render queue
    this.proposals.map((item:api.ProposalItem) => {
        this.renderProposal(this.x, yOffset, item)
    })
  }

  private renderProposal (xOffset: number, yOffset:number, proposal: api.ProposalItem) {
    const titleText = new UIText(this.canvas)
    titleText.color = Color4.Black()
    titleText.value = proposal.title
    titleText.fontSize = 12
    titleText.positionX = xOffset + 20
    titleText.positionY = 200 - yOffset
    yOffset += 20

    titleText.visible = this.visible
  
    this.ui_elements.add(titleText)
  }

}
