# Algorithm Visualizer with Rust Backend

This project visualizes various sorting and search algorithms using Rust for the algorithm implementations and JavaScript/HTML for the frontend visualization.

## Features

- **Sorting Algorithms**: Bubble Sort, Quick Sort, Merge Sort
- **Search Algorithms**: Binary Search, Linear Search, BFS, DFS
- **Beautiful UI**: Catppuccin Mocha color scheme
- **High Performance**: Rust algorithms compiled to WebAssembly

## Prerequisites

- Rust (latest stable version)
- wasm-pack
- A modern web browser with WebAssembly support

## Installation

1. Install Rust if you haven't already:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. Install wasm-pack:
   ```bash
   curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
   ```

## Building

1. Build the Rust project to WebAssembly:
   ```bash
   ./build.sh
   ```

   Or manually:
   ```bash
   wasm-pack build --target web --out-dir pkg
   ```

## Running

1. Serve the files using a local web server (required for WebAssembly):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

2. Open your browser and navigate to `http://localhost:8000`

## Project Structure

```
Algorithm-Visualizer/
├── src/
│   ├── lib.rs              # Main Rust library with exports
│   ├── bubble_sort.rs      # Bubble Sort implementation
│   ├── quick_sort.rs       # Quick Sort implementation
│   ├── merge_sort.rs       # Merge Sort implementation
│   ├── binary_search.rs    # Binary Search implementation
│   ├── linear_search.rs    # Linear Search implementation
│   ├── bfs.rs              # Breadth-First Search implementation
│   ├── dfs.rs              # Depth-First Search implementation
│   └── utils.rs            # Utility functions and helpers
├── js/
│   ├── base.js             # Base AlgorithmVisualizer class
│   ├── bubble_sort.js      # Bubble Sort visualizer
│   ├── quick_sort.js       # Quick Sort visualizer
│   ├── merge_sort.js       # Merge Sort visualizer
│   ├── binary_search.js   # Binary Search visualizer
│   ├── linear_search.js   # Linear Search visualizer
│   ├── bfs.js              # BFS visualizer
│   └── dfs.js              # DFS visualizer
├── pkg/                    # Generated WebAssembly files
├── index.html              # Main HTML file
├── script.js               # Main frontend JavaScript
├── Cargo.toml              # Rust project configuration
├── build.sh                # Build script
└── README.md               # This file
```

## Architecture

- **Rust Backend**: All algorithm logic is implemented in Rust and compiled to WebAssembly
- **JavaScript Frontend**: Handles UI interactions and visualization
- **WebAssembly Bridge**: Allows JavaScript to call Rust functions efficiently

## Adding New Algorithms

To add a new algorithm:

1. **Create Rust implementation**: Create a new file `src/your_algorithm.rs` with the algorithm logic
2. **Update lib.rs**: Add `mod your_algorithm;` and re-export the struct
3. **Create JavaScript visualizer**: Create `js/your_algorithm.js` extending `AlgorithmVisualizer`
4. **Update HTML**: Add the script tag to load your new visualizer
5. **Update main script**: Add the algorithm option to the UI and create the visualizer in the factory function

## Performance Benefits

- Rust's zero-cost abstractions provide optimal performance
- WebAssembly compilation ensures near-native speed
- Memory safety without garbage collection overhead
- Efficient data structures and algorithms

## Browser Compatibility

This project requires a modern browser with WebAssembly support:
- Chrome 57+
- Firefox 52+
- Safari 11+
- Edge 16+
