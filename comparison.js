// Comparison System for Algorithm Visualizer
class ComparisonSystem {
    constructor(audioSystem, sortingAlgorithms) {
        this.audioSystem = audioSystem;
        this.sortingAlgorithms = sortingAlgorithms;
        this.isComparisonMode = false;
        this.comparisonAlgorithms = [];
        this.currentArrays = null;
        this.currentBars = null;
        this.isRunning1 = false;
        this.isRunning2 = false;
    }

    // Initialize comparison mode
    initComparisonMode() {
        this.isComparisonMode = true;
        this.audioSystem.setComparisonMode(true);
    }

    // Exit comparison mode
    exitComparisonMode() {
        this.isComparisonMode = false;
        this.audioSystem.setComparisonMode(false);
    }

    // Generate arrays for comparison mode
    generateComparisonArrays(arraySize) {
        console.log('Generating comparison arrays with size:', arraySize);
        
        // Create two identical arrays
        const array1 = this.generateRandomArray(arraySize);
        const array2 = [...array1]; // Copy for second algorithm
        
        // Create containers for side-by-side visualization
        const container1 = document.getElementById('comparison-container-1');
        const container2 = document.getElementById('comparison-container-2');
        
        // Clear containers
        container1.innerHTML = '';
        container2.innerHTML = '';
        
        // Create bars for both containers
        const bars1 = this.createBars(array1, container1);
        const bars2 = this.createBars(array2, container2);
        
        // Store arrays and bars for later use
        this.currentArrays = { array1, array2 };
        this.currentBars = { bars1, bars2 };
        
        return { array1, array2, bars1, bars2 };
    }

    // Run algorithms side by side
    async runSideBySideComparison(algorithms, arraySize) {
        console.log('Starting comparison with algorithms:', algorithms, 'arraySize:', arraySize);
        this.initComparisonMode();
        
        // Use stored arrays and bars, or generate new ones if not available
        let array1, array2, bars1, bars2;
        if (this.currentArrays && this.currentBars) {
            array1 = this.currentArrays.array1;
            array2 = this.currentArrays.array2;
            bars1 = this.currentBars.bars1;
            bars2 = this.currentBars.bars2;
        } else {
            const generated = this.generateComparisonArrays(arraySize);
            array1 = generated.array1;
            array2 = generated.array2;
            bars1 = generated.bars1;
            bars2 = generated.bars2;
        }
        
        const maxHeight1 = Math.max(...array1);
        const maxHeight2 = Math.max(...array2);
        
        // Set running state for both algorithms
        this.isRunning1 = true;
        this.isRunning2 = true;
        
        const isRunningFunc1 = () => this.isRunning1;
        const isRunningFunc2 = () => this.isRunning2;
        
        // Run algorithms simultaneously based on the two selected algorithms
        const promises = [];
        
        // Run first algorithm (no musical sequence in comparison mode)
        if (algorithms[0] === 'bubble-sort') {
            promises.push(this.sortingAlgorithms.bubbleSort(array1, bars1, isRunningFunc1, maxHeight1, false));
        } else if (algorithms[0] === 'quick-sort') {
            promises.push(this.sortingAlgorithms.quickSort(array1, bars1, 0, array1.length - 1, isRunningFunc1, maxHeight1, false));
        } else if (algorithms[0] === 'merge-sort') {
            promises.push(this.sortingAlgorithms.mergeSort(array1, bars1, 0, array1.length - 1, isRunningFunc1, maxHeight1, false));
        }
        
        // Run second algorithm (no musical sequence in comparison mode)
        if (algorithms[1] === 'bubble-sort') {
            promises.push(this.sortingAlgorithms.bubbleSort(array2, bars2, isRunningFunc2, maxHeight2, false));
        } else if (algorithms[1] === 'quick-sort') {
            promises.push(this.sortingAlgorithms.quickSort(array2, bars2, 0, array2.length - 1, isRunningFunc2, maxHeight2, false));
        } else if (algorithms[1] === 'merge-sort') {
            promises.push(this.sortingAlgorithms.mergeSort(array2, bars2, 0, array2.length - 1, isRunningFunc2, maxHeight2, false));
        }
        
        // Wait for all algorithms to complete
        console.log('Running', promises.length, 'algorithms simultaneously');
        await Promise.all(promises);
        console.log('All algorithms completed');
        
        // Mark remaining bars as sorted
        bars1.forEach(bar => bar.classList.add('sorted'));
        bars2.forEach(bar => bar.classList.add('sorted'));
    }

    // Generate random array
    generateRandomArray(size) {
        const array = [];
        const maxHeight = 400; // Max height for bars
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * maxHeight) + 20);
        }
        return array;
    }

    // Create bars in container
    createBars(array, container) {
        const bars = [];
        array.forEach(value => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${value}px`;
            container.appendChild(bar);
            bars.push(bar);
        });
        return bars;
    }

    // Stop running comparison algorithms
    stopComparison() {
        this.isRunning1 = false;
        this.isRunning2 = false;
    }

    // Reset comparison visualization
    resetComparison() {
        // Stop any running algorithms first
        this.stopComparison();
        
        const container1 = document.getElementById('comparison-container-1');
        const container2 = document.getElementById('comparison-container-2');
        
        if (container1) container1.innerHTML = '';
        if (container2) container2.innerHTML = '';
        
        // Clear stored arrays and bars
        this.currentArrays = null;
        this.currentBars = null;
    }
}
