// Binary Search Visualizer
class BinarySearchVisualizer extends AlgorithmVisualizer {
    async run() {
        if (!this.algorithmRunner) return;
        
        const target = prompt('Enter target value to search for:');
        if (!target || isNaN(target)) return;
        
        this.algorithmRunner.set_running(true);
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.messageArea.textContent = `Searching for ${target}...`;
        
        this.algorithmRunner.binary_search_reset();
        this.algorithmRunner.binary_search_start(parseInt(target));
        
        while (this.isRunning) {
            const result = this.algorithmRunner.binary_search_step();
            if (!result) break;
            
            const [array, left, right, mid] = result;
            this.updateBars(array, [left, right, mid]);
            await this.delay(500);
        }
        
        this.isRunning = false;
        this.startBtn.disabled = false;
    }
}
