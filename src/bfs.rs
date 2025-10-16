use wasm_bindgen::prelude::*;
use std::collections::{HashMap, HashSet, VecDeque};

#[wasm_bindgen]
pub struct BFS {
    graph: HashMap<String, Vec<String>>,
    visited: HashSet<String>,
    queue: VecDeque<String>,
    current_node: Option<String>,
    initialized: bool,
}

#[wasm_bindgen]
impl BFS {
    #[wasm_bindgen(constructor)]
    pub fn new() -> BFS {
        BFS {
            graph: HashMap::new(),
            visited: HashSet::new(),
            queue: VecDeque::new(),
            current_node: None,
            initialized: false,
        }
    }

    #[wasm_bindgen]
    pub fn add_edge(&mut self, from: String, to: String) {
        self.graph.entry(from).or_insert_with(Vec::new).push(to);
    }

    #[wasm_bindgen]
    pub fn reset(&mut self) {
        self.visited.clear();
        self.queue.clear();
        self.current_node = None;
        self.initialized = false;
    }

    #[wasm_bindgen]
    pub fn start_search(&mut self, start: String) {
        self.reset();
        self.queue.push_back(start);
        self.visited.insert(self.queue[0].clone());
        self.initialized = true;
    }

    #[wasm_bindgen]
    pub fn step(&mut self, target: String) -> Option<(String, bool)> {
        if !self.initialized || self.queue.is_empty() {
            self.initialized = false;
            return None;
        }

        let current = self.queue.pop_front().unwrap();
        self.current_node = Some(current.clone());

        if current == target {
            self.initialized = false;
            return Some((current, true));
        }

        if let Some(neighbors) = self.graph.get(&current) {
            for neighbor in neighbors {
                if !self.visited.contains(neighbor) {
                    self.visited.insert(neighbor.clone());
                    self.queue.push_back(neighbor.clone());
                }
            }
        }

        Some((current, false))
    }

    #[wasm_bindgen]
    pub fn is_complete(&self) -> bool {
        !self.initialized
    }

    #[wasm_bindgen]
    pub fn get_current_node(&self) -> Option<String> {
        self.current_node.clone()
    }
}
