use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct MergeSort {
    array: Vec<i32>,
    temp_array: Vec<i32>,
    stack: Vec<(usize, usize)>,
    current_merge: Option<(usize, usize, usize)>,
}

#[wasm_bindgen]
impl MergeSort {
    #[wasm_bindgen(constructor)]
    pub fn new() -> MergeSort {
        MergeSort {
            array: Vec::new(),
            temp_array: Vec::new(),
            stack: Vec::new(),
            current_merge: None,
        }
    }

    #[wasm_bindgen]
    pub fn set_array(&mut self, array: Vec<i32>) {
        self.array = array.clone();
        self.temp_array = vec![0; array.len()];
        self.reset();
    }

    #[wasm_bindgen]
    pub fn get_array(&self) -> Vec<i32> {
        self.array.clone()
    }

    #[wasm_bindgen]
    pub fn reset(&mut self) {
        self.stack.clear();
        self.current_merge = None;
    }

    #[wasm_bindgen]
    pub fn start_sort(&mut self) {
        if !self.array.is_empty() {
            self.stack.push((0, self.array.len() - 1));
        }
    }

    #[wasm_bindgen]
    pub fn step(&mut self) -> Option<(Vec<i32>, usize, usize, usize)> {
        if self.current_merge.is_none() {
            if let Some((low, high)) = self.stack.pop() {
                if low < high {
                    let mid = low + (high - low) / 2;
                    
                    // Add sub-arrays to stack
                    self.stack.push((low, high)); // Current merge
                    self.stack.push((mid + 1, high)); // Right half
                    self.stack.push((low, mid)); // Left half
                    
                    return Some((self.array.clone(), low, mid, high));
                }
            } else {
                return None; // Sorting complete
            }
        }

        // Perform merge
        if let Some((low, mid, high)) = self.current_merge {
            self.merge(low, mid, high);
            self.current_merge = None;
            return Some((self.array.clone(), low, mid, high));
        }

        None
    }

    fn merge(&mut self, low: usize, mid: usize, high: usize) {
        // Copy data to temp array
        for i in low..=high {
            self.temp_array[i] = self.array[i];
        }

        let mut i = low;
        let mut j = mid + 1;
        let mut k = low;

        while i <= mid && j <= high {
            if self.temp_array[i] <= self.temp_array[j] {
                self.array[k] = self.temp_array[i];
                i += 1;
            } else {
                self.array[k] = self.temp_array[j];
                j += 1;
            }
            k += 1;
        }

        while i <= mid {
            self.array[k] = self.temp_array[i];
            i += 1;
            k += 1;
        }

        while j <= high {
            self.array[k] = self.temp_array[j];
            j += 1;
            k += 1;
        }
    }

    #[wasm_bindgen]
    pub fn is_complete(&self) -> bool {
        self.stack.is_empty() && self.current_merge.is_none()
    }
}
