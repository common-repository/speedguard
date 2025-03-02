/**
 * SpeedGuard JavaScript for Admin
 */
document.addEventListener(
    'DOMContentLoaded',
    () => {
        // Add SG headers to the default WP list table
        addSGHeadersToTable();

        // Mark scores with colors
        markScoresWithColors();

        // Fix metaboxes open/close funcitonality
        fixMetaboxesOpenCloseFunctionality();

        // Initialize YouTube API
        initializeYouTubeAPI();

    }
);

function addSGHeadersToTable() {
    // Adding SG headers to the default WP list table
    //test-type-psi
    const table = document.querySelector("table.toplevel_page_speedguard_tests");
    if (null === table) {
        return;
    }
    const thead = table.getElementsByTagName("thead")[0];


    const testTypeRow = document.createElement("tr");
    if (table.classList.contains('psi-test-type')) {
        // console.log('it does psi!');
        testTypeRow.innerHTML = '< th colspan      = "2" > < / th > < th colspan      = "2" class = "test-type-thead psi-mobile"> PSI < / th > < th colspan      = "2" class = "test-type-thead psi-desktop" > PSI < / th >';
        var column_count = 2;
    }

    if (table.classList.contains('cwv-test-type')) {
        // console.log('it does cwv!');
        testTypeRow.innerHTML = '< th colspan      = "2" > < / th > < th colspan      = "3" class ="test-type-thead cwv-mobile" > CWV < / th > < th colspan      = "3" class = "test-type-thead cwv-desktop" > CWV < / th > ';
        var column_count = 3;
    }

    // For Debugging Only    thead.prepend(testTypeRow);
    const deviceRow = document.createElement("tr");
    deviceRow.innerHTML = "<th colspan='2'></th><th class='mobile' colspan='" + column_count + "'><i class='sg-device-column mobile' aria-hidden='true' title='Mobile'></i></th><th class='desktop' colspan='" + column_count + "'><i class='sg-device-column desktop' aria-hidden='true' title='Desktop'></i></th><th colspan='1'></th>";
    thead.prepend(deviceRow);


}


function markScoresWithColors() {
    const testscore = document.querySelectorAll(".speedguard-score");
    testscore.forEach((testScore) => {
        const dataCategory = testScore.getAttribute("data-score-category");
        // check if datacategory is not empty not assign automatically only in cases when it's not defined
        if (!dataCategory) {
            return;
        }

        if (dataCategory > 0.7 || dataCategory === "FAST") {
            testScore.classList.add("score-green");
        } else if (dataCategory > 0.4 || dataCategory === "AVERAGE") {
            testScore.classList.add("score-yellow");
        } else {
            testScore.classList.add("score-red");
        }
    });
}

function fixMetaboxesOpenCloseFunctionality() {
    const metaboxes = document.querySelectorAll(".postbox");
    metaboxes.forEach((metabox) => {
        const toggleButton = metabox.querySelector(".handlediv");
        toggleButton.addEventListener(
            "click",
            () => {
                metabox.classList.toggle("closed");
            }
        );
    });
}


function initializeYouTubeAPI() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: '5Rq3qvySKtI', // YouTube Video ID
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    setHighestQuality();
    setupFullscreenQualityAdjustment();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        setHighestQuality();
    }
}

function setHighestQuality() {
    const qualities = player.getAvailableQualityLevels();
    if (qualities.length > 0) {
        player.setPlaybackQuality(qualities[0]); // Set to the highest available quality
    }
}

function setupFullscreenQualityAdjustment() {
    const playerElement = document.getElementById('player').contentWindow;

    if (playerElement) {
        ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event => {
            window.addEventListener(event, onFullscreenChange);
        });
    }
}

function onFullscreenChange() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        setTimeout(setHighestQuality, 500); // Slight delay to ensure it catches the fullscreen mode change
    }
}

function setCurrentTime(slideNum) {
    const timecodes = [ 0, 75, 198, 310, 575, 660, 740 ];
    if (player && timecodes[slideNum] !== undefined) {
        player.seekTo(timecodes[slideNum]);
    }
}