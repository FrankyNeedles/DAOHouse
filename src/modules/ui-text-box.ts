import { spawnBoxX } from "./SpawnerFunctions"

let atlas = new Texture('images/arrows.png')

var scrolling = false

export function createScrollBox(
    x:number, y:number, 
    width:number, height:number, 
    contents:string, canvas:UICanvas):Array<UIText> {

        // create a bounding container to hold all lines
        const container = new UIContainerRect(canvas)

        // generate an array of individual lines from a string
        const text_stack = getTextStackFromString(contents)

        // render a grouping of these lines inside the bounding container
        const paragraph = renderParagraph(text_stack, y, height, width, container)

        // draw a line showing the range of the scroll bar
        // const scroll_line = renderScrollLine(container)

        // render a scroll bar the user can use to move through text
        const up_btn = renderUpBtn(container, 180, -20)
        const down_btn = renderDownBtn(container, 180, 20)
        
        up_btn.onClick = new OnPointerDown(() => {
            paragraph.scrollDown()
            paragraph.scrollDown()
        })
        
        down_btn.onClick = new OnPointerDown(() => {
            paragraph.scrollUp()
            paragraph.scrollUp()
        })

        return paragraph.text_entities
}

interface Paragraph {
    y: number,
    text_entities: Array<UIText>,
    scrollUp: Function,
    scrollDown: Function,
    start: number,
    end: number
}

function renderParagraph(text_stack:Array<string>, y:number, height:number, width:number, container:UIContainerRect):Paragraph {
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
        text.positionX = -300
        text.positionY = y - (i * lineHeight())
        if (i > line_count) {
            text.visible = false
        }
        paragraph.text_entities.push(text)
    }

    return paragraph
}

function renderUpBtn(container:UIContainerRect, x:number, y:number):UIImage {
    let bar = new UIImage(container, atlas)
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
function renderDownBtn(container:UIContainerRect, x:number, y:number):UIImage {
    let bar = new UIImage(container, atlas)
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