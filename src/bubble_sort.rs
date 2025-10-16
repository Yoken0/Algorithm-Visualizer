use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct BubbleSort {
    array: Vec<i32>,
    outer_i: usize,
    inner_j: usize,
    sorted: bool,
}

#[wasm_bindgen]
impl BubbleSort {
    #[wasm_bindgen(constructor)]
    pub fn new() -> BubbleSort {
        BubbleSort {
            array: Vec::new(),
            outer_i: 0,
            inner_j: 0,
            sorted: false,
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
        self.outer_i = 0;
        self.inner_j = 0;
        self.sorted = false;
    }

    #[wasm_bindgen]
    pub fn step(&mut self) -> Option<Vec<i32>> {
        let n = self.array.len();
        
        if self.sorted {
            self.reset();
            return None;
        }

        if self.outer_i >= n - 1 {
            self.sorted = true;
            return Some(self.array.clone());
        }

        if self.inner_j >= n - self.outer_i - 1 {
            self.outer_i += 1;
            self.inner_j = 0;
            return Some(self.array.clone());
        }

        if self.array[self.inner_j] > self.array[self.inner_j + 1] {
            self.array.swap(self.inner_j, self.inner_j + 1);
        }

        self.inner_j += 1;
        Some(self.array.clone())
    }

    #[wasm_bindgen]
    pub fn is_complete(&self) -> bool {
        self.sorted
    }
}
