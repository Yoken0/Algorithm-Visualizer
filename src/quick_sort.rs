use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct QuickSort {
    array: Vec<i32>,
    stack: Vec<(i32, i32)>,
    current_partition: Option<(i32, i32)>,
    pivot_index: Option<i32>,
}

#[wasm_bindgen]
impl QuickSort {
    #[wasm_bindgen(constructor)]
    pub fn new() -> QuickSort {
        QuickSort {
            array: Vec::new(),
            stack: Vec::new(),
            current_partition: None,
            pivot_index: None,
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
        self.stack.clear();
        self.current_partition = None;
        self.pivot_index = None;
    }

    #[wasm_bindgen]
    pub fn start_sort(&mut self) {
        if !self.array.is_empty() {
            self.stack.push((0, (self.array.len() - 1) as i32));
        }
    }

    #[wasm_bindgen]
    pub fn step(&mut self) -> Option<(Vec<i32>, i32, i32, i32)> {
        if self.current_partition.is_none() {
            if let Some((low, high)) = self.stack.pop() {
                self.current_partition = Some((low, high));
                self.pivot_index = Some(self.partition(low, high));
                return Some((self.array.clone(), low, high, self.pivot_index.unwrap()));
            } else {
                return None; // Sorting complete
            }
        }

        let (low, high) = self.current_partition.unwrap();
        let pivot = self.pivot_index.unwrap();

        // Add sub-arrays to stack
        if pivot - 1 > low {
            self.stack.push((low, pivot - 1));
        }
        if pivot + 1 < high {
            self.stack.push((pivot + 1, high));
        }

        self.current_partition = None;
        self.pivot_index = None;

        if self.stack.is_empty() {
            None // Sorting complete
        } else {
            Some((self.array.clone(), low, high, pivot))
        }
    }

    fn partition(&mut self, low: i32, high: i32) -> i32 {
        let pivot = self.array[high as usize];
        let mut i = low - 1;

        for j in low..high {
            if self.array[j as usize] < pivot {
                i += 1;
                self.array.swap(i as usize, j as usize);
            }
        }

        i += 1;
        self.array.swap(i as usize, high as usize);
        i
    }

    #[wasm_bindgen]
    pub fn is_complete(&self) -> bool {
        self.stack.is_empty() && self.current_partition.is_none()
    }
}
