// Linear Search Visualizer
class LinearSearchVisualizer extends AlgorithmVisualizer {
    async run() {
        if (!this.algorithmRunner) return;
        
        const target = prompt('Enter target value to search for:');
        if (!target || isNaN(target)) return;
        
        this.algorithmRunner.set_running(true);
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.messageArea.textContent = `Searching for ${target}...`;
        
        this.algorithmRunner.linear_search_reset();
        this.algorithmRunner.linear_search_start(parseInt(target));
        
        while (this.isRunning) {
            const result = this.algorithmRunner.linear_search_step();
            if (!result) break;
            
            const [array, index] = result;
            this.updateBars(array, [index]);
            await this.delay(300);
        }
        
        this.isRunning = false;
        this.startBtn.disabled = false;
    }
}
