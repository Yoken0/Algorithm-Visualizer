// DFS Visualizer
class DFSVisualizer extends AlgorithmVisualizer {
    constructor(algorithmRunner, messageArea, startBtn, nodePositions, lineElements) {
        super(algorithmRunner, messageArea, startBtn);
        this.nodePositions = nodePositions;
        this.lineElements = lineElements;
    }

    async run() {
        if (!this.algorithmRunner) return;
        
        const targetNodeInput = document.getElementById('target-node');
        const targetNode = targetNodeInput.value.toUpperCase();
        if (!targetNode) {
            this.messageArea.textContent = 'Please enter a target node.';
            return;
        }
        
        this.algorithmRunner.reset();
        this.algorithmRunner.dfs_start('A');
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.messageArea.textContent = `Searching for ${targetNode}...`;
        
        while (this.isRunning) {
            const result = this.algorithmRunner.dfs_step(targetNode);
            if (!result) break;
            
            const [currentNode, found] = result;
            const currentNodeElement = this.nodePositions[currentNode]?.element;
            
            if (currentNodeElement) {
                currentNodeElement.classList.add('current');
                await this.delay(500);
                
                if (found) {
                    this.messageArea.textContent = `Found ${targetNode}!`;
                    break;
                }
                
                currentNodeElement.classList.remove('current');
                currentNodeElement.classList.add('visited');
            }
            
            await this.delay(300);
        }
        
        if (!this.isRunning) {
            this.messageArea.textContent = 'Target not found.';
        }
        this.isRunning = false;
        this.startBtn.disabled = false;
    }
}
