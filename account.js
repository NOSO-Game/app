function getURLParameter(name) {
    return decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) || null;
}

function change(user) {
    if (user && user.uid != null) {
        // Sign in operation.
        $("#signIn").css("display", "none");
        $("#signUp").css("display", "none");

        $(".signedIn").css("display", "block");
        $(".notSignedIn").css("display", "none");

        firebase.database().ref("users/" + user.uid + "/_settings/name").on("value", function(snapshot) {
            $(".accountName").text(snapshot.val());
        });
    } else {
        // Sign out operation.
        $("#signIn").css("display", "block");
        $("#signUp").css("display", "none");

        $(".signedIn").css("display", "none");
        $(".notSignedIn").css("display", "block");
    }
}

var currentUid = null;
var signingUp = false;

function setName(data) {
    if (profanity.clean(data) != "") {
        firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/_settings/name").set(profanity.clean(data));
    } else {
        firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/_settings/name").set("Anonymous");
    }
}

function checkFields() {
    if ($("#user").val() != "" && $("#pass").val() != "") {
        return true;
    } else {
        document.getElementById("error").innerHTML = "Oops! You have not filled out all of the required fields.";
        return false;
    }
}

function checkUsername() {
    if ($("#name").val() != "") {
        return true;
    } else {
        document.getElementById("error").innerHTML = "Oops! You have not filled out all of the required fields.";
        return false;
    }
}

function signIn() {
    document.getElementById("error").innerHTML = "";
    if (checkFields()) {
        firebase.auth().signInWithEmailAndPassword($("#user").val(), $("#pass").val()).catch(function(error) {
            document.getElementById("error").innerHTML = "Oops! " + error.message;
        });
    }
}

function signOutBefore() {
    document.getElementById("error").innerHTML = "";

    if (checkFields()) {
        $("#signIn").css("display", "none");
        $("#signUp").css("display", "block");
    }
}

function signUp() {
    document.getElementById("error").innerHTML = "";
    if (checkUsername()) {
        firebase.auth().createUserWithEmailAndPassword($("#user").val(), $("#pass").val()).then(function() {signingUp = true;}).catch(function(error) {
            document.getElementById("error").innerHTML = "Oops! " + error.message;
        });
    }
}

function signOut() {
    $(".accountName").css("color", "white");
    $(".adminBanner").hide();

    document.getElementById("error").innerHTML = "";

    firebase.auth().signOut().then(function() {
        window.location.reload();
    }).catch(function(error) {
        document.getElementById("error").innerHTML = "Oops! Something went wrong on our side. Try again soon!";
    });
}

function reset() {
    $("#signIn").css("display", "block");
    $("#signUp").css("display", "none");
}

$(function() {
    var input = document.getElementById("pass");

    try {
        input.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                signIn();
            }
        });
    } catch (e) {}

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {currentUid = user.uid;} else {currentUid = null;}

        // Checks if user auth state has changed.
        if (!signingUp) {
            change(user);
        } else {
            firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/_settings/name").set(profanity.clean($("#name").val().substring(0, 20))).then(function() {
                window.location.href = "index.html";
            });
        }

        if (getURLParameter("go") != null && window.location.pathname.split("/").pop() == "account.html" && user) {
            window.location.href = getURLParameter("go");
        }
    });
});