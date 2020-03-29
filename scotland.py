import json
import numpy as np

nodeData = []
adjMatrix = np.zeros([3,199,199],dtype = int)

def getData():
    with open('nodes.json') as json_file:
        data = json.load(json_file)
        for i in range(0,len(data)):
            thisNode = []
            thisNode.append(data[i]['number'])
            thisNode.append(data[i]['taxi'])
            thisNode.append(data[i]['bus'])
            thisNode.append(data[i]['underground'])
            nodeData.append(thisNode)

def makeAdjMatrix():
    global adjMatrix

    # taxi is [0][199x199]
    # bus is [1][199x199]
    # underground is [2][199x199]

    for i in range(len(nodeData)):
        src = i
        # taxi
        taxiList = nodeData[i][1]
        for j in range(len(taxiList)):
            dest = taxiList[j]
            adjMatrix[0][src][dest-1] = 1
            adjMatrix[0][dest-1][src] = 1

        # bus
        busList = nodeData[i][2]
        for j in range(len(busList)):
            dest = busList[j]
            adjMatrix[1][src][dest-1] = 1
            adjMatrix[1][dest-1][src] = 1

        # underground
        undergroundList = nodeData[i][3]
        for j in range(len(undergroundList)):
            dest = undergroundList[j]
            adjMatrix[2][src][dest-1] = 1
            adjMatrix[2][dest-1][src] = 1

def getPossibleLocations(pos, travel, iterNum):
    possibleLocations = set()
    travelMode = travel[0]
    msgText = ""
    if(travelMode=='t'):
            msgText = str(iterNum) + ". Taxi "
    if(travelMode=='b'):
        msgText = str(iterNum) + ". Bus "
    if(travelMode=='u'):
        msgText = str(iterNum) + ". Underground  "
    travel = travel[1:]

    for i in range(len(pos)):
        src = pos[i]
        if(travelMode=='t'):
            dest = {i for i, x in enumerate(adjMatrix[0][src]) if x==1}
            possibleLocations = possibleLocations.union(dest)
        if(travelMode=='b'):
            dest = {i for i, x in enumerate(adjMatrix[1][src]) if x==1}
            possibleLocations = possibleLocations.union(dest)
        if(travelMode=='u'):
            dest = {i for i, x in enumerate(adjMatrix[2][src]) if x==1}
            possibleLocations = possibleLocations.union(dest)

    possibleLocations = list(possibleLocations)
    print(msgText,"--->",[(loc+1) for loc in possibleLocations])
    if(len(travel)>0):
        iterNum+=1
        possibleLocations = getPossibleLocations(possibleLocations, travel, iterNum)
    return possibleLocations


def main():
    getData()
    makeAdjMatrix()
    userInput = input("Enter last known position and travel : \n")
    userInput = userInput.split(' ')
    print
    lastPos = int(userInput[0])
    print("\nLast known position : ",lastPos)
    print("Travel : ",userInput[1]+"\n")
    lastPosList = [lastPos-1]
    travelHistory = userInput[1]
    possibleLocs = getPossibleLocations(lastPosList, travelHistory, 1)
    print("\nMr X possible Locations : ",[(loc+1) for loc in possibleLocs])

main()