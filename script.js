document.addEventListener('DOMContentLoaded', () => {
    const algorithmTypeSelect = document.getElementById('algorithm-type');
    const algorithmSelect = document.getElementById('algorithm-select');
    const dynamicControlsDiv = document.getElementById('dynamic-controls');
    const arrayContainer = document.getElementById('array-container');
    const treeContainer = document.getElementById('tree-container');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const messageArea = document.getElementById('message-area');

    let algorithmRunner = null;
    let graphSearcher = null;
    let arraySize = 50;
    let nodePositions = {};
    let lineElements = {};
    let currentVisualizer = null;

    // Tree data for search algorithms
    const treeData = {
        id: 'A',
        children: [
            { id: 'B', children: [{ id: 'D' }, { id: 'E' }] },
            { id: 'C', children: [{ id: 'F' }, { id: 'G' }] }
        ]
    };

    // Wait for WASM to be loaded
    function waitForWasm() {
        return new Promise((resolve) => {
            const checkWasm = () => {
                if (window.AlgorithmRunner && window.GraphSearcher) {
                    algorithmRunner = new window.AlgorithmRunner();
                    graphSearcher = new window.GraphSearcher();
                    resolve();
                } else {
                    setTimeout(checkWasm, 100);
                }
            };
            checkWasm();
        });
    }

    // --- UI State Management ---
    function renderUI() {
        const type = algorithmTypeSelect.value;
        algorithmSelect.innerHTML = '';
        dynamicControlsDiv.innerHTML = '';
        messageArea.textContent = '';

        if (type === 'sorting') {
            arrayContainer.style.display = 'flex';
            treeContainer.style.display = 'none';
            
            ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Binary Search', 'Linear Search'].forEach(algo => {
                const option = document.createElement('option');
                option.value = algo.toLowerCase().replace(' ', '-');
                option.textContent = algo;
                algorithmSelect.appendChild(option);
            });

            dynamicControlsDiv.innerHTML = `
                <div class="flex items-center space-x-2">
                    <label for="array-size" class="text-[#bac2de]">Array Size:</label>
                    <input type="range" id="array-size" min="10" max="150" value="${arraySize}" class="w-24 md:w-40">
                    <span id="array-size-value" class="text-[#bac2de]">${arraySize}</span>
                </div>
                <button id="generate-btn" class="btn-primary">New Array</button>
            `;

            document.getElementById('array-size').addEventListener('input', (e) => {
                arraySize = parseInt(e.target.value, 10);
                document.getElementById('array-size-value').textContent = arraySize;
                generateArray();
            });
            
            document.getElementById('generate-btn').addEventListener('click', () => {
                generateArray();
            });
            
            generateArray();

        } else if (type === 'searching') {
            arrayContainer.style.display = 'none';
            treeContainer.style.display = 'block';

            ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)'].forEach(algo => {
                const option = document.createElement('option');
                option.value = algo.split('(')[0].trim().toLowerCase().replace('-first', '');
                option.textContent = algo;
                algorithmSelect.appendChild(option);
            });

            dynamicControlsDiv.innerHTML = `
                <div class="flex items-center space-x-2">
                    <label for="target-node" class="text-[#bac2de]">Target Node:</label>
                    <input type="text" id="target-node" class="bg-[#181825] text-[#cdd6f4] border-2 border-[#cba6f7] rounded-full py-2 px-4 w-28" placeholder="e.g., G" maxlength="1">
                </div>
            `;
            
            // Clear containers and state before rendering to prevent duplicates
            treeContainer.innerHTML = '';
            nodePositions = {};
            lineElements = {};
            renderTree(treeData, treeContainer.offsetWidth / 2 - 20, 50, 0);
            setupGraphSearcher();
        }
    }

    function setupGraphSearcher() {
        if (!graphSearcher) return;
        
        graphSearcher.reset();
        // Add edges based on tree structure
        graphSearcher.add_edge('A', 'B');
        graphSearcher.add_edge('A', 'C');
        graphSearcher.add_edge('B', 'D');
        graphSearcher.add_edge('B', 'E');
        graphSearcher.add_edge('C', 'F');
        graphSearcher.add_edge('C', 'G');
    }

    function resetVisualizer() {
        startBtn.textContent = 'Start';
        startBtn.disabled = false;
        messageArea.textContent = '';
        
        document.querySelectorAll('.node').forEach(node => node.classList.remove('visited', 'current'));
        document.querySelectorAll('.line').forEach(line => line.classList.remove('visited'));
        document.querySelectorAll('.bar').forEach(bar => bar.classList.remove('sorted', 'comparing', 'pivot'));
    }

    // --- Sorting Functions ---
    function generateArray() {
        if (!algorithmRunner) return;
        
        arrayContainer.innerHTML = '';
        algorithmRunner.generate_array(arraySize);
        const array = algorithmRunner.get_array();
        
        array.forEach(value => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${value}px`;
            arrayContainer.appendChild(bar);
        });
        resetVisualizer();
    }

    // --- Search Functions ---
    function drawLine(parentPos, childPos, parentId, childId) {
        const line = document.createElement('div');
        line.classList.add('line');
        const dx = childPos.x - parentPos.x;
        const dy = childPos.y - parentPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        line.style.width = `${dist}px`;
        line.style.left = `${parentPos.x}px`;
        line.style.top = `${parentPos.y}px`;
        line.style.transformOrigin = '0 0';
        line.style.transform = `rotate(${angle}deg)`;
        
        treeContainer.appendChild(line);
        lineElements[`${parentId}-${childId}`] = line;
    }

    function renderTree(node, x, y, level = 0, parent = null) {
        const nodeElement = document.createElement('div');
        nodeElement.classList.add('node');
        nodeElement.textContent = node.id;
        nodeElement.style.left = `${x}px`;
        nodeElement.style.top = `${y}px`;
        nodeElement.dataset.id = node.id;
        treeContainer.appendChild(nodeElement);

        nodePositions[node.id] = { x: x + 20, y: y + 20, element: nodeElement };

        if (parent) {
            const parentPos = nodePositions[parent.id];
            drawLine(parentPos, nodePositions[node.id], parent.id, node.id);
        }

        if (node.children) {
            const numChildren = node.children.length;
            const horizontalSpread = 200 / (level + 1);
            const startX = x - ((numChildren - 1) * horizontalSpread / 2);
            node.children.forEach((child, index) => {
                const childX = startX + (index * horizontalSpread);
                const childY = y + 100;
                renderTree(child, childX, childY, level + 1, node);
            });
        }
    }

    // Algorithm factory
    function createVisualizer(algorithmType) {
        switch(algorithmType) {
            case 'bubble-sort':
                return new BubbleSortVisualizer(algorithmRunner, messageArea, startBtn);
            case 'quick-sort':
                return new QuickSortVisualizer(algorithmRunner, messageArea, startBtn);
            case 'merge-sort':
                return new MergeSortVisualizer(algorithmRunner, messageArea, startBtn);
            case 'binary-search':
                return new BinarySearchVisualizer(algorithmRunner, messageArea, startBtn);
            case 'linear-search':
                return new LinearSearchVisualizer(algorithmRunner, messageArea, startBtn);
            case 'breadth search':
                return new BFSVisualizer(graphSearcher, messageArea, startBtn, nodePositions, lineElements);
            case 'depth search':
                return new DFSVisualizer(graphSearcher, messageArea, startBtn, nodePositions, lineElements);
            default:
                return null;
        }
    }
    
    // --- Event Listeners ---
    algorithmTypeSelect.addEventListener('change', () => {
        if (currentVisualizer) {
            currentVisualizer.stopAlgorithm();
        }
        renderUI();
    });
    
    startBtn.addEventListener('click', async () => {
        const type = algorithmTypeSelect.value;
        const selectedAlgorithm = algorithmSelect.value;
        
        resetVisualizer();
        
        currentVisualizer = createVisualizer(selectedAlgorithm);
        if (currentVisualizer) {
            await currentVisualizer.run();
        }
    });

    resetBtn.addEventListener('click', () => {
        if (currentVisualizer) {
            currentVisualizer.stopAlgorithm();
        }
        if(algorithmTypeSelect.value === 'sorting') {
            generateArray();
        } else {
            renderUI();
        }
    });
    
    // Initialize after WASM is loaded
    waitForWasm().then(() => {
        renderUI();
    });
});