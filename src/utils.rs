use wasm_bindgen::prelude::*;
use web_sys::console;

// Import the `console.log` function from the `console` object.
macro_rules! log {
    ( $( $t:tt )* ) => {
        console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub struct ArrayGenerator {
    seed: u64,
}

#[wasm_bindgen]
impl ArrayGenerator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> ArrayGenerator {
        ArrayGenerator { seed: 0 }
    }

    #[wasm_bindgen]
    pub fn generate(&mut self, size: usize) -> Vec<i32> {
        use std::collections::hash_map::DefaultHasher;
        use std::hash::{Hash, Hasher};
        use std::time::{SystemTime, UNIX_EPOCH};
        
        let mut rng = DefaultHasher::new();
        SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos().hash(&mut rng);
        
        let mut array = Vec::new();
        for i in 0..size {
            let mut hasher = DefaultHasher::new();
            (rng.finish() + i as u64).hash(&mut hasher);
            let value = (hasher.finish() % 400) as i32 + 20;
            array.push(value);
        }
        array
    }
}

// Utility functions
#[wasm_bindgen]
pub fn greet(name: &str) {
    log!("Hello, {}!", name);
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
