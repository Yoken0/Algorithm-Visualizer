// Sorting Algorithms for Algorithm Visualizer
class SortingAlgorithms {
    constructor(audioSystem) {
        this.audioSystem = audioSystem;
    }

    // Delay utility
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Bubble Sort
    async bubbleSort(array, bars, isRunning, maxHeight, playMusicalSequence = true) {
        this.audioSystem.initAudioContext();
        let n = array.length;
        
        for (let i = 0; i < n - 1 && isRunning(); i++) {
            for (let j = 0; j < n - i - 1 && isRunning(); j++) {
                bars[j].classList.add('comparing');
                bars[j + 1].classList.add('comparing');
                
                this.audioSystem.playComparisonSound(array[j], array[j + 1], maxHeight);
                
                await this.delay(30);
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    [bars[j].style.height, bars[j+1].style.height] = [bars[j+1].style.height, bars[j].style.height];
                    
                    this.audioSystem.playSwapSound(array[j], maxHeight);
                    setTimeout(() => this.audioSystem.playSwapSound(array[j + 1], maxHeight), 40);
                }
                bars[j].classList.remove('comparing');
                bars[j + 1].classList.remove('comparing');
            }
            if (isRunning()) bars[n - 1 - i].classList.add('sorted');
        }
        if (isRunning() && n > 0) bars[0].classList.add('sorted');
        
        if (isRunning() && playMusicalSequence) {
            await this.delay(500);
            await this.audioSystem.playSortedSequence(array, bars, this.delay);
        }
    }

    // Quick Sort Partition
    async partition(array, bars, low, high, isRunning, maxHeight) {
        if (!isRunning()) return;
        this.audioSystem.initAudioContext();
        
        let pivot = array[high];
        let i = low - 1;
        
        bars[high].classList.add('pivot');
        for (let j = low; j < high; j++) {
            if (!isRunning()) return;
            bars[j].classList.add('comparing');
            
            this.audioSystem.playComparisonSound(array[j], pivot, maxHeight);
            
            await this.delay(50);
            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                [bars[i].style.height, bars[j].style.height] = [bars[j].style.height, bars[i].style.height];
                
                this.audioSystem.playSwapSound(array[i], maxHeight);
            }
            bars[j].classList.remove('comparing');
        }
        i++;
        [array[i], array[high]] = [array[high], array[i]];
        [bars[i].style.height, bars[high].style.height] = [bars[high].style.height, bars[i].style.height];
        
        this.audioSystem.playSwapSound(array[i], maxHeight);
        
        bars[high].classList.remove('pivot');
        bars[i].classList.add('sorted');
        return i;
    }

    // Quick Sort
    async quickSort(array, bars, low, high, isRunning, maxHeight, playMusicalSequence = true) {
        if (!isRunning() || low >= high) {
            if (low === high) bars[low]?.classList.add('sorted');
            return;
        }
        let pi = await this.partition(array, bars, low, high, isRunning, maxHeight);
        if (pi === undefined) return;
        await Promise.all([
            this.quickSort(array, bars, low, pi - 1, isRunning, maxHeight, playMusicalSequence),
            this.quickSort(array, bars, pi + 1, high, isRunning, maxHeight, playMusicalSequence)
        ]);
    }

    // Merge function for Merge Sort
    async merge(array, bars, low, mid, high, isRunning, maxHeight) {
        if (!isRunning()) return;
        this.audioSystem.initAudioContext();
        
        let n1 = mid - low + 1, n2 = high - mid;
        let L = array.slice(low, mid + 1);
        let R = array.slice(mid + 1, high + 1);
        let i = 0, j = 0, k = low;
        
        while (i < n1 && j < n2 && isRunning()) {
            bars[k].classList.add('comparing');
            
            this.audioSystem.playComparisonSound(L[i], R[j], maxHeight);
            
            await this.delay(30);
            if (L[i] <= R[j]) {
                array[k] = L[i];
                bars[k].style.height = `${L[i]}px`;
                
                this.audioSystem.playSwapSound(L[i], maxHeight);
                i++;
            } else {
                array[k] = R[j];
                bars[k].style.height = `${R[j]}px`;
                
                this.audioSystem.playSwapSound(R[j], maxHeight);
                j++;
            }
            bars[k].classList.remove('comparing');
            k++;
        }
        while (i < n1 && isRunning()) {
            array[k] = L[i];
            bars[k].style.height = `${L[i]}px`;
            
            this.audioSystem.playSwapSound(L[i], maxHeight);
            
            i++; k++;
            await this.delay(30);
        }
        while (j < n2 && isRunning()) {
            array[k] = R[j];
            bars[k].style.height = `${R[j]}px`;
            
            this.audioSystem.playSwapSound(R[j], maxHeight);
            
            j++; k++;
            await this.delay(30);
        }
    }

    // Merge Sort
    async mergeSort(array, bars, low, high, isRunning, maxHeight, playMusicalSequence = true) {
        if (!isRunning() || low >= high) return;
        let mid = Math.floor(low + (high - low) / 2);
        await this.mergeSort(array, bars, low, mid, isRunning, maxHeight, playMusicalSequence);
        await this.mergeSort(array, bars, mid + 1, high, isRunning, maxHeight, playMusicalSequence);
        await this.merge(array, bars, low, mid, high, isRunning, maxHeight);
        
        if (low === 0 && high === array.length - 1) {
            for(let i = 0; i < array.length; i++) {
                bars[i].classList.add('sorted');
            }
            
            if (isRunning() && playMusicalSequence) {
                await this.delay(500);
                await this.audioSystem.playSortedSequence(array, bars, this.delay);
            }
        }
    }
}
