$(function() {
    scanner = new Instascan.Scanner({video: $("#scanner")[0]});

    scanner.addListener("scan", function(content) {
        $("#lens").css("background-color", "rgba(95, 237, 83, 0.4)");

        setTimeout(function() {
            $("#lens").css("background-color", "rgba(255, 255, 255, 0.4)");

            setTimeout(function() {
                window.location.href = "content.html?scanData=" + encodeURIComponent(content);
            }, 500);
        }, 500);
    });

    Instascan.Camera.getCameras().then(function(cameras) {
        if (cameras.length > 0) {
            if (cameras.length > 1) {
                scanner.start(cameras[1]);

                camera = 1;
            } else {
                scanner.start(cameras[0]);

                camera = 0;
            }
        } else {
            alert("No cameras found, so you won't be able to scan anything. Sorry!");
        }
    });
});