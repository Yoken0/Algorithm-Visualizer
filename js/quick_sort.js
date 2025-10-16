// Quick Sort Visualizer
class QuickSortVisualizer extends AlgorithmVisualizer {
    async run() {
        if (!this.algorithmRunner) return;
        
        this.algorithmRunner.set_running(true);
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.messageArea.textContent = 'Running Quick Sort...';
        
        this.algorithmRunner.quick_sort_reset();
        this.algorithmRunner.quick_sort_start();
        
        while (this.isRunning) {
            const result = this.algorithmRunner.quick_sort_step();
            if (!result) break;
            
            const [array, low, high, pivot] = result;
            this.updateBars(array, [], [pivot], pivot);
            await this.delay(100);
        }
        
        if (this.isRunning) {
            this.messageArea.textContent = 'Quick Sort Complete!';
        }
        this.isRunning = false;
        this.startBtn.disabled = false;
    }
}
