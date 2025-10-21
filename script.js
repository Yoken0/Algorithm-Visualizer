// Main Application for Algorithm Visualizer
document.addEventListener('DOMContentLoaded', () => {
    // Initialize systems
    const audioSystem = new AudioSystem();
    const sortingAlgorithms = new SortingAlgorithms(audioSystem);
    const comparisonSystem = new ComparisonSystem(audioSystem, sortingAlgorithms);

    // DOM elements
    const algorithmTypeSelect = document.getElementById('algorithm-type');
    const algorithmSelect = document.getElementById('algorithm-select');
    const dynamicControlsDiv = document.getElementById('dynamic-controls');
    const arrayContainer = document.getElementById('array-container');
    const treeContainer = document.getElementById('tree-container');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const messageArea = document.getElementById('message-area');
    const visualizationContainer = document.getElementById('visualization-container');
    const comparisonMode = document.getElementById('comparison-mode');
    const comparisonControls = document.getElementById('comparison-controls');
    const algorithmComparisonCheckbox = document.getElementById('algorithm-comparison');
    const comparisonAlgorithm1 = document.getElementById('comparison-algorithm-1');
    const comparisonAlgorithm2 = document.getElementById('comparison-algorithm-2');
    const startComparisonBtn = document.getElementById('start-comparison-btn');
    const resetComparisonBtn = document.getElementById('reset-comparison-btn');
    const volumeControl = document.getElementById('volume-control');
    const muteBtn = document.getElementById('mute-btn');
    
    // Single algorithm control elements
    const singleAlgorithmControls = document.getElementById('single-algorithm-controls');
    const singleAlgorithmSelect = document.getElementById('single-algorithm-select');
    const singleAlgorithmButtons = document.getElementById('single-algorithm-buttons');
    const volumeControls = document.getElementById('volume-controls');

    // Application state
    let isRunning = false;
    let array = [];
    let arraySize = 50;
    let nodePositions = {};
    let lineElements = {};

    // Tree data for search algorithms
    const treeData = {
        id: 'A',
        children: [
            { id: 'B', children: [{ id: 'D' }, { id: 'E' }] },
            { id: 'C', children: [{ id: 'F' }, { id: 'G' }] }
        ]
    };

    // Weighted graph data for Dijkstra's algorithm
    const dijkstraGraphData = {
        nodes: [
            { id: 'A', x: 400, y: 100 },
            { id: 'B', x: 250, y: 200 },
            { id: 'C', x: 550, y: 200 },
            { id: 'D', x: 150, y: 300 },
            { id: 'E', x: 350, y: 300 },
            { id: 'F', x: 550, y: 300 },
            { id: 'G', x: 750, y: 300 }
        ],
        edges: [
            { from: 'A', to: 'B', weight: 4 },
            { from: 'A', to: 'C', weight: 2 },
            { from: 'B', to: 'D', weight: 1 },
            { from: 'B', to: 'E', weight: 5 },
            { from: 'C', to: 'E', weight: 8 },
            { from: 'C', to: 'F', weight: 10 },
            { from: 'D', to: 'E', weight: 3 },
            { from: 'E', to: 'F', weight: 2 },
            { from: 'F', to: 'G', weight: 6 }
        ]
    };

    // --- UI State Management ---
    function renderUI() {
        const type = algorithmTypeSelect.value;
        algorithmSelect.innerHTML = '';
        dynamicControlsDiv.innerHTML = '';
        messageArea.textContent = '';

        if (type === 'sorting') {
            arrayContainer.style.display = 'flex';
            treeContainer.style.display = 'none';
            
            ['Bubble Sort', 'Quick Sort', 'Merge Sort'].forEach(algo => {
                const option = document.createElement('option');
                option.value = algo.toLowerCase().replace(' ', '-');
                option.textContent = algo;
                algorithmSelect.appendChild(option);
            });

            dynamicControlsDiv.innerHTML = `
                <div class="flex items-center space-x-2">
                    <label for="array-size" class="text-gray-300">Array Size:</label>
                    <input type="range" id="array-size" min="10" max="150" value="${arraySize}" class="w-24 md:w-40">
                    <span id="array-size-value" class="text-gray-300">${arraySize}</span>
                </div>
                <button id="generate-btn" class="btn-primary">New Array</button>
            `;

            document.getElementById('array-size').addEventListener('input', (e) => {
                arraySize = parseInt(e.target.value, 10);
                document.getElementById('array-size-value').textContent = arraySize;
                if (!isRunning) {
                    generateArray();
                    // If in comparison mode, also regenerate comparison arrays
                    if (algorithmComparisonCheckbox.checked) {
                        comparisonSystem.generateComparisonArrays(arraySize);
                    }
                }
            });
            
            document.getElementById('generate-btn').addEventListener('click', () => {
                if (isRunning) isRunning = false;
                generateArray();
                // If in comparison mode, also regenerate comparison arrays
                if (algorithmComparisonCheckbox.checked) {
                    comparisonSystem.generateComparisonArrays(arraySize);
                }
            });
            
            generateArray();

        } else if (type === 'searching') {
            ['Dijkstra Algorithm', 'Breadth-First Search (BFS)', 'Depth-First Search (DFS)'].forEach(algo => {
                const option = document.createElement('option');
                if (algo.includes('Dijkstra')) {
                    option.value = 'dijkstra';
                } else {
                    option.value = algo.split('(')[0].trim().toLowerCase().replace('-first', '');
                }
                option.textContent = algo;
                algorithmSelect.appendChild(option);
            });

            updateSearchControls();
        }
    }

    function updateSearchControls() {
        const selectedAlgorithm = algorithmSelect.value;
        
        if (selectedAlgorithm === 'dijkstra') {
            arrayContainer.style.display = 'none';
            treeContainer.style.display = 'block';
            
            dynamicControlsDiv.innerHTML = `
                <div class="flex items-center space-x-2">
                    <label for="start-node" class="text-gray-300">Start Node:</label>
                    <input type="text" id="start-node" class="bg-[#2d2d46] text-white border-2 border-orange-600 rounded-full py-2 px-4 w-28" placeholder="e.g., A" maxlength="1" value="A">
                </div>
                <div class="flex items-center space-x-2">
                    <label for="target-node" class="text-gray-300">Target Node:</label>
                    <input type="text" id="target-node" class="bg-[#2d2d46] text-white border-2 border-orange-600 rounded-full py-2 px-4 w-28" placeholder="e.g., G" maxlength="1">
                </div>
            `;
            
            treeContainer.innerHTML = '';
            nodePositions = {};
            lineElements = {};
            renderWeightedGraph(dijkstraGraphData, 0, 0, 0);
        } else {
            arrayContainer.style.display = 'none';
            treeContainer.style.display = 'block';
            
            dynamicControlsDiv.innerHTML = `
                <div class="flex items-center space-x-2">
                    <label for="target-node" class="text-gray-300">Target Node:</label>
                    <input type="text" id="target-node" class="bg-[#2d2d46] text-white border-2 border-orange-600 rounded-full py-2 px-4 w-28" placeholder="e.g., G" maxlength="1">
                </div>
            `;
            
            treeContainer.innerHTML = '';
            nodePositions = {};
            lineElements = {};
            renderTree(treeData, treeContainer.offsetWidth / 2 - 20, 50, 0);
        }
    }

    function resetVisualizer() {
        isRunning = false;
        startBtn.textContent = 'Start';
        startBtn.disabled = false;
        messageArea.textContent = '';
        
        document.querySelectorAll('.node').forEach(node => node.classList.remove('visited', 'current'));
        document.querySelectorAll('.line').forEach(line => line.classList.remove('visited'));
        document.querySelectorAll('.bar').forEach(bar => bar.classList.remove('sorted', 'comparing', 'pivot', 'found', 'searching', 'visited', 'search-target'));
    }

    // --- Sorting Functions ---
    function generateArray() {
        arrayContainer.innerHTML = '';
        array = [];
        for (let i = 0; i < arraySize; i++) {
            const value = Math.floor(Math.random() * (arrayContainer.offsetHeight * 0.9)) + 20;
            array.push(value);
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${value}px`;
            arrayContainer.appendChild(bar);
        }
        resetVisualizer();
    }

    // --- Search Functions (keeping existing search functionality) ---
    function renderWeightedGraph(graphData, startX, startY, level = 0) {
        treeContainer.innerHTML = '';
        nodePositions = {};
        lineElements = {};
        
        graphData.nodes.forEach(node => {
            const nodeElement = document.createElement('div');
            nodeElement.classList.add('node');
            nodeElement.textContent = node.id;
            nodeElement.style.left = `${node.x}px`;
            nodeElement.style.top = `${node.y}px`;
            nodeElement.dataset.id = node.id;
            treeContainer.appendChild(nodeElement);
            
            nodePositions[node.id] = { x: node.x + 20, y: node.y + 20, element: nodeElement };
        });
        
        graphData.edges.forEach(edge => {
            const fromPos = nodePositions[edge.from];
            const toPos = nodePositions[edge.to];
            
            if (fromPos && toPos) {
                const line = document.createElement('div');
                line.classList.add('line');
                const dx = toPos.x - fromPos.x;
                const dy = toPos.y - fromPos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                
                line.style.width = `${dist}px`;
                line.style.left = `${fromPos.x}px`;
                line.style.top = `${fromPos.y}px`;
                line.style.transformOrigin = '0 0';
                line.style.transform = `rotate(${angle}deg)`;
                
                treeContainer.appendChild(line);
                lineElements[`${edge.from}-${edge.to}`] = line;
                
                const weightLabel = document.createElement('div');
                weightLabel.classList.add('weight-label');
                weightLabel.textContent = edge.weight;
                weightLabel.style.left = `${(fromPos.x + toPos.x) / 2}px`;
                weightLabel.style.top = `${(fromPos.y + toPos.y) / 2 - 10}px`;
                treeContainer.appendChild(weightLabel);
            }
        });
    }

    // Keep existing search algorithms (BFS, DFS, Dijkstra) - simplified for brevity
    async function dijkstra(startNodeId, targetNodeId) {
        // Implementation remains the same as before
        const distances = {};
        const previous = {};
        const unvisited = new Set();
        
        dijkstraGraphData.nodes.forEach(node => {
            distances[node.id] = node.id === startNodeId ? 0 : Infinity;
            previous[node.id] = null;
            unvisited.add(node.id);
        });
        
        const currentNodeElement = nodePositions[startNodeId].element;
        currentNodeElement.classList.add('current');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        while (unvisited.size > 0 && isRunning) {
            let current = null;
            let minDistance = Infinity;
            
            for (const nodeId of unvisited) {
                if (distances[nodeId] < minDistance) {
                    minDistance = distances[nodeId];
                    current = nodeId;
                }
            }
            
            if (current === null) break;
            
            unvisited.delete(current);
            
            const currentElement = nodePositions[current].element;
            currentElement.classList.add('current');
            await new Promise(resolve => setTimeout(resolve, 300));
            
            if (current === targetNodeId) {
                messageArea.textContent = `Shortest path to ${targetNodeId} found! Distance: ${distances[current]}`;
                break;
            }
            
            for (const edge of dijkstraGraphData.edges) {
                if (edge.from === current && unvisited.has(edge.to)) {
                    const newDistance = distances[current] + edge.weight;
                    
                    if (newDistance < distances[edge.to]) {
                        distances[edge.to] = newDistance;
                        previous[edge.to] = current;
                        
                        const edgeKey = `${edge.from}-${edge.to}`;
                        lineElements[edgeKey]?.classList.add('visited');
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                }
            }
            
            currentElement.classList.remove('current');
            currentElement.classList.add('visited');
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        if (previous[targetNodeId] !== null) {
            let path = [targetNodeId];
            let current = targetNodeId;
            
            while (previous[current] !== null) {
                current = previous[current];
                path.unshift(current);
            }
            
            for (let i = 0; i < path.length - 1; i++) {
                const edgeKey = `${path[i]}-${path[i + 1]}`;
                lineElements[edgeKey]?.classList.add('found');
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            
            messageArea.textContent = `Shortest path: ${path.join(' → ')} (Distance: ${distances[targetNodeId]})`;
        } else if (isRunning) {
            messageArea.textContent = `No path found to ${targetNodeId}`;
        }
        
        isRunning = false;
        startBtn.disabled = false;
    }

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

    function findNodeData(node, id) {
        if (node.id === id) return node;
        if (node.children) {
            for (const child of node.children) {
                const found = findNodeData(child, id);
                if (found) return found;
            }
        }
        return null;
    }

    async function bfs(startNodeId, targetNodeId) {
        const queue = [{ id: startNodeId, parentId: null }];
        const visited = new Set([startNodeId]);
        let found = false;
        
        while (queue.length > 0 && isRunning) {
            const { id: currentNodeId, parentId } = queue.shift();
            const currentNodeElement = nodePositions[currentNodeId].element;

            if (parentId) {
                lineElements[`${parentId}-${currentNodeId}`]?.classList.add('visited');
            }
            currentNodeElement.classList.add('current');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (currentNodeId === targetNodeId) {
                messageArea.textContent = `Found ${targetNodeId}!`;
                found = true;
                break;
            }
            currentNodeElement.classList.remove('current');
            currentNodeElement.classList.add('visited');
            
            const currentNodeData = findNodeData(treeData, currentNodeId);
            if (currentNodeData?.children) {
                for (const child of currentNodeData.children) {
                    if (!visited.has(child.id)) {
                        visited.add(child.id);
                        queue.push({ id: child.id, parentId: currentNodeId });
                    }
                }
            }
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        if (!found && isRunning) messageArea.textContent = 'Target not found.';
        isRunning = false;
        startBtn.disabled = false;
    }

    async function dfs(startNodeId, targetNodeId) {
        const stack = [{ id: startNodeId, parentId: null }];
        const visited = new Set();
        let found = false;

        while (stack.length > 0 && isRunning) {
            const { id: currentNodeId, parentId } = stack.pop();
            
            if (visited.has(currentNodeId)) continue;
            visited.add(currentNodeId);

            const currentNodeElement = nodePositions[currentNodeId].element;
            
            if (parentId) {
                 lineElements[`${parentId}-${currentNodeId}`]?.classList.add('visited');
            }
            currentNodeElement.classList.add('current');
            await new Promise(resolve => setTimeout(resolve, 500));

            if (currentNodeId === targetNodeId) {
                messageArea.textContent = `Found ${targetNodeId}!`;
                found = true;
                break;
            }
            currentNodeElement.classList.remove('current');
            currentNodeElement.classList.add('visited');
            
            const currentNodeData = findNodeData(treeData, currentNodeId);
            if (currentNodeData?.children) {
                [...currentNodeData.children].reverse().forEach(child => {
                    if (!visited.has(child.id)) {
                        stack.push({ id: child.id, parentId: currentNodeId });
                    }
                });
            }
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        if (!found && isRunning) messageArea.textContent = 'Target not found.';
        isRunning = false;
        startBtn.disabled = false;
    }
    
    // --- Event Listeners ---
    algorithmTypeSelect.addEventListener('change', () => {
        if(isRunning) isRunning = false;
        renderUI();
    });
    
    algorithmSelect.addEventListener('change', () => {
        if(algorithmTypeSelect.value === 'searching') {
            updateSearchControls();
        }
    });
    
    startBtn.addEventListener('click', async () => {
        if (isRunning) return;

        const type = algorithmTypeSelect.value;
        const selectedAlgorithm = algorithmSelect.value;
        
        resetVisualizer();
        isRunning = true;
        startBtn.disabled = true;
        messageArea.textContent = 'Running...';
        
        if (type === 'sorting') {
            const bars = document.querySelectorAll('.bar');
            const maxHeight = Math.max(...array);
            const isRunningFunc = () => isRunning;
            
            switch(selectedAlgorithm) {
                case 'bubble-sort': 
                    await sortingAlgorithms.bubbleSort(array, bars, isRunningFunc, maxHeight, true); 
                    break;
                case 'quick-sort': 
                    await sortingAlgorithms.quickSort(array, bars, 0, array.length - 1, isRunningFunc, maxHeight, true);
                    break;
                case 'merge-sort': 
                    await sortingAlgorithms.mergeSort(array, bars, 0, array.length - 1, isRunningFunc, maxHeight, true); 
                    break;
            }
        } else if (type === 'searching') {
            if (selectedAlgorithm === 'dijkstra') {
                const startNodeInput = document.getElementById('start-node');
                const targetNodeInput = document.getElementById('target-node');
                const startNode = startNodeInput.value.toUpperCase();
                const targetNode = targetNodeInput.value.toUpperCase();
                
                if (!startNode || !targetNode) {
                    messageArea.textContent = 'Please enter both start and target nodes.';
                    isRunning = false;
                    startBtn.disabled = false;
                    return;
                }
                
                await dijkstra(startNode, targetNode);
            } else {
                const targetNodeInput = document.getElementById('target-node');
                const targetNode = targetNodeInput.value.toUpperCase();
                if (!targetNode) {
                    messageArea.textContent = 'Please enter a target node.';
                    isRunning = false;
                    startBtn.disabled = false;
                    return;
                }
                if (selectedAlgorithm === 'breadth search') await bfs('A', targetNode);
                else if (selectedAlgorithm === 'depth search') await dfs('A', targetNode);
            }
        }

        if (isRunning) {
            messageArea.textContent = type === 'sorting' ? 'Sorting Complete!' : messageArea.textContent;
        } else {
            messageArea.textContent = 'Stopped by user.';
        }
        isRunning = false;
        startBtn.disabled = false;
    });

    resetBtn.addEventListener('click', () => {
        isRunning = false;
        if(algorithmTypeSelect.value === 'sorting') {
            generateArray();
        } else {
            renderUI();
        }
    });

    // Comparison mode toggle
    algorithmComparisonCheckbox.addEventListener('change', (e) => {
        const isComparisonMode = e.target.checked;
        
        if (isComparisonMode) {
            // Stop any running single algorithm sorting
            if (isRunning) {
                isRunning = false;
                startBtn.disabled = false;
                startBtn.textContent = 'Start';
                messageArea.textContent = 'Switched to comparison mode';
                
                // Clear any visual highlights from stopped sorting
                document.querySelectorAll('.bar').forEach(bar => {
                    bar.classList.remove('comparing', 'sorted', 'pivot', 'musical-highlight');
                });
            }
            
            // Mute sound when entering comparison mode
            if (audioSystem.isSoundEnabled) {
                audioSystem.toggleSound();
                muteBtn.textContent = 'Unmute';
                muteBtn.style.backgroundColor = '#6b7280';
            }
            
            // Hide single algorithm controls and volume controls
            singleAlgorithmControls.classList.add('hidden');
            singleAlgorithmSelect.classList.add('hidden');
            singleAlgorithmButtons.classList.add('hidden');
            volumeControls.classList.add('hidden');
            
            // Show comparison controls and visualization
            visualizationContainer.classList.add('hidden');
            comparisonMode.classList.remove('hidden');
            comparisonControls.classList.remove('hidden');
            messageArea.textContent = 'Comparison mode: Select algorithms to compare';
            
            // Generate arrays immediately when entering comparison mode
            comparisonSystem.generateComparisonArrays(arraySize);
        } else {
            // Unmute sound when exiting comparison mode
            if (!audioSystem.isSoundEnabled) {
                audioSystem.toggleSound();
                muteBtn.textContent = 'Mute';
                muteBtn.style.backgroundColor = '#ea580c';
            }
            
            // Show single algorithm controls and volume controls
            singleAlgorithmControls.classList.remove('hidden');
            singleAlgorithmSelect.classList.remove('hidden');
            singleAlgorithmButtons.classList.remove('hidden');
            volumeControls.classList.remove('hidden');
            
            // Hide comparison controls and show normal visualization
            visualizationContainer.classList.remove('hidden');
            comparisonMode.classList.add('hidden');
            comparisonControls.classList.add('hidden');
            messageArea.textContent = '';
            comparisonSystem.resetComparison();
            
            // Re-enable sound for single algorithm mode
            audioSystem.setComparisonMode(false);
            comparisonSystem.exitComparisonMode();
        }
    });

    // Start comparison
    startComparisonBtn.addEventListener('click', async () => {
        const algo1 = comparisonAlgorithm1.value;
        const algo2 = comparisonAlgorithm2.value;
        
        if (algo1 === algo2) {
            messageArea.textContent = 'Please select different algorithms to compare';
            return;
        }
        
        if (isRunning) {
            messageArea.textContent = 'Please wait for current operation to complete';
            return;
        }
        
        isRunning = true;
        startComparisonBtn.disabled = true;
        messageArea.textContent = 'Running comparison...';
        
        // Update algorithm labels
        document.getElementById('algorithm-1-label').textContent = 
            algo1.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        document.getElementById('algorithm-2-label').textContent = 
            algo2.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        try {
            await comparisonSystem.runSideBySideComparison([algo1, algo2], arraySize);
            messageArea.textContent = 'Comparison complete!';
        } catch (error) {
            console.error('Comparison error:', error);
            messageArea.textContent = 'Comparison failed: ' + error.message;
        }
        
        isRunning = false;
        startComparisonBtn.disabled = false;
    });

    // Reset comparison
    resetComparisonBtn.addEventListener('click', () => {
        // Stop any running comparison sorting
        isRunning = false;
        startComparisonBtn.disabled = false;
        
        // Stop comparison algorithms
        comparisonSystem.stopComparison();
        
        // Clear visual highlights from comparison containers
        const container1 = document.getElementById('comparison-container-1');
        const container2 = document.getElementById('comparison-container-2');
        
        if (container1) {
            container1.querySelectorAll('.bar').forEach(bar => {
                bar.classList.remove('comparing', 'sorted', 'pivot', 'musical-highlight');
            });
        }
        
        if (container2) {
            container2.querySelectorAll('.bar').forEach(bar => {
                bar.classList.remove('comparing', 'sorted', 'pivot', 'musical-highlight');
            });
        }
        
        // Reset comparison system
        comparisonSystem.resetComparison();
        messageArea.textContent = 'Comparison reset';
    });

    // Volume control event listeners
    volumeControl.addEventListener('input', (e) => {
        audioSystem.setVolume(parseFloat(e.target.value) / 1000);
    });
    
    muteBtn.addEventListener('click', () => {
        const isEnabled = audioSystem.toggleSound();
        muteBtn.textContent = isEnabled ? 'Mute' : 'Unmute';
        muteBtn.style.backgroundColor = isEnabled ? '#ea580c' : '#6b7280';
    });
    
    // Initial render
    renderUI();
});