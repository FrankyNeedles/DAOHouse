import { ImageData } from "node_modules/@dcl/ui-scene-utils/dist/utils/types"

let atlas = new Texture('images/arrows.png')

var scrolling = false

export function createScrollBox(
    x:number, y:number, 
    width:number, height:number, 
    contents:string, canvas:UICanvas):Paragraph {

        // create a bounding container to hold all lines
        const container = new UIContainerRect(canvas)

        // generate an array of individual lines from a string
        const text_stack = getTextStackFromString(contents)

        // render a grouping of these lines inside the bounding container
        const paragraph = renderParagraph(text_stack, x, y, height, width, container)

        // TODO: draw a line showing the range of the scroll bar
        // const scroll_line = renderScrollLine(container)

        return paragraph
}

interface Paragraph {
    y: number,
    text_entities: Array<UIText>,
    scrollUp: Function,
    scrollDown: Function,
    start: number,
    end: number
}

function renderParagraph(text_stack:Array<string>, x:number, y:number, height:number, width:number, container:UIContainerRect):Paragraph {
    const line_count = Math.round(height / (lineHeight() * 2))
    let paragraph:Paragraph = {
        y,
        text_entities: [],
        start: 0,
        end: line_count,
        scrollUp: function(btn:UIImage) {
            if (this.start > 0) {
                log(this.start, this.end)
                // shift up one
                this.start--
                this.text_entities[this.start].visible = true
                this.text_entities[this.end].visible = false
                this.end--

                this.y -= lineHeight()
                this.text_entities.map((line, i) => {
                    line.positionY = this.y - (i * lineHeight())
                })
            }
        },
        scrollDown: function(btn:UIImage) {
            // shift down one
            if (this.end < this.text_entities.length - 1) {
                this.text_entities[this.start].visible = false
                this.start++
                this.text_entities[this.end].visible = true
                this.end++
                
                this.y += lineHeight()
                this.text_entities.map((line, i) => {
                    line.positionY = this.y - (i * lineHeight())
                })
            }
        }
    }

    // insert text entities into the queue
    for (let i = 0; i < text_stack.length; i++) {
        let text = new UIText(container)
        text.value = text_stack[i]
        text.color = new Color4(0,0,0,1)
        text.positionX = x
        text.positionY = y - (i * lineHeight())
        if (i > line_count) {
            text.visible = false
        }
        paragraph.text_entities.push(text)
    }

    return paragraph
}

// TODO: move these to buttons file
export function renderUpBtn(canvas:UICanvas, x:number, y:number):UIImage {
    let bar = new UIImage(canvas, atlas)
    bar.vAlign = "top"
    bar.sourceLeft = 0
    bar.sourceTop = 128
    bar.sourceWidth = 128
    bar.sourceHeight = 128
    bar.positionX = x
    bar.positionY = y
    bar.width = 35
    bar.height = 35

    return bar
}
export function renderDownBtn(canvas:UICanvas, x:number, y:number):UIImage {
    let bar = new UIImage(canvas, atlas)
    bar.vAlign = "top"
    bar.sourceLeft = 0
    bar.sourceTop = 0
    bar.sourceWidth = 128
    bar.sourceHeight = 128
    bar.positionX = x
    bar.positionY = y
    bar.width = 35
    bar.height = 35

    return bar
}

export function renderXBtn(canvas:UICanvas, x:number, y:number, theme:Texture):UIImage {
    // Exit button
    const exitButton = new UIImage(canvas, theme)

    exitButton.sourceLeft = 583
    exitButton.sourceTop = 381
    exitButton.sourceWidth = 64
    exitButton.sourceHeight = 64
    exitButton.positionX = x
    exitButton.positionY = y
    exitButton.width = 35
    exitButton.height = 35

    return exitButton
}

export function renderWhiteXBtn(canvas:UICanvas, x:number, y:number):UIImage {
    const button = new UIImage(canvas, atlas)

    button.sourceLeft = 512
    button.sourceTop = 0
    button.sourceWidth = 128
    button.sourceHeight = 128
    button.positionX = x
    button.positionY = y
    button.width = 35
    button.height = 35

    return button
}

function getTextStackFromString(contents:String):Array<string> {
    let lines = contents.split('\n')
    let index = 0
    let stack = [""]
    lines.map((line) => {
        let t_line = line
        while (t_line.length > lineLength()) {
            stack.push(t_line.slice(0, lineLength()))
            t_line = t_line.slice(lineLength())
        }
        stack.push(t_line)
    })
    return stack
}

const lineLength = () => {
    return 85
}

const lineHeight = () => {
    return 16
}