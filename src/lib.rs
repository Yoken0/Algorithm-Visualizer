use wasm_bindgen::prelude::*;

// Import all algorithm modules
mod bubble_sort;
mod quick_sort;
mod merge_sort;
mod binary_search;
mod linear_search;
mod bfs;
mod dfs;
mod utils;

// Re-export all the algorithm structs
pub use bubble_sort::BubbleSort;
pub use quick_sort::QuickSort;
pub use merge_sort::MergeSort;
pub use binary_search::BinarySearch;
pub use linear_search::LinearSearch;
pub use bfs::BFS;
pub use dfs::DFS;
pub use utils::{ArrayGenerator, greet, add};

// Main algorithm runner that coordinates all algorithms
#[wasm_bindgen]
pub struct AlgorithmRunner {
    bubble_sort: BubbleSort,
    quick_sort: QuickSort,
    merge_sort: MergeSort,
    binary_search: BinarySearch,
    linear_search: LinearSearch,
    array_generator: ArrayGenerator,
    current_array: Vec<i32>,
    is_running: bool,
}

#[wasm_bindgen]
impl AlgorithmRunner {
    #[wasm_bindgen(constructor)]
    pub fn new() -> AlgorithmRunner {
        AlgorithmRunner {
            bubble_sort: BubbleSort::new(),
            quick_sort: QuickSort::new(),
            merge_sort: MergeSort::new(),
            binary_search: BinarySearch::new(),
            linear_search: LinearSearch::new(),
            array_generator: ArrayGenerator::new(),
            current_array: Vec::new(),
            is_running: false,
        }
    }

    #[wasm_bindgen]
    pub fn generate_array(&mut self, size: usize) {
        self.current_array = self.array_generator.generate(size);
        self.update_all_algorithms();
    }

    #[wasm_bindgen]
    pub fn get_array(&self) -> Vec<i32> {
        self.current_array.clone()
    }

    #[wasm_bindgen]
    pub fn set_array(&mut self, array: Vec<i32>) {
        self.current_array = array;
        self.update_all_algorithms();
    }

    #[wasm_bindgen]
    pub fn set_running(&mut self, running: bool) {
        self.is_running = running;
    }

    #[wasm_bindgen]
    pub fn is_running(&self) -> bool {
        self.is_running
    }

    fn update_all_algorithms(&mut self) {
        self.bubble_sort.set_array(self.current_array.clone());
        self.quick_sort.set_array(self.current_array.clone());
        self.merge_sort.set_array(self.current_array.clone());
        self.binary_search.set_array(self.current_array.clone());
        self.linear_search.set_array(self.current_array.clone());
    }

    // Bubble Sort methods
    #[wasm_bindgen]
    pub fn bubble_sort_step(&mut self) -> Option<Vec<i32>> {
        self.bubble_sort.step()
    }

    #[wasm_bindgen]
    pub fn bubble_sort_reset(&mut self) {
        self.bubble_sort.reset();
    }

    // Quick Sort methods
    #[wasm_bindgen]
    pub fn quick_sort_start(&mut self) {
        self.quick_sort.start_sort();
    }

    #[wasm_bindgen]
    pub fn quick_sort_step(&mut self) -> Option<(Vec<i32>, i32, i32, i32)> {
        self.quick_sort.step()
    }

    #[wasm_bindgen]
    pub fn quick_sort_reset(&mut self) {
        self.quick_sort.reset();
    }

    // Merge Sort methods
    #[wasm_bindgen]
    pub fn merge_sort_start(&mut self) {
        self.merge_sort.start_sort();
    }

    #[wasm_bindgen]
    pub fn merge_sort_step(&mut self) -> Option<(Vec<i32>, usize, usize, usize)> {
        self.merge_sort.step()
    }

    #[wasm_bindgen]
    pub fn merge_sort_reset(&mut self) {
        self.merge_sort.reset();
    }

    // Binary Search methods
    #[wasm_bindgen]
    pub fn binary_search_start(&mut self, target: i32) {
        self.binary_search.start_search(target);
    }

    #[wasm_bindgen]
    pub fn binary_search_step(&mut self) -> Option<(Vec<i32>, usize, usize, usize)> {
        self.binary_search.step()
    }

    #[wasm_bindgen]
    pub fn binary_search_reset(&mut self) {
        self.binary_search.reset();
    }

    // Linear Search methods
    #[wasm_bindgen]
    pub fn linear_search_start(&mut self, target: i32) {
        self.linear_search.start_search(target);
    }

    #[wasm_bindgen]
    pub fn linear_search_step(&mut self) -> Option<(Vec<i32>, usize)> {
        self.linear_search.step()
    }

    #[wasm_bindgen]
    pub fn linear_search_reset(&mut self) {
        self.linear_search.reset();
    }
}

// Graph searcher that coordinates BFS and DFS
#[wasm_bindgen]
pub struct GraphSearcher {
    bfs: BFS,
    dfs: DFS,
}

#[wasm_bindgen]
impl GraphSearcher {
    #[wasm_bindgen(constructor)]
    pub fn new() -> GraphSearcher {
        GraphSearcher {
            bfs: BFS::new(),
            dfs: DFS::new(),
        }
    }

    #[wasm_bindgen]
    pub fn add_edge(&mut self, from: String, to: String) {
        self.bfs.add_edge(from.clone(), to.clone());
        self.dfs.add_edge(from, to);
    }

    #[wasm_bindgen]
    pub fn bfs_start(&mut self, start: String) {
        self.bfs.start_search(start);
    }

    #[wasm_bindgen]
    pub fn bfs_step(&mut self, target: String) -> Option<(String, bool)> {
        self.bfs.step(target)
    }

    #[wasm_bindgen]
    pub fn dfs_start(&mut self, start: String) {
        self.dfs.start_search(start);
    }

    #[wasm_bindgen]
    pub fn dfs_step(&mut self, target: String) -> Option<(String, bool)> {
        self.dfs.step(target)
    }

    #[wasm_bindgen]
    pub fn reset(&mut self) {
        self.bfs.reset();
        self.dfs.reset();
    }
}