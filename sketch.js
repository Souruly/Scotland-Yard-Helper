let mapImage;
let mapImageW = 5135;
let mapImageH = 3857;
let showMap = true;
let nodesVisible = true;
let taxisVisible = true;
let bussesVisible = true;
let undergroundVisible = true;

let nodeNum = 1;
let nodesJSON = []
let nodes = []
let taxis = []
let busses = []
let undergrounds = []
let startPointSet = false;
let startNodeIndex = null;
let endPointSet = false;
let endNodeIndex = null;
let thisTransport;
let downloadButton;

function preload() {
    mapImage = loadImage('map.jpg')
    nodesJSON = loadJSON('nodes-view.json')
}

function setup() {
    createCanvas(mapImageW, mapImageH);
    textAlign(CENTER, CENTER);
    downloadButton = createButton('Download Nodes List');
    downloadButton.mousePressed(downloadNodesJSON);
    let zeroArray = [];
    for (let i = 0; i < 199; i++) {
        nodes.push(nodesJSON[i]);
        zeroArray.push(0);
    }
    for (let i = 0; i < 199; i++) {
        taxis.push(zeroArray.slice());
        busses.push(zeroArray.slice());
        undergrounds.push(zeroArray.slice());
    }

    for (let i = 0; i < 199; i++) {
        for (let j = 0; j < nodes[i].taxi.length; j++) {
            taxis[i][nodes[i].taxi[j]-1] = 1;
            console.log(i,nodes[i].taxi[j]);
        }
        for (let j = 0; j < nodes[i].bus.length; j++) {
            busses[i][nodes[i].bus[j]-1] = 1;
            console.log(i,nodes[i].bus[j]);
        }
        for (let j = 0; j < nodes[i].underground.length; j++) {
            undergrounds[i][nodes[i].underground[j]-1] = 1;
            console.log(i,nodes[i].underground[j]);
        }
    }
}

function draw() {
    background(51);
    if (showMap) {
        image(mapImage, 0, 0);
    }
    noFill();
    stroke(0);
    strokeWeight(6);
    ellipse(mouseX, mouseY, 70, 70);
    if(taxisVisible)
    {
        stroke(255);
        showTaxis();
    }
    if(bussesVisible)
    {
        stroke(0,102,204);
        showBusses();
    }
    if(undergroundVisible)
    {
        stroke(255,0,0);
        showUndergroundRails()
    }
    if (nodesVisible) {
        //   stroke(0);
        strokeWeight(5);
        showNodes();
    }
}

function mouseClicked() {
    if (keyIsPressed === true) {
        if (key == 'n') {
            console.log("N pressed")
            let n = new Node(nodeNum, mouseX, mouseY);
            nodes.push(n);
            nodeNum++;
        }
        if (key == 't') {
            if (startPointSet == false) {
                startPointSet = true;
                let nnIndex = findNearestNodeIndex(mouseX, mouseY);
                console.log("Taxi started at" + (nodes[nnIndex].number));
                thisTransport = new TaxiTransport();
                thisTransport.startNode = nodes[nnIndex];
                startNodeIndex = nnIndex;
            }
            else {
                endPointSet = true;
                nnIndex = findNearestNodeIndex(mouseX, mouseY);
                console.log("Taxi ended at" + (nodes[nnIndex].number));
                thisTransport.endNode = nodes[nnIndex];
                taxis.push(thisTransport);
                endNodeIndex = nnIndex;
                setTransport("taxi", startNodeIndex, endNodeIndex);
                startPointSet = false;
                endPointSet = false;
                startNodeIndex = null;
                endNodeIndex = null;
            }
        }
        if (key == 'b') {
            if (startPointSet == false) {
                startPointSet = true;
                let nnIndex = findNearestNodeIndex(mouseX, mouseY);
                console.log("Bus started at" + (nodes[nnIndex].number));
                thisTransport = new BusTransport();
                thisTransport.startNode = nodes[nnIndex];
                startNodeIndex = nnIndex;
            }
            else {
                endPointSet = true;
                nnIndex = findNearestNodeIndex(mouseX, mouseY);
                console.log("Bus ended at" + (nodes[nnIndex].number));
                thisTransport.endNode = nodes[nnIndex];
                busses.push(thisTransport);
                endNodeIndex = nnIndex;
                setTransport("bus", startNodeIndex, endNodeIndex);
                startPointSet = false;
                endPointSet = false;
                startNodeIndex = null;
                endNodeIndex = null;
            }
        }
        if (key == 'u') {
            if (startPointSet == false) {
                startPointSet = true;
                let nnIndex = findNearestNodeIndex(mouseX, mouseY);
                console.log("Underground Rail started at" + (nodes[nnIndex].number));
                thisTransport = new UndergroundTransport();
                thisTransport.startNode = nodes[nnIndex];
                startNodeIndex = nnIndex;
            }
            else {
                endPointSet = true;
                nnIndex = findNearestNodeIndex(mouseX, mouseY);
                console.log("Underground Rail ended at" + (nodes[nnIndex].number));
                thisTransport.endNode = nodes[nnIndex];
                undergrounds.push(thisTransport);
                endNodeIndex = nnIndex;
                setTransport("underground", startNodeIndex, endNodeIndex);
                startPointSet = false;
                endPointSet = false;
                startNodeIndex = null;
                endNodeIndex = null;
            }
        }
    }
}

function showNodes() {
    for (let i = 0; i < nodes.length; i++) {
        let n = nodes[i];
        fill(255);
        stroke(255);
        strokeWeight(10);
        ellipse(n.x, n.y, n.r, n.r);
        stroke(0);
        strokeWeight(6);
        ellipse(n.x, n.y, n.r, n.r);
        strokeWeight(2);
        if (n.bus.length == 0) {
            noFill();
        }
        else {
            fill(0, 0, 255);
        }
        arc(n.x, n.y, n.r, n.r, 0, -PI);
        if (n.underground.length == 0) {
            noFill();
        }
        else {
            fill(255, 0, 0);
        }
        rect(n.x - n.w / 2, n.y - n.h / 2, n.w, n.h);
        noStroke();
        fill(0);
        textSize(32);
        text(n.number, n.x, n.y);
    }

}

function showTaxis() {
    for (let i = 0; i < taxis.length; i++) {
        for (let j = 0; j < 199; j++) {
            if (taxis[i][j] == 1) {
                line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y)
            }
        }
    }
}

function showBusses() {
    for (let i = 0; i < busses.length; i++) {
        for (let j = 0; j < 199; j++) {
            if (busses[i][j] == 1) {
                line(nodes[i].x, nodes[i].y+9, nodes[j].x, nodes[j].y+9)
            }
        }
    }
}

function showUndergroundRails() {
    for (let i = 0; i < undergrounds.length; i++) {
        for (let j = 0; j < 199; j++) {
            if (undergrounds[i][j] == 1) {
                line(nodes[i].x, nodes[i].y-9, nodes[j].x, nodes[j].y-9)
            }
        }
    }
}

function findNearestNodeIndex(mX, mY) {
    let minDist = 100;
    let minIndex = -1;
    for (let i = 0; i < nodes.length; i++) {
        let d = dist(mX, mY, nodes[i].x, nodes[i].y);
        if (d < minDist) {
            minDist = d;
            nnIndex = i;
            if (d < 50) {
                return i;
            }
        }
    }
    return minIndex;
}

function setTransport(transportType, sI, eI) {
    if (transportType == "taxi") {
        if (!nodes[sI].taxi.includes(nodes[eI].number)) {
            nodes[sI].taxi.push(nodes[eI].number);
            taxis[sI][eI] = 1;
            taxis[eI][sI] = 1;
        }
        if (!nodes[eI].taxi.includes(nodes[sI].number)) {
            nodes[eI].taxi.push(nodes[sI].number);
            taxis[sI][eI] = 1;
            taxis[eI][sI] = 1;
        }
    }
    if (transportType == "bus") {
        if (!nodes[sI].bus.includes(nodes[eI].number)) {
            nodes[sI].bus.push(nodes[eI].number);
            busses[sI][eI] = 1;
            busses[eI][sI] = 1;
        }
        if (!nodes[eI].bus.includes(nodes[sI].number)) {
            nodes[eI].bus.push(nodes[sI].number);
            busses[sI][eI] = 1;
            busses[eI][sI] = 1;
        }
    }
    if (transportType == "underground") {
        if (!nodes[sI].underground.includes(nodes[eI].number)) {
            nodes[sI].underground.push(nodes[eI].number);
            undergrounds[sI][eI] = 1;
            undergrounds[eI][sI] = 1;
        }
        if (!nodes[eI].underground.includes(nodes[sI].number)) {
            nodes[eI].underground.push(nodes[sI].number);
            undergrounds[sI][eI] = 1;
            undergrounds[eI][sI] = 1;
        }
    }
}

function keyTyped() {
    if (key == 'm') {
        showMap = !showMap;
    }
    if (key == 'l') {
        nodesVisible = !nodesVisible;
    }
    if (key == 'q') {
        taxisVisible = !taxisVisible;
    }
    if (key == 'w') {
        bussesVisible = !bussesVisible;
    }
    if (key == 'e') {
        undergroundVisible = !undergroundVisible;
    }
    if (key == 'd') {
        nodes.pop();
        nodeNum--;
    }
}

function downloadNodesJSON() {
    let nodesListString = JSON.stringify(nodes);
    console.log(nodesListString);
    copyTextToClipboard(nodesListString);

}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}