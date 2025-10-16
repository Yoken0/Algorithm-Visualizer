// Merge Sort Visualizer
class MergeSortVisualizer extends AlgorithmVisualizer {
    async run() {
        if (!this.algorithmRunner) return;
        
        this.algorithmRunner.set_running(true);
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.messageArea.textContent = 'Running Merge Sort...';
        
        this.algorithmRunner.merge_sort_reset();
        this.algorithmRunner.merge_sort_start();
        
        while (this.isRunning) {
            const result = this.algorithmRunner.merge_sort_step();
            if (!result) break;
            
            const [array, low, mid, high] = result;
            this.updateBars(array);
            await this.delay(100);
        }
        
        if (this.isRunning) {
            this.messageArea.textContent = 'Merge Sort Complete!';
        }
        this.isRunning = false;
        this.startBtn.disabled = false;
    }
}
