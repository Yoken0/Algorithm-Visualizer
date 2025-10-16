document.addEventListener('DOMContentLoaded', () => {
    const algorithmTypeSelect = document.getElementById('algorithm-type');
    const algorithmSelect = document.getElementById('algorithm-select');
    const dynamicControlsDiv = document.getElementById('dynamic-controls');
    const arrayContainer = document.getElementById('array-container');
    const treeContainer = document.getElementById('tree-container');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const messageArea = document.getElementById('message-area');

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
                if (!isRunning) generateArray();
            });
            
            document.getElementById('generate-btn').addEventListener('click', () => {
                if (isRunning) isRunning = false;
                generateArray();
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

            // Set up controls based on selected algorithm
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
            
            // Clear containers and state before rendering to prevent duplicates
            treeContainer.innerHTML = '';
            nodePositions = {};
            lineElements = {};
            renderWeightedGraph(dijkstraGraphData, 0, 0, 0);
        } else {
            // Tree search algorithms (BFS/DFS)
            arrayContainer.style.display = 'none';
            treeContainer.style.display = 'block';
            
            dynamicControlsDiv.innerHTML = `
                <div class="flex items-center space-x-2">
                    <label for="target-node" class="text-gray-300">Target Node:</label>
                    <input type="text" id="target-node" class="bg-[#2d2d46] text-white border-2 border-orange-600 rounded-full py-2 px-4 w-28" placeholder="e.g., G" maxlength="1">
                </div>
            `;
            
            // Clear containers and state before rendering to prevent duplicates
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
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

    
    // ... (Bubble, Quick, Merge Sort functions remain the same as in your original file)
    async function bubbleSort() {
        let n = array.length;
        const bars = document.querySelectorAll('.bar');
        for (let i = 0; i < n - 1 && isRunning; i++) {
            for (let j = 0; j < n - i - 1 && isRunning; j++) {
                bars[j].classList.add('comparing');
                bars[j + 1].classList.add('comparing');
                await delay(30);
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    [bars[j].style.height, bars[j+1].style.height] = [bars[j+1].style.height, bars[j].style.height];
                }
                bars[j].classList.remove('comparing');
                bars[j + 1].classList.remove('comparing');
            }
            if (isRunning) bars[n - 1 - i].classList.add('sorted');
        }
        if (isRunning && n > 0) bars[0].classList.add('sorted');
    }

    async function partition(low, high) {
        if (!isRunning) return;
        const bars = document.querySelectorAll('.bar');
        let pivot = array[high];
        let i = low - 1;
        bars[high].classList.add('pivot');
        for (let j = low; j < high; j++) {
            if (!isRunning) return;
            bars[j].classList.add('comparing');
            await delay(50);
            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                [bars[i].style.height, bars[j].style.height] = [bars[j].style.height, bars[i].style.height];
            }
            bars[j].classList.remove('comparing');
        }
        i++;
        [array[i], array[high]] = [array[high], array[i]];
        [bars[i].style.height, bars[high].style.height] = [bars[high].style.height, bars[i].style.height];
        bars[high].classList.remove('pivot');
        bars[i].classList.add('sorted');
        return i;
    }

    async function quickSort(low, high) {
        if (!isRunning || low >= high) {
            if (low === high) document.querySelectorAll('.bar')[low]?.classList.add('sorted');
            return;
        }
        let pi = await partition(low, high);
        if (pi === undefined) return;
        await Promise.all([quickSort(low, pi - 1), quickSort(pi + 1, high)]);
    }

    async function merge(low, mid, high) {
        if (!isRunning) return;
        const bars = document.querySelectorAll('.bar');
        let n1 = mid - low + 1, n2 = high - mid;
        let L = array.slice(low, mid + 1);
        let R = array.slice(mid + 1, high + 1);
        let i = 0, j = 0, k = low;
        while (i < n1 && j < n2 && isRunning) {
            bars[k].classList.add('comparing');
            await delay(30);
            if (L[i] <= R[j]) {
                array[k] = L[i];
                bars[k].style.height = `${L[i]}px`;
                i++;
            } else {
                array[k] = R[j];
                bars[k].style.height = `${R[j]}px`;
                j++;
            }
            bars[k].classList.remove('comparing');
            k++;
        }
        while (i < n1 && isRunning) {
            array[k] = L[i];
            bars[k].style.height = `${L[i]}px`;
            i++; k++;
            await delay(30);
        }
        while (j < n2 && isRunning) {
            array[k] = R[j];
            bars[k].style.height = `${R[j]}px`;
            j++; k++;
            await delay(30);
        }
    }

    async function mergeSort(low, high) {
        if (!isRunning || low >= high) return;
        let mid = Math.floor(low + (high - low) / 2);
        await mergeSort(low, mid);
        await mergeSort(mid + 1, high);
        await merge(low, mid, high);
        if (low === 0 && high === array.length - 1) {
            for(let i = 0; i < array.length; i++) {
                 document.querySelectorAll('.bar')[i].classList.add('sorted');
            }
        }
    }

    // --- Search Functions ---
    function renderWeightedGraph(graphData, startX, startY, level = 0) {
        // Clear existing elements
        treeContainer.innerHTML = '';
        nodePositions = {};
        lineElements = {};
        
        // Render nodes
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
        
        // Render edges with weights
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
                
                // Add weight label
                const weightLabel = document.createElement('div');
                weightLabel.classList.add('weight-label');
                weightLabel.textContent = edge.weight;
                weightLabel.style.left = `${(fromPos.x + toPos.x) / 2}px`;
                weightLabel.style.top = `${(fromPos.y + toPos.y) / 2 - 10}px`;
                treeContainer.appendChild(weightLabel);
            }
        });
    }

    async function dijkstra(startNodeId, targetNodeId) {
        const distances = {};
        const previous = {};
        const unvisited = new Set();
        
        // Initialize distances
        dijkstraGraphData.nodes.forEach(node => {
            distances[node.id] = node.id === startNodeId ? 0 : Infinity;
            previous[node.id] = null;
            unvisited.add(node.id);
        });
        
        const currentNodeElement = nodePositions[startNodeId].element;
        currentNodeElement.classList.add('current');
        await delay(500);
        
        while (unvisited.size > 0 && isRunning) {
            // Find the unvisited node with the smallest distance
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
            
            // Highlight current node
            const currentElement = nodePositions[current].element;
            currentElement.classList.add('current');
            await delay(300);
            
            if (current === targetNodeId) {
                messageArea.textContent = `Shortest path to ${targetNodeId} found! Distance: ${distances[current]}`;
                break;
            }
            
            // Check all neighbors
            for (const edge of dijkstraGraphData.edges) {
                if (edge.from === current && unvisited.has(edge.to)) {
                    const newDistance = distances[current] + edge.weight;
                    
                    if (newDistance < distances[edge.to]) {
                        distances[edge.to] = newDistance;
                        previous[edge.to] = current;
                        
                        // Highlight the edge being considered
                        const edgeKey = `${edge.from}-${edge.to}`;
                        lineElements[edgeKey]?.classList.add('visited');
                        await delay(200);
                    }
                }
            }
            
            currentElement.classList.remove('current');
            currentElement.classList.add('visited');
            await delay(200);
        }
        
        // Highlight the shortest path
        if (previous[targetNodeId] !== null) {
            let path = [targetNodeId];
            let current = targetNodeId;
            
            while (previous[current] !== null) {
                current = previous[current];
                path.unshift(current);
            }
            
            // Highlight path edges
            for (let i = 0; i < path.length - 1; i++) {
                const edgeKey = `${path[i]}-${path[i + 1]}`;
                lineElements[edgeKey]?.classList.add('found');
                await delay(300);
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
        // ENHANCEMENT: Store line elements for easy access later
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
            await delay(500);
            
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
            await delay(300);
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
            await delay(500);

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
            await delay(300);
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
            switch(selectedAlgorithm) {
                case 'bubble-sort': await bubbleSort(); break;
                case 'quick-sort': await quickSort(0, array.length - 1); break;
                case 'merge-sort': await mergeSort(0, array.length - 1); break;
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
                // Tree search algorithms (BFS/DFS)
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
    
    // Initial render
    renderUI();
});