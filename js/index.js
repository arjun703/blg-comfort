import { allImages, images, imageData } from "./data/images.js";

// Generate HTML for the grid with the replicated images
document.querySelector('#root').innerHTML = `
    <div class="images-container-wrapper">
        <div class="images-container">
            ${imageData
                .map(image => `
                    <div
                        class="image-wrapper"
                        style ="
                            width: ${image.whlt[0]}px; 
                            position:absolute;
                            height: ${image.whlt[1]}px; 
                            left: ${image.whlt[2]}px;
                            top: ${image.whlt[3]}px;
                            background: #F3F3F3;
                        "
                        data-index="${image.index}"
                    >
                        <img class="image" src="${image.url}" />
                    </div> 
                `)
                .join('')
            }
        </div>
    </div>
`;

const imagesContainer = document.querySelector('.images-container');

const heights = imageData.map(img => img.whlt[1] + img.whlt[3] )
const widths = imageData.map(img => img.whlt[0] + img.whlt[2] )

let imagesContainerHeight = Math.max(...heights);
let imagesContainerWidth = Math.max(...widths);

window.imagesContainerHeight = imagesContainerHeight
window.imagesContainerWidth = imagesContainerWidth



function returnNewDiv(image, block){

    const newDiv = document.createElement('div');
    newDiv.className=  "image-wrapper"
    
    let width = image.whlt[0] + 'px'
    let height= image.whlt[1] +'px'
    let left =  image.whlt[2]
    let top = image.whlt[3]

    switch(block){
        case 'block2': // top right block
            left += imagesContainerWidth
            break;
        case 'block3': // bottom left
            top += imagesContainerHeight;
            break;
        case 'block4': // bottom right
            left += imagesContainerWidth
            top += imagesContainerHeight;
            break;
    }

    left += 'px';
    top += 'px';

    newDiv.style.left = left;
    newDiv.style.width = width;
    newDiv.style.top = top;
    newDiv.style.height = height; 
    newDiv.style.backgroundColor = '#F3F3F3';

    newDiv.style.position = 'absolute';

    newDiv.innerHTML = `
        <img class="image" src="${image.url}" />
    `

    return newDiv;

}

Array.from(imagesContainer.querySelectorAll('.image-wrapper')).forEach(imageWrapper => {
    ["block2", "block3", "block4"].forEach(block => {
        imagesContainer.appendChild(returnNewDiv(imageData.filter(image => image.index === parseInt(imageWrapper.getAttribute('data-index')))[0], block))  
    })
})

let scrollX = 0;
let scrollY = 0;
let speedMultiplier  = 5;

const imagesContainerWrapper = document.querySelector('.images-container-wrapper')

let mouseIn = false;

imagesContainerWrapper.addEventListener('mouseleave', (e) => {
    mouseIn = false;
})

const contentWidth = imagesContainerWidth; // Width of the original content
const contentHeight = imagesContainerHeight; // Height of the original content

let translateX = -500; // Initial translateX position for horizontal scroll (off-screen to the left)
let translateY = -500; // Initial translateY position for vertical scroll (off-screen to the top)

let translateXStep = 0; // Horizontal movement step (positive or negative)
let translateYStep = 0; // Vertical movement step (positive or negative)


imagesContainerWrapper.addEventListener('mousemove', (e) => {

    mouseIn = true;

    const rect = imagesContainerWrapper.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    // Set scroll speed and reverse direction based on mouse position
    translateXStep = (mouseX < width * 0.3) ? speedMultiplier : (mouseX > width * 0.7) ? -speedMultiplier : 0;
    translateYStep = (mouseY < height * 0.3) ? speedMultiplier : (mouseY > height * 0.7) ? -speedMultiplier : 0;

});




function animateBothDirections() {
    // Update the horizontal position
    translateX += translateXStep;

    // Reset translateX if it goes beyond the right edge or if it reaches the left boundary
    if (translateX >= 0) {
        translateX = -contentWidth; // Reset to the left side
    } else if (translateX <= -contentWidth) {
        translateX = 0; // Reset to the right side
    }

    // Update the vertical position
    translateY += translateYStep;

    // Reset translateY if it goes beyond the bottom edge or if it reaches the top boundary
    if (translateY >= 0) {
        translateY = -contentHeight; // Reset to the top
    } else if (translateY <= -contentHeight) {
        translateY = 0; // Reset to the bottom
    }
    
    // Apply the transformation for both X and Y axes
    if(mouseIn) imagesContainer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;

    // Request the next frame
    requestAnimationFrame(animateBothDirections);
}

// Start the animation
animateBothDirections();




