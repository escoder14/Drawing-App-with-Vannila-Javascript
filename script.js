// alert("hi")
const canvas = document.querySelector("canvas"),
toolsBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImage = document.querySelector(".save-img"),
undoPath = document.querySelector("#undoPath"),
ctx = canvas.getContext("2d");


//Gloabal Varibles with default values
let preMouseX, preMouseY, snapshot
 isDrawing = false;
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0, canvas.width, canvas.height)
    ctx.fillStyle = selectedColor; //Setting fill style back to the selected color, it'll be the brush color
}

window.addEventListener("load", () => {
    //setting Canvas Width & Height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
})



const drawRect = (e) => {
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, preMouseY - e.offsetY);
        
    }
    else{
        ctx.fillRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, preMouseY - e.offsetY);
        
    }
}

const drawCircle = (e) => {

    //settting radius of cirlce according to mouse pointer
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((preMouseX - e.offsetX),  2) + Math.pow((preMouseY - e.offsetY), 2));
    // arc method is used to draw a circle
    //ctx.arc(x-coordinate, y-coordinate, radius, start angle, end angle)
    ctx.arc(preMouseX, preMouseY, radius, 0, 2*Math.PI);
    // ctx.stroke();
    fillColor.checked ? ctx.fill() : ctx.stroke();
    
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(preMouseX, preMouseY); //Moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // Creating first line according to the mouse pointer
    ctx.lineTo(preMouseX*2 - e.offsetX, e.offsetY) // Creating bottom line of the triangle
    ctx.closePath(); //Closing path of the triangle so third line will be drawn automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); ctx.stroke();

}

const startDrawing = (e) => {
    isDrawing = true;

    preMouseX = e.offsetX;//Passing Current mouse X position as current PreMouseX Value
    preMouseY = e.offsetY;//Passing Current mouse Y position as current PreMouseY Value

        ctx.beginPath(); //Creating new path to start
        ctx.lineWidth = brushWidth; //Passing Brush Size as Line Width
        ctx.strokeStyle = selectedColor; //Passing selectedColor as stroke Style
        ctx.fillStyle = selectedColor;  //Passing selectedColor as fill Style
        // Copying canvas data & passing as snapshot value. This avoids dragging the image
        snapshot = ctx.getImageData(0,0, canvas.width, canvas.height)
}

const drawing = (e) => {
    if(!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0); //adding copied canvas data on this canvas
    if(selectedTool === "brush" || selectedTool === "eraser"){
            //is slected tool is eraser than set strokestle to white
            //to paint white color on to the existing canvas content else set the stroke to selected color

        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;

    ctx.lineTo(e.offsetX, e.offsetY);  //creating line according to the mouse pointer
    ctx.stroke(); // drawing/filling line color
    }
    else if (selectedTool === "rectangle"){

    drawRect(e);
    }
    else if (selectedTool === "circle"){
    drawCircle(e);
    }
    else{
        drawTriangle(e);
    }
}
toolsBtns.forEach(btn =>  {
    btn.addEventListener("click", () => {
        //removing active class from the previous option and adding it to new slected option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    })
})

sizeSlider.addEventListener("change", ()=> brushWidth = sizeSlider.value) //Passing slider value as brush value

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        //removing active class from the previous option and adding it to new slected option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        //passing slected btn background color as selectedColor Value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    })
})


colorPicker.addEventListener("change", () => {
    //passing picked color value from picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
})

clearCanvas.addEventListener("click", () => {
   
    ctx.clearRect(0,0, canvas.width, canvas.height)//Clearing whole Canvas

})
saveImage.addEventListener("click", () => {
    const link = document.createElement("a");//Creating <a> element
    link.download = `${Date.now()}.jpg`; //Passing Current Date as link download Value
    link.href = canvas.toDataURL(); //Passing Canvas Data as link href value
    link.click();   //CLicking link to download Image
})

canvas.addEventListener("mousedown", startDrawing)
canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mouseup", () => isDrawing = false);
