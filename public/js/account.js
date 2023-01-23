$(function() {
    const e_email = $("#e-email")
    const e_password = $("#e-password")
    const a_username = $("#a-username")
    const a_email = $("#a-email")
    const a_password = $("#a-password")
    const user_holder = $("#user-holder")
    const id_handler = $("#handler")

    function clearInput(){
        e_email.val("")
        e_password.val("")
        a_username.val("")
        a_email.val("")
        a_password.val("")
    }

    //INITIALIZE DATATABLE
    $("#dataTable").DataTable({
        ajax: '/api/accounts/get',
        lengthMenu: [[10, 20, 30, 50, -1], [10, 20, 30, 50, "All"]],
        ordering: false,
        columns: [
            {
                data: "username"
            },
            {
                data: "email"
            },
            {
                data: "username",
                render: (username) => {
                    return `
                    <div class="btn-group" role="group">
                        <button type="button" id="${username}" class="btn btn-warning border border-dark border-3 edit">EDIT</button>
                        ${username == "admin" ? '' : `<button type="button" id="${username}" class="btn btn-danger border border-dark border-3 delete">DELETE</button>`}
                    </div>
                    `
                }
            }
        ]
    })

    $(".event-form").click(function(e) {
        e.stopPropagation()
    })

    $("#a-show-pass").change(function() {
        if($(this).prop("checked")){
            a_password.prop("type", "text")
        }else {
            a_password.prop("type", "password")
        }
    })

    $("#e-show-pass").change(function() {
        if($(this).prop("checked")){
            e_password.prop("type", "text")
        }else {
            e_password.prop("type", "password")
        }
    })

    //OPEN EDIT ACCOUNT
    $("table").on("click", ".edit", function() {
        const username = $(this).prop("id")

        $(".loading").css({
            display: "block"
        })

        user_holder.val(username)

        $.ajax({
            url: `/api/account/get?username=${username}`,
            type: 'GET',
            success: (res) => {
                const account = res[0]
                e_email.val(account.email)
                e_password.val("")
            },
            error: (error) => {
                toastr.success("Server Error")
                console.log(error)
            },
            complete: () => {
                $(".edit-shadow").fadeToggle("fast")
                $(".loading").css({
                    display: "none"
                })
            }
        })
    })
    //CLOSE EDIT ACCOUNT
    $(".edit-shadow").click(function() {
        $(this).fadeToggle("fast")
    })

    //EDIT ACCOUNT
    $("#submit-edit").click(function() {
        if(!e_email.val()) return toastr.warning("Email is required")

        $(".loading").css({
            display: "block"
        })

        $.ajax({
            url: "/api/account/edit",
            type: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                email: e_email.val(),
                password: e_password.val() || null,
                username: user_holder.val()
            }),
            success: (res) => {
                if(!res.operation) return toastr.error("Something went wrong")
                $("#dataTable").DataTable().ajax.reload()
                $(".edit-shadow").fadeToggle("fast")
                return toastr.success(res.msg)
            },
            error: (error) => {
                toastr.success("Server Error")
                console.log(error)
            },
            complete: () => {
                $(".loading").css({
                    display: "none"
                })
            }
        })
    })

    //DELETE ACCOUNT
    $("table").on("click", ".delete", function() {
        id_handler.val($(this).prop("id"))
        $(".c-warning").fadeToggle("fast")
    })
    $("#warning-yes").click(function() {
        const username = id_handler.val()
        $(".loading").css({
            display: "block"
        })

        $.ajax({
            url: `/api/account/delete?username=${username}`,
            type: "DELETE",
            success: (res) => {
                if(!res.operation) return toastr.error("Something went wrong")
                $("#dataTable").DataTable().ajax.reload()
                $(".c-warning").fadeToggle("fast")
                return toastr.success(res.msg)
            },
            error: (error) => {
                toastr.success("Server Error")
                console.log(error)
            },
            complete: () => {
                $(".loading").css({
                    display: "none"
                })
            }
        })
    })
    $("#warning-no").click(function() {
        $(".c-warning").fadeToggle("fast")
    })

    //ADD ACCOUNT
    $("#submit-add").click(function() {
        if(!a_email.val() || !a_username.val() || !a_password.val()) return toastr.warning("Complete all fields")

        $(".loading").css({
            display: "block"
        })

        $.ajax({
            url: "/api/account/add",
            type: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                email: a_email.val(),
                password: a_password.val(),
                username: a_username.val()
            }),
            success: (res) => {
                if(!res.operation) return toastr.error(res.msg)
                $("#dataTable").DataTable().ajax.reload()
                clearInput()
                $(".add-shadow").fadeToggle("fast")
                return toastr.success(res.msg)
            },
            error: (error) => {
                toastr.success("Server Error")
                console.log(error)
            },
            complete: () => {
                $(".loading").css({
                    display: "none"
                })
            }
        })
    })

    //OPEN/CLOSE ADD ACCOUNT
    $(".add-shadow,#add-account").click(function() {
        $(".add-shadow").fadeToggle("fast")
        clearInput()
    })
})