# 🚀 Algorithm Visualizer

<div align="center">

![Algorithm Visualizer](https://img.shields.io/badge/Algorithm-Visualizer-blue?style=for-the-badge&logo=javascript)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

**An interactive web application that brings algorithms to life through beautiful visualizations**

[🌐 Live Demo](http://localhost:8000) 

</div>

---

## ✨ Features

### 🔄 Sorting Algorithms
- **Bubble Sort** - Watch elements bubble up to their correct positions
- **Quick Sort** - See the divide-and-conquer approach in action
- **Merge Sort** - Observe the merging process step by step

### 🔍 Search Algorithms
- **Dijkstra's Algorithm** - Find shortest paths in weighted graphs with real-time visualization
- **Breadth-First Search (BFS)** - Explore graphs level by level
- **Depth-First Search (DFS)** - Dive deep into graph structures

### 🎨 Visual Features
- **Real-time Animation** - Smooth transitions and color-coded states
- **Interactive Controls** - Adjust array sizes, set target values, and choose start/end nodes
- **Responsive Design** - Works perfectly on desktop and mobile devices
- **Modern UI** - Clean, dark theme with intuitive controls

---

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local server) or any HTTP server

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/algorithm-visualizer.git
   cd algorithm-visualizer
   ```

2. **Start the local server**
   ```bash
   python3 -m http.server 8000
   ```

3. **Open your browser**
   ```
   http://localhost:8000
   ```

That's it! 🎉 The Algorithm Visualizer is now running locally.

---

## 🎮 How to Use

### Sorting Algorithms
1. Select **"Sorting"** from the Type dropdown
2. Choose your preferred algorithm (Bubble Sort, Quick Sort, or Merge Sort)
3. Adjust the array size using the slider (10-150 elements)
4. Click **"New Array"** to generate a random array
5. Hit **"Start"** to begin the visualization
6. Watch the magic happen! ✨

### Search Algorithms
1. Select **"Searching"** from the Type dropdown
2. Choose your algorithm:
   - **Dijkstra**: Enter start and target nodes (e.g., A → F)
   - **BFS/DFS**: Enter a target node to search for
3. Click **"Start"** to begin the search
4. Observe the algorithm's exploration process

---

## 🎯 Algorithm Details

### Dijkstra's Algorithm
- **Purpose**: Find the shortest path between two nodes in a weighted graph
- **Visualization**: 
  - 🟢 Green nodes = Visited
  - 🟡 Yellow nodes = Currently processing
  - 🟠 Orange nodes = Unvisited
  - ⚡ Yellow edges = Shortest path found

### Sorting Visualizations
- **🟠 Orange bars** = Normal state
- **🟢 Green bars** = Currently comparing
- **🔵 Blue bars** = Pivot element (Quick Sort)
- **🟢 Dark green bars** = Sorted elements

---

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with modern animations
- **Architecture**: Vanilla JavaScript (no frameworks)
- **Server**: Python HTTP server (development)

---

## 📁 Project Structure

```
algorithm-visualizer/
├── index.html          # Main HTML file
├── script.js           # Core JavaScript logic
├── styles.css          # Styling and animations
├── dockerfile          # Docker configuration
└── README.md           # This file
```

---

## 🎨 Customization

### Adding New Algorithms
1. Add your algorithm function to `script.js`
2. Update the algorithm selection in `renderUI()`
3. Add corresponding CSS classes in `styles.css`
4. Update the event listener in the start button handler

### Styling
- Modify `styles.css` to change colors, animations, and layout
- All visual states are controlled via CSS classes
- Responsive breakpoints are included for mobile devices

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-algorithm
   ```
3. **Add your algorithm**
   - Implement the algorithm logic
   - Add visual states and animations
   - Update the UI controls
4. **Commit your changes**
   ```bash
   git commit -m "Add amazing new algorithm"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-algorithm
   ```
6. **Open a Pull Request**

### Algorithm Ideas
- Heap Sort
- Radix Sort
- A* Search Algorithm
- Binary Search Tree operations
- Graph coloring algorithms

---

## 📊 Performance

- **Array Size**: Supports up to 150 elements for smooth visualization
- **Animation Speed**: Optimized delays for best user experience
- **Memory Usage**: Lightweight implementation with minimal overhead
- **Browser Compatibility**: Works on all modern browsers

---

## 🐛 Troubleshooting

### Common Issues

**Graph not displaying properly?**
- Ensure you're using a modern browser
- Check the browser console for JavaScript errors
- Try refreshing the page

**Animations too fast/slow?**
- Modify the `delay()` function values in `script.js`
- Adjust CSS transition durations in `styles.css`

**Mobile layout issues?**
- The app is responsive, but some features work best on desktop
- Try landscape orientation on mobile devices

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by the need to make algorithms more accessible
- Built with modern web technologies
- Designed for educational purposes

---

## 📞 Contact

**Your Name** - [@yourusername](https://github.com/yourusername)

Project Link: [https://github.com/yourusername/algorithm-visualizer](https://github.com/yourusername/algorithm-visualizer)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ and JavaScript

</div>
