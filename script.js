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
                    } catch {}                
                
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

            $(".scanTrail").show();
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
});