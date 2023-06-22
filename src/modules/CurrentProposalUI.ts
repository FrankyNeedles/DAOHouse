import { ProposalItem } from "./api"
import { EntityList } from "./ui_util"
import { lightTheme } from "@dcl/ui-scene-utils"

/*  
  Display a preview bar of the proposal currently at the top of the queue.
  In its empty state, the proposal shows that no proposals have been queued and invites
  the user to add proposals to the queue.
  The bar displays the proposal title (truncated), its rational index in the queue,
  and votes for, against, threshold met or not
*/

export class CurrentProposalUI {
  ui_elements:EntityList = new EntityList()
  canvas: UICanvas
  proposal: any
  globalX: number
  container: UIContainerRect

  constructor(canvas:UICanvas, globalX: number) {
    this.canvas = canvas
    this.globalX = globalX
    this.proposal = null

    const background_top = new UIImage(canvas, lightTheme)
    background_top.hAlign = "center"
    background_top.sourceWidth = 780
    background_top.sourceHeight = 95
    background_top.sourceLeft = 11
    background_top.sourceTop = 750
    background_top.width = 600
    background_top.height = 80
    background_top.positionY = -50
    background_top.vAlign = "bottom"
    this.ui_elements.add(background_top)

    const container = new UIContainerRect(canvas)
    container.hAlign = "center"
    container.width = 580
    container.height = 50
    container.positionX = 20
    container.vAlign = "bottom"

    this.container = container

    const labelText = new UIText(container)
    labelText.color = Color4.Black()
    labelText.value = 'CURRENT PROPOSAL'
    labelText.fontSize = 10
    labelText.positionX = 0
    labelText.hAlign = "left"
    labelText.vAlign = "bottom"
  }

  recieve(proposal:ProposalItem) {
    if (this.proposal == null) {
      this.proposal = proposal
      this.setProposal(proposal)
    }
  }

  setProposal(proposal:ProposalItem) {
    const canvas = this.canvas
    const globalX = this.globalX

    const titleText = new UIText(this.container)
    titleText.color = Color4.Black()
    titleText.value = proposal.title
    titleText.fontSize = 14
    titleText.positionY = -20
    titleText.hAlign = "left"
    titleText.vAlign = "bottom"
    titleText.width = "80%"
    this.ui_elements.add(titleText)
  }
  // expand()
  // minimize()
  // next()
  // prev()

}