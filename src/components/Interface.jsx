import { Button, IconButton, Typography, Snackbar, Alert, CircularProgress, Fade, Tooltip, Drawer, MenuItem, Select, InputLabel, FormControl, Menu, Backdrop, Stepper, Step, StepLabel } from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { PlayArrow, Settings, Movie, Pause, Replay } from "@mui/icons-material";
import Slider from "./Slider";
import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { INITIAL_COLORS, LOCATIONS } from "../config";
import { arrayToRgb, rgbToArray } from "../helpers";

const Interface = forwardRef(({ canStart, started, animationEnded, playbackOn, time, maxTime, settings, colors, loading, timeChanged, cinematic, placeEnd, changeRadius, changeAlgorithm, setPlaceEnd, setCinematic, setSettings, setColors, startPathfinding, toggleAnimation, clearPath, changeLocation }, ref) => {
    const [sidebar, setSidebar] = useState(false);
    const [snack, setSnack] = useState({
        open: false,
        message: "",
        type: "error",
    });
    const [showTutorial, setShowTutorial] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [helper, setHelper] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const menuOpen = Boolean(menuAnchor);
    const helperTime = useRef(4800);
    const rightDown = useRef(false);
    const leftDown = useRef(false);

    // Expose showSnack to parent from ref
    useImperativeHandle(ref, () => ({
        showSnack(message, type = "error") {
            setSnack({ open: true, message, type });
        },
    }));
      
    function closeSnack() {
        setSnack({...snack, open: false});
    }

    function closeHelper() {
        setHelper(false);
    }

    function handleTutorialChange(direction) {
        if(activeStep >= 2 && direction > 0) {
            setShowTutorial(false);
            return;
        }
        
        setActiveStep(Math.max(activeStep + direction, 0));
    }

    // Start pathfinding or toggle playback
    function handlePlay() {
        if(!canStart) return;
        if(!started && time === 0) {
            startPathfinding();
            return;
        }
        toggleAnimation();
    }
    
    function closeMenu() {
        setMenuAnchor(null);
    }

    window.onkeydown = e => {
        if(e.code === "ArrowRight" && !rightDown.current && !leftDown.current && (!started || animationEnded)) {
            rightDown.current = true;
            toggleAnimation(false, 1);
        }
        else if(e.code === "ArrowLeft" && !leftDown.current && !rightDown.current && animationEnded) {
            leftDown.current = true;
            toggleAnimation(false, -1);
        }
    };

    window.onkeyup = e => {
        if(e.code === "Escape") setCinematic(false);
        else if(e.code === "Space") {
            e.preventDefault();
            handlePlay();
        }
        else if(e.code === "ArrowRight" && rightDown.current) {
            rightDown.current = false;
            toggleAnimation(false, 1);
        }
        else if(e.code === "ArrowLeft" && animationEnded && leftDown.current) {
            leftDown.current = false;
            toggleAnimation(false, 1);
        }
        else if(e.code === "KeyR" && (animationEnded || !started)) clearPath();
    };

    // Show cinematic mode helper
    useEffect(() => {
        if(!cinematic) return;
        setHelper(true);
        setTimeout(() => {
            helperTime.current = 2500;
        }, 200);
    }, [cinematic]);

    useEffect(() => {
        if(localStorage.getItem("path_sawtutorial")) return;
        setShowTutorial(true);
        localStorage.setItem("path_sawtutorial", true);
    }, []);

    return (
        <>
            <div className={`nav-top ${cinematic ? "cinematic" : ""}`}>
                <div className="side slider-container">
                    <Typography id="playback-slider" gutterBottom>
                        Animation playback
                    </Typography>
                    <Slider disabled={!animationEnded}  value={animationEnded ? time : maxTime} min={animationEnded ? 0 : -1} max={maxTime} onChange={(e) => {timeChanged(Number(e.target.value));}} className="slider" aria-labelledby="playback-slider" />
                </div>
                <IconButton disabled={!canStart} onClick={handlePlay} style={{ backgroundColor: "#46B780", width: 60, height: 60 }} size="large">
                    {(!started || animationEnded && !playbackOn) 
                        ? <PlayArrow style={{ color: "#fff", width: 26, height: 26 }} fontSize="inherit" />
                        : <Pause style={{ color: "#fff", width: 26, height: 26 }} fontSize="inherit" />
                    }
                </IconButton>
                <div className="side">
                    <Button disabled={!animationEnded && started} onClick={clearPath} style={{ color: "#fff", backgroundColor: "#404156", paddingInline: 30, paddingBlock: 7 }} variant="contained">Clear path</Button>
                </div>
            </div>

            <div className={`nav-right ${cinematic ? "cinematic" : ""}`}>
                <Tooltip title="Open settings">
                    <IconButton onClick={() => {setSidebar(true);}} style={{ backgroundColor: "#2A2B37", width: 36, height: 36 }} size="large">
                        <Settings style={{ color: "#fff", width: 24, height: 24 }} fontSize="inherit" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Cinematic mode">
                    <IconButton className="btn-cinematic" onClick={() => {setCinematic(!cinematic);}} style={{ backgroundColor: "#2A2B37", width: 36, height: 36 }} size="large">
                        <Movie style={{ color: "#fff", width: 24, height: 24 }} fontSize="inherit" />
                    </IconButton>
                </Tooltip>
            </div>

            <div className="loader-container">
                <Fade
                    in={loading}
                    style={{
                        transitionDelay: loading ? "50ms" : "0ms",
                    }}
                    unmountOnExit
                >
                    <CircularProgress color="inherit" />
                </Fade>
            </div>

            <Snackbar 
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }} 
                open={snack.open} 
                autoHideDuration={4000} 
                onClose={closeSnack}>
                <Alert 
                    onClose={closeSnack} 
                    severity={snack.type} 
                    style={{ width: "100%", color: "#fff" }}
                >
                    {snack.message}
                </Alert>
            </Snackbar>

            <Snackbar 
                anchorOrigin={{ vertical: "top", horizontal: "center" }} 
                open={helper} 
                autoHideDuration={helperTime.current} 
                onClose={closeHelper}
            >
                <div className="cinematic-alert">
                    <Typography fontSize="18px"><b>Cinematic mode</b></Typography>
                    <Typography>Use keyboard shortcuts to control animation</Typography>
                    <Typography>Press <b>Escape</b> to exit</Typography>
                </div>
            </Snackbar>

            <div className="mobile-controls">
                <Button onClick={() => {setPlaceEnd(!placeEnd);}} style={{ color: "#fff", backgroundColor: "#404156", paddingInline: 30, paddingBlock: 7 }} variant="contained">
                    {placeEnd ? "placing end node" : "placing start node"}
                </Button>
            </div>

            <Backdrop
                open={showTutorial}
                onClick={e => {if(e.target.classList.contains("backdrop")) setShowTutorial(false);}}
                className="backdrop"
            >
                <div className="tutorial-container">
                    <Stepper activeStep={activeStep}>
                        <Step>
                            <StepLabel>Basic controls</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Playback controls</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Changing settings</StepLabel>
                        </Step>
                    </Stepper>
                    <div className="content">
                        <h1>Map Pathfinding Visualizer</h1>
                        {activeStep === 0 && <div>
                            <p>
                                <b>Controls:</b> <br/>
                                <b>Left button:</b> Place start node <br/>
                                <b>Right button:</b> Place end node <br/>
                            </p>
                            <p>The end node must be placed within the shown radius.</p>
                            <video className="video" autoPlay muted loop>
                                <source src="./videos/tutorial1.mp4" type="video/mp4"/>
                            </video>
                        </div>}
                        {activeStep === 1 && <div>
                            <p>
                                To start the visualization, press the <b>Start Button</b> or press <b>Space</b>.<br/>
                                A playback feature is available after the algorithm ends.
                            </p>
                            <video className="video" autoPlay muted loop>
                                <source src="./videos/tutorial2.mp4" type="video/mp4"/>
                            </video>
                        </div>}
                        {activeStep === 2 && <div>
                            <p>
                                You can customize the settings of the animation in the <b>Settings Sidebar</b>. <br/>
                                Try to keep the area radius only as large as you need it to be. <br/>
                                Anything above <b>10km</b> is considered experimental, if you run into performance issues, stop the animation and clear the path.
                            </p>
                            <video className="video" autoPlay muted loop>
                                <source src="./videos/tutorial3.mp4" type="video/mp4"/>
                            </video>
                        </div>}
                    </div>
                    <div className="controls">
                        <Button onClick={() => {setShowTutorial(false);}}
                            className="close" variant="outlined" style={{ borderColor: "#9f9f9f", color: "#9f9f9f", paddingInline: 15 }}
                        >
                            Close
                        </Button>
                        <Button onClick={() => {handleTutorialChange(-1);}}
                            variant="outlined" style={{ borderColor: "#9f9f9f", color: "#9f9f9f", paddingInline: 18 }}
                        >
                                Back
                        </Button>
                        <Button onClick={() => {handleTutorialChange(1);}}
                            variant="contained" style={{ backgroundColor: "#46B780", color: "#fff", paddingInline: 30, fontWeight: "bold" }}
                        >
                            {activeStep >= 2 ? "Finish" : "Next"}
                        </Button>
                    </div>
                </div>
            </Backdrop>

            <Drawer
                className={`side-drawer ${cinematic ? "cinematic" : ""}`}
                anchor="left"
                open={sidebar}
                onClose={() => {setSidebar(false);}}
            >
                <div className="sidebar-container">
                    {/* Algorithm selector */}
                    <div className="settings-section">
                        <Typography style={{ fontSize: 12, color: "#A8AFB3", textTransform: "uppercase", marginBottom: 8 }}>Algorithm</Typography>
                        <FormControl variant="filled" fullWidth size="small">
                            <Select
                                value={settings.algorithm}
                                onChange={e => {changeAlgorithm(e.target.value);}}
                                style={{ backgroundColor: "#404156", color: "#fff" }}
                                disabled={!animationEnded && started}
                            >
                                <MenuItem value={"astar"}>A* Algorithm</MenuItem>
                                <MenuItem value={"bfs"}>Breadth-first Search</MenuItem>
                                <MenuItem value={"greedy"}>Greedy Search</MenuItem>
                                <MenuItem value={"dijkstra"}>Dijkstra</MenuItem>
                                <MenuItem value={"bidirectional"}>Bidirectional</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Quick locations */}
                    <div className="settings-section">
                        <Typography style={{ fontSize: 12, color: "#A8AFB3", textTransform: "uppercase", marginBottom: 8 }}>Location</Typography>
                        <Select
                            value=""
                            onChange={(e) => {
                                const loc = LOCATIONS.find(l => l.name === e.target.value);
                                if(loc) changeLocation(loc);
                            }}
                            style={{ backgroundColor: "#404156", color: "#fff" }}
                            displayEmpty
                            fullWidth
                            size="small"
                        >
                            <MenuItem value="" disabled>Select location...</MenuItem>
                            {LOCATIONS.map(location => 
                                <MenuItem key={location.name} value={location.name}>{location.name}</MenuItem>
                            )}
                        </Select>
                    </div>

                    {/* Area radius slider */}
                    <div className="settings-section">
                        <Typography style={{ fontSize: 12, color: "#A8AFB3", textTransform: "uppercase", marginBottom: 8 }}>Area Radius</Typography>
                        <Typography style={{ fontSize: 14, marginBottom: 8 }}>{settings.radius}km</Typography>
                        <Slider disabled={started && !animationEnded} min={2} max={20} step={1} value={settings.radius} onChangeCommitted={() => { changeRadius(settings.radius); }} onChange={e => { setSettings({...settings, radius: Number(e.target.value)}); }} />
                    </div>

                    {/* Animation speed slider */}
                    <div className="settings-section">
                        <Typography style={{ fontSize: 12, color: "#A8AFB3", textTransform: "uppercase", marginBottom: 8 }}>Speed</Typography>
                        <Typography style={{ fontSize: 14, marginBottom: 8 }}>{settings.speed}x</Typography>
                        <Slider min={1} max={30} value={settings.speed} onChange={e => { setSettings({...settings, speed: Number(e.target.value)}); }} />
                    </div>

                    {/* Color customization - collapsible */}
                    <div className="settings-section">
                        <Typography style={{ fontSize: 12, color: "#A8AFB3", textTransform: "uppercase", marginBottom: 12, cursor: "pointer" }}>Colors</Typography>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <div>
                                <Typography style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>Start</Typography>
                                <div style={{ display: "flex", gap: 4 }}>
                                    <MuiColorInput size="small" value={arrayToRgb(colors.startNodeFill)} onChange={v => {setColors({...colors, startNodeFill: rgbToArray(v)});}} />
                                </div>
                            </div>
                            <div>
                                <Typography style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>End</Typography>
                                <div style={{ display: "flex", gap: 4 }}>
                                    <MuiColorInput size="small" value={arrayToRgb(colors.endNodeFill)} onChange={v => {setColors({...colors, endNodeFill: rgbToArray(v)});}} />
                                </div>
                            </div>
                            <div>
                                <Typography style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>Path</Typography>
                                <div style={{ display: "flex", gap: 4 }}>
                                    <MuiColorInput size="small" value={arrayToRgb(colors.path)} onChange={v => {setColors({...colors, path: rgbToArray(v)});}} />
                                </div>
                            </div>
                            <div>
                                <Typography style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>Route</Typography>
                                <div style={{ display: "flex", gap: 4 }}>
                                    <MuiColorInput size="small" value={arrayToRgb(colors.route)} onChange={v => {setColors({...colors, route: rgbToArray(v)});}} />
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => {setColors(INITIAL_COLORS);}} variant="text" size="small" style={{ marginTop: 8, color: "#46B780" }}>Reset Colors</Button>
                    </div>

                    <div style={{ flex: 1 }}></div>

                    {/* Help section */}
                    <div className="settings-section">
                        <Button onClick={() => {setActiveStep(0);setShowTutorial(true);}} variant="contained" fullWidth style={{ backgroundColor: "#404156", color: "#fff", textTransform: "none" }}>
                            Show Guide
                        </Button>
                    </div>
                </div>
            </Drawer>
        </>
    );
});

Interface.displayName = "Interface";

export default Interface;
