// Base class for all algorithm visualizers
class AlgorithmVisualizer {
    constructor(algorithmRunner, messageArea, startBtn) {
        this.algorithmRunner = algorithmRunner;
        this.messageArea = messageArea;
        this.startBtn = startBtn;
        this.isRunning = false;
        this.animationId = null;
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateBars(array, comparing = [], sorted = [], pivot = -1) {
        const bars = document.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.classList.remove('comparing', 'sorted', 'pivot');
            if (comparing.includes(index)) bar.classList.add('comparing');
            if (sorted.includes(index)) bar.classList.add('sorted');
            if (index === pivot) bar.classList.add('pivot');
            bar.style.height = `${array[index]}px`;
        });
    }

    resetVisualizer() {
        this.isRunning = false;
        this.startBtn.textContent = 'Start';
        this.startBtn.disabled = false;
        this.messageArea.textContent = '';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        document.querySelectorAll('.node').forEach(node => node.classList.remove('visited', 'current'));
        document.querySelectorAll('.line').forEach(line => line.classList.remove('visited'));
        document.querySelectorAll('.bar').forEach(bar => bar.classList.remove('sorted', 'comparing', 'pivot'));
    }

    stopAlgorithm() {
        this.isRunning = false;
        if (this.algorithmRunner) {
            this.algorithmRunner.set_running(false);
        }
        this.resetVisualizer();
    }
}
