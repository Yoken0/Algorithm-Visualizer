use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct BinarySearch {
    array: Vec<i32>,
    target: i32,
    left: usize,
    right: usize,
    initialized: bool,
}

#[wasm_bindgen]
impl BinarySearch {
    #[wasm_bindgen(constructor)]
    pub fn new() -> BinarySearch {
        BinarySearch {
            array: Vec::new(),
            target: 0,
            left: 0,
            right: 0,
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
        self.left = 0;
        self.right = 0;
        self.initialized = false;
    }

    #[wasm_bindgen]
    pub fn start_search(&mut self, target: i32) {
        self.target = target;
        self.left = 0;
        self.right = if self.array.is_empty() { 0 } else { self.array.len() - 1 };
        self.initialized = true;
    }

    #[wasm_bindgen]
    pub fn step(&mut self) -> Option<(Vec<i32>, usize, usize, usize)> {
        if !self.initialized || self.left > self.right {
            self.initialized = false;
            return None;
        }

        let mid = self.left + (self.right - self.left) / 2;

        if self.array[mid] == self.target {
            self.initialized = false;
            return Some((self.array.clone(), self.left, self.right, mid));
        } else if self.array[mid] < self.target {
            self.left = mid + 1;
        } else {
            self.right = mid - 1;
        }

        Some((self.array.clone(), self.left, self.right, mid))
    }

    #[wasm_bindgen]
    pub fn is_complete(&self) -> bool {
        !self.initialized
    }

    #[wasm_bindgen]
    pub fn found(&self) -> bool {
        if !self.initialized && !self.array.is_empty() {
            let mid = self.left + (self.right - self.left) / 2;
            return self.array[mid] == self.target;
        }
        false
    }
}
