use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct LinearSearch {
    array: Vec<i32>,
    target: i32,
    index: usize,
    initialized: bool,
}

#[wasm_bindgen]
impl LinearSearch {
    #[wasm_bindgen(constructor)]
    pub fn new() -> LinearSearch {
        LinearSearch {
            array: Vec::new(),
            target: 0,
            index: 0,
            initialized: false,
        }
    }

    #[wasm_bindgen]
    pub fn set_array(&mut self, array: Vec<i32>) {
        self.array = array;
        self.reset();
    }

    #[wasm_bindgen]
    pub fn get_array(&self) -> Vec<i32> {
        self.array.clone()
    }

    #[wasm_bindgen]
    pub fn reset(&mut self) {
        self.index = 0;
        self.initialized = false;
    }

    #[wasm_bindgen]
    pub fn start_search(&mut self, target: i32) {
        self.target = target;
        self.index = 0;
        self.initialized = true;
    }

    #[wasm_bindgen]
    pub fn step(&mut self) -> Option<(Vec<i32>, usize)> {
        if !self.initialized || self.index >= self.array.len() {
            self.initialized = false;
            return None;
        }

        if self.array[self.index] == self.target {
            self.initialized = false;
            return Some((self.array.clone(), self.index));
        }

        self.index += 1;
        Some((self.array.clone(), self.index))
    }

    #[wasm_bindgen]
    pub fn is_complete(&self) -> bool {
        !self.initialized
    }

    #[wasm_bindgen]
    pub fn found(&self) -> bool {
        if !self.initialized && self.index < self.array.len() {
            return self.array[self.index] == self.target;
        }
        false
    }
}
