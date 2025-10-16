#!/bin/bash

# Build the Rust project to WebAssembly
echo "Building Rust project to WebAssembly..."

# Install wasm-pack if not already installed
if ! command -v wasm-pack &> /dev/null; then
    echo "Installing wasm-pack..."
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi

# Build the project
wasm-pack build --target web --out-dir pkg

echo "Build complete! The WASM files are in the pkg/ directory."
