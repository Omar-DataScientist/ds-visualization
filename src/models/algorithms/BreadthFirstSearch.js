import PathfindingAlgorithm from "./PathfindingAlgorithm";

class BreadthFirstSearch extends PathfindingAlgorithm {
    constructor() {
        super();
        this.queue = [];
    }

    start(startNode, endNode) {
        super.start(startNode, endNode);
        this.queue = [this.startNode];
        this.startNode.distanceFromStart = 0;
    }

    nextStep() {
        if (this.queue.length === 0) {
            this.finished = true;
            return [];
        }

        const updatedNodes = [];
        const currentNode = this.queue.shift();
        currentNode.visited = true;
        const refEdge = currentNode.edges.find(e => e.getOtherNode(currentNode) === currentNode.referer);
        if (refEdge) refEdge.visited = true;

        // Found end node
        if (currentNode.id === this.endNode.id) {
            this.queue = [];
            this.finished = true;
            return [currentNode];
        }

        for (const n of currentNode.neighbors) {
            const neighbor = n.node;
            const edge = n.edge;

            // Fill edges that are not marked on the map
            if (neighbor.visited && !edge.visited) {
                edge.visited = true;
                neighbor.referer = currentNode;
                updatedNodes.push(neighbor);
            }

            if (neighbor.visited) continue;

            if (!this.queue.includes(neighbor)) {
                this.queue.push(neighbor);
                neighbor.parent = currentNode;
                neighbor.referer = currentNode;
                neighbor.distanceFromStart = (currentNode.distanceFromStart || 0) + 1;
            }
        }

        return [...updatedNodes, currentNode];
    }
}

export default BreadthFirstSearch;
