var saveMembershipData = "";

function getURLParameter(name) {
    return decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) || null;
}

function saveMembership() {
    $("#saveMembershipButton").attr("disabled", "true");

    firebase.database().ref("users/" + currentUid + "/membership").set(saveMembershipData).then(function() {
        window.location.href = "index.html";
    }).error(function() {
        alert("Sorry, an error occured! Please try again later.");
    });
}

function deleteMembership() {
    $("#deleteMembershipButton").attr("disabled", "true");

    firebase.database().ref("users/" + currentUid + "/membership").set(null).then(function() {
        window.location.href = "index.html";
    }).error(function() {
        alert("Sorry, an error occured! Please try again later.");
    });
}

$(function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            firebase.database().ref("users/" + currentUid + "/membership").once("value", function(snapshot) {
                var membership = snapshot.val();

                if (membership == null) {
                    $(".membershipAlert").show();
                    $(".membershipInfo").hide();
                } else {
                    try {
                        var qrCode = new QRCode("qrCode");

                        qrCode.makeCode(membership);
                    } catch (e) {if (getURLParameter("debug") == "true") {alert(e);}}                
                
                    $(".membershipContent").text(membership);

                    $(".membershipAlert").hide();
                    $(".membershipInfo").show();
                }
            });
        }
    });

    if (getURLParameter("scanData") != null) {
        var data = getURLParameter("scanData");

        if (data.startsWith("noso:trail,")) {
            // Trail

            try {
            var trailNumber = data.split(",")[1].trim();
            var trailText = "";

            if (trailNumber == "1") {
                trailText = "Welcome to the official NOSO™CON™ trail! To continue, you’ll need to find the secret lair where the NOSO™ developers hide!";
            } else if (trailNumber == "2") {
                trailText = "Here’s where the NOSO™ developers hide! It is usually a top-secret zone where the organisers of NOSO™CON™ plan their events. In here, plenty of coding gets done, including the coding made precisely for this trail!<br><br>Speaking of this trail, let’s go to number 3: the place where all of the NOSO™ food gets cooked up every day! You’ll need to find the code behind the hob…";
            } else if (trailNumber == "3") {
                trailText = "So here’s the place where lots of tasty NOSO™ food gets cooked up every day! The food is delicious, and some of the drinks have been made for you to enjoy here at NOSO™CON™!<br><br>Now we’re going to be going to the place where the dishes get scrubbed and washed, and where NTombi has her food and drink!";
            } else if (trailNumber == "4") {
                trailText = "So here’s where the dishes get scrubbed and washed after a good meal! You’ll need to go outside for the next one, so put your shoes on and head out through the door!<br><br>Keep your eyes peeled for the big tree with loads of hoses on it! There’s a code hidden there.";
            } else if (trailNumber == "5") {
                trailText = "So this tree is very old! The tree has got hoses attached to it so you can climb it. Don’t worry; you won’t need to climb the tree today!<br><br>Now time to go to the small building where Forg sleeps! The building should be found at the other side of the green grass.";
            } else if (trailNumber == "6") {
                trailText = "Here’s the place where the almighty Forg takes a nap! He enjoys the comfort of this building, as it is small enough and comfy.<br><br>It’s not just Forg who likes to take a nap every now and then, Ben and Issy like to take a nap too! You’ll need to cross the grass and find the dangly tree where there is a small garden shed fit for two adventurers!";
            } else if (trailNumber == "7") {
                trailText = "This is where the adventurers Ben and Issy like to sleep! Every night they like to tuck into this little abode. In the morning, they like to sneak over to the main house and find the NOSO™s!<br><br>To find the NOSO™s yourself, you’ll need to go to the main house (enter by the door on the left by the tree). Then, go upstairs to the landing!";
            } else if (trailNumber == "8") {
                trailText = "This landing is famous for its popularity of NOSO™s! There are many NOSO™s, but there’s one we really need to find: Neeka, the main NOSO™!<br><br>Find the bedroom in the middle to the right to the desk, and open the door. That’s where Neeka awaits!";
            } else if (trailNumber == "9") {
                trailText = "Is Neeka sitting next to the code you scanned? If so, you win the trail! Take Neeka with you and bring him downstairs to the NOSO™CON™ event room.<br><br>If he isn’t sitting next to the code, sorry but someone took him first! Don’t worry, there are drinks in the NOSO™CON™ event room for you to enjoy!";
            } else if (trailNumber == "10") {
                trailText = "Thanks for playing the NOSO™CON™ official trail! We hope you enjoyed the trail very much! Come again soon for NOSO™CON™ 2020 or even another one this year!";
            } else {
                trailText = "Hmm, this trail number seems incorrect. Please try another trail number!";
            }

            $(".trailNumber").text(trailNumber);
            $(".trailText").html(trailText);

            $(".scanTrail").show();
            } catch {
                $(".scanError").show();
            }
        } else if (
            data.split("\n").length == 3 &&
            (
                /.*\nPurchased: \d\d\.\d\d\.\d\d\nCard Expires: \d\d\.\d\d\.\d\d/g.test(data) ||
                /.*\nPurchased: \d\d\.\d\d\.\d\d\nExpiry: \d\d\.\d\d\.\d\d/g.test(data)
            )
        ) {
            // Membership

            var qrCode = new QRCode("qrCode");

            $(".scanContent").text(data);

            qrCode.makeCode(data);

            saveMembershipData = data;

            $(".scanMembership").show();
        } else {
            $(".scanError").show();
        }
    }

    try {
        $("#scanner").attr("playsinline", "true");
        $("#scanner").attr("controls", "true");

        setTimeout(function() {
            $("#scanner").removeAttr("controls");
        });
    } catch (e) {if (getURLParameter("debug") == "true") {alert(e);}}
});