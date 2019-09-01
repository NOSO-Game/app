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

    if (getURLParameter("data") != null) {
        $(".scanContent").text(getURLParameter("data"));
    }
});