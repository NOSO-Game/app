function getURLParameter(name) {
    return decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) || null;
}

$(function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            firebase.database().ref("users/" + currentUid + "/membership").once("value", function(snapshot) {
                var membership = snapshot.val();

                if (membership == null) {
                    $(".membershipAlert").show();
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

            $(".scanMembership").show();
        } else {
            $(".scanError").show();
        }
    }
});