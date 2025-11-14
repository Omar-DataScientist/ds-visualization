# Quick Start Guide - Pathfinding Visualizer

## 🎮 Getting Started

### Step 1: Start the App
```bash
npm run dev
```
Open `http://localhost:5173` in your browser

### Step 2: Place Nodes
- **Left Click** anywhere on map → Set start node (shows green circle)
- **Right Click** within the green circle → Set end node (shows red circle)
- A colored radius circle shows the search area

### Step 3: Pick Algorithm
Click ⚙️ → Select algorithm:
- **A*** (Fastest with heuristic)
- **Greedy** (Fastest straight-line)
- **Dijkstra** (Most thorough)
- **Bidirectional** (Best visualization)

### Step 4: Start Visualization
Click ▶️ or press **Space** to watch the algorithm work!

You'll see:
- 🟩 Green lines = Explored paths
- 🟥 Red lines = Final shortest path

## ⚙️ Settings Explained

### Speed (1-30x)
- **Low (1-5)**: Clear step-by-step visualization
- **Medium (5-15)**: Balanced speed and clarity ✅ Recommended
- **High (15-30)**: Fast completion

### Area Radius (2-20km)
- **Small (2-4km)**: Fast, fewer nodes
- **Medium (4-8km)**: Good balance ✅ Recommended
- **Large (8-20km)**: Many nodes, slower but interesting

### Algorithm Comparison

| Algorithm | Speed | Path Quality | Best For |
|-----------|-------|-------------|----------|
| A* | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Best overall |
| Greedy | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Quick demo |
| Dijkstra | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Perfect paths |
| Bidirectional | ⭐⭐⭐ | ⭐⭐⭐⭐ | Cool pattern |

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** | Play/Pause |
| **R** | Clear path |
| **Esc** | Exit cinematic mode |
| **← / →** | Playback control |

## 💡 Tips & Tricks

### Best Settings for Learning
```
Algorithm: A*
Speed: 8x
Area Radius: 4km
```

### Fastest Completion
```
Algorithm: Greedy
Speed: 25x
Area Radius: 4km
```

### Most Satisfying Visualization
```
Algorithm: Bidirectional
Speed: 10x
Area Radius: 6km
```

## 🎬 Features

### Playback Mode
Once algorithm finishes, use the playback slider to:
- Scrub through the path
- Step forward/backward
- Replay the visualization

### Cinematic Mode
Click 🎬 for presentation mode:
- Hides all UI controls
- Focus on the visualization
- Use arrow keys to control playback
- Press Esc to exit

### Quick Locations
Click ⚙️ → "Location" to jump to:
- New York, Tokyo, Paris, London, Singapore
- San Francisco, Berlin, Sydney, Dubai
- And more!

## 🐛 Troubleshooting

### App is slow?
- Reduce speed slider
- Reduce area radius
- Use smaller search area
- Clear path and try again

### No path found?
- Start and end nodes must be in the same area
- Check the green radius circle
- Try a different location

### Animation not showing?
- Increase the speed slider (1-10 recommended)
- Refresh the page
- Check browser console for errors

## 🌍 Supported Locations

Press ⚙️ → Select from:
- New York
- Tokyo
- Paris
- Rome
- Prague
- London
- Dubai
- Singapore
- San Francisco
- Berlin
- Sydney
- Amsterdam
- Stockholm
- Hong Kong
- Rio de Janeiro
- Shanghai
- Barcelona

## 💾 Your Settings Are Saved

Colors and settings are saved in browser local storage:
- Change colors anytime
- Adjust speed
- Select algorithm
- All saved automatically!

Reset to defaults: Click "Reset Colors" button

## 🚀 Performance Notes

The app is optimized for:
- **Chrome/Edge**: Best performance
- **Firefox**: Great performance
- **Safari**: Good performance
- **Mobile**: Responsive and touch-friendly

For best results:
- Use area radius 2-8km
- Speed between 5-15
- Close other browser tabs
- Use latest browser version

## 🎓 Learning Pathfinding

Great way to understand:
- How A* uses heuristics
- Why greedy isn't always optimal
- How Dijkstra explores thoroughly
- Why bidirectional is cool!

Try same start/end with different algorithms to compare!

---

**Enjoy exploring pathfinding algorithms! 🗺️✨**

Questions? Check the documentation files or the tutorial in-app!
