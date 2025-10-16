// Bubble Sort Visualizer
class BubbleSortVisualizer extends AlgorithmVisualizer {
    async run() {
        if (!this.algorithmRunner) return;
        
        this.algorithmRunner.set_running(true);
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.messageArea.textContent = 'Running Bubble Sort...';
        
        this.algorithmRunner.bubble_sort_reset();
        
        while (this.isRunning) {
            const result = this.algorithmRunner.bubble_sort_step();
            if (!result) break;
            
            const array = result;
            this.updateBars(array);
            await this.delay(50);
        }
        
        if (this.isRunning) {
            this.messageArea.textContent = 'Bubble Sort Complete!';
        }
        this.isRunning = false;
        this.startBtn.disabled = false;
    }
}
