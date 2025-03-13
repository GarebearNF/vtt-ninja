Hooks.once("init", () => {
    console.log("VTT Ninja | Module Initialized");

    // Register module settings
    game.settings.register("vtt-ninja", "obsNinjaRoom", {
        name: "OBS Ninja Room Name",
        hint: "Set the base room name for OBS Ninja.",
        scope: "world",
        config: true,
        type: String,
        default: "MyGameRoom"
    });
});

Hooks.once("ready", () => {
    console.log("VTT Ninja | Ready");
    startVideoRelay();
});

function startVideoRelay() {
    console.log("VTT Ninja | Starting Video Relay");
    
    // Get Foundry's video elements
    const videoElements = document.querySelectorAll(".camera-view video");
    if (!videoElements.length) {
        console.warn("VTT Ninja | No video elements found");
        return;
    }

    // Get OBS Ninja room name from settings
    const roomName = game.settings.get("vtt-ninja", "obsNinjaRoom");
    
    videoElements.forEach((video, index) => {
        if (!video.srcObject) return;

        // Generate a unique push URL for each user
        const pushUrl = `https://vdo.ninja/?room=${roomName}&push=Player${index+1}&bitrate=0&codec=vp9,opus`;
        
        console.log(`OBS Ninja Integration | Relaying video to: ${pushUrl}`);

        // Create a MediaRecorder to push the stream
        relayStream(video.srcObject, pushUrl);
    });
}

function relayStream(stream, pushUrl) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pushUrl;
    document.body.appendChild(iframe);

    console.log(`VTT Ninja | Streaming to ${pushUrl}`);
}

// Debugging Panel for Latency Monitoring
Hooks.on("renderSidebar", async (app, html) => {
    if (!game.user.isGM) return;

    const debugButton = $("<button>OBS Ninja Debug</button>");
    debugButton.on("click", () => {
        new DebugWindow().render(true);
    });

    html.find("#settings-game").append(debugButton);
});

class DebugWindow extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: "OBS Ninja Debug",
            id: "obs-ninja-debug",
            template: "modules/vtt-ninja/templates/debug.html",
            width: 400,
            height: 300
        });
    }

    getData() {
        return {
            latency: "Latency data will be displayed here"
        };
    }
}
