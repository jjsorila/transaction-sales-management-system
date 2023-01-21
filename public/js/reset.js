$(function() {
    const password = $("#password");
    const cPassword = $("#cPassword");
    const email = $("#email")

    function clearInput() {
        password.val("")
        cPassword.val("")
        email.val("")
    }

    $("#reset").click(function(e) {

        if(!password.val() || !cPassword.val()) return toastr.warning("Complete all fields!")

        if(password.val() != cPassword.val()) return toastr.warning("Password not matched!")

        $(".loading").css({
            display: "block"
        })

        $.ajax({
            url: "/api/reset",
            type: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                password: password.val(),
                email: email.val()
            }),
            success: (res) => {
                if(!res.operation) return toastr.error(res.msg)
                location.replace("/")
            },
            error: (err) => {
                console.log(err)
                toastr.error("Server Error!")
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
            $("#password,#cPassword").attr("type", "text")
        }else {
            $("#password,#cPassword").attr("type", "password")
        }
    })
})