use wasm_bindgen::prelude::*;
use std::collections::{HashMap, HashSet, Vec};

#[wasm_bindgen]
pub struct DFS {
    graph: HashMap<String, Vec<String>>,
    visited: HashSet<String>,
    stack: Vec<String>,
    current_node: Option<String>,
    initialized: bool,
}

#[wasm_bindgen]
impl DFS {
    #[wasm_bindgen(constructor)]
    pub fn new() -> DFS {
        DFS {
            graph: HashMap::new(),
            visited: HashSet::new(),
            stack: Vec::new(),
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
        self.stack.clear();
        self.current_node = None;
        self.initialized = false;
    }

    #[wasm_bindgen]
    pub fn start_search(&mut self, start: String) {
        self.reset();
        self.stack.push(start);
        self.initialized = true;
    }

    #[wasm_bindgen]
    pub fn step(&mut self, target: String) -> Option<(String, bool)> {
        if !self.initialized || self.stack.is_empty() {
            self.initialized = false;
            return None;
        }

        let current = self.stack.pop().unwrap();

        if self.visited.contains(&current) {
            return self.step(target);
        }

        self.visited.insert(current.clone());
        self.current_node = Some(current.clone());

        if current == target {
            self.initialized = false;
            return Some((current, true));
        }

        if let Some(neighbors) = self.graph.get(&current) {
            for neighbor in neighbors.iter().rev() {
                if !self.visited.contains(neighbor) {
                    self.stack.push(neighbor.clone());
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
