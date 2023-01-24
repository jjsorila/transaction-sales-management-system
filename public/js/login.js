$(function() {
    const username = $("#username")
    const password = $("#password")
    const email = $("#email")

    function clearInput() {
        username.val("")
        password.val("")
        email.val("")
    }

    $("#login").click(function() {

        if(!username.val() || !password.val()) return toastr.warning("Complete all fields!")

        $(".loading").css({
            display: "block"
        })

        $.ajax({
            type: "POST",
            url: "/api/login",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                username: username.val(),
                password: password.val()
            }),
            success: (res) => {
                if(!res.operation) return toastr.error(res.msg)
                return location.replace("/dashboard")
            },
            error: (error) => {
                toastr.error("Server error")
                console.log(error)
            },
            complete: () => {
                $(".loading").css({
                    display: "none"
                })
            }
        })
    })

    $("#send-link").click(function() {
        if(!email.val()) return toastr.warning("Complete all fields!");

        $(".loading").css({
            display: "block"
        })

        $.ajax({
            url: "/api/reset",
            type: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                email: email.val()
            }),
            success: (res) => {
                if(!res.operation) return toastr.warning("Invalid email!")
                clearInput()
                $(".shadow").fadeToggle("fast")
                return toastr.success(res.msg)
            },
            error: (error) => {
                toastr.error("Server error")
                console.log(error)
            },
            complete: () => {
                $(".loading").css({
                    display: "none"
                })
            }
        })
    })

    $("#show").change(function() {
        if($(this).prop("checked")){
            password.attr("type", "text")
        }else {
            password.attr("type", "password")
        }
    })

    $("#reset").click(function(e) {
        return toastr.error("Sending reset password link temporarily disabled")
        $(".shadow").fadeToggle("fast")
        clearInput()
    })

    $(".shadow").click(function(e) {
        $(this).fadeToggle("fast")
    })

    $(".reset-form").click(function(e) {
        e.stopPropagation();
    })
})