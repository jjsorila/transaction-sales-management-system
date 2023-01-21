$(function () {
    const badge = $("#badge");
    const event_date = $("#event_date");
    const desc = $("#desc");
    const username = $("meta[name=username]").attr("content")
    const event_index = $("#index-holder");

    function clearInput() {
        badge.val("")
        event_date.val("")
        desc.val("")
    }

    $(".loading").css({
        display: "block"
    })

    //INITIALIZE EVENTS
    $.ajax({
        url: `/api/event/get?username=${username}`,
        type: "GET",
        success: (res) => {

            const parsed = res.map((e) => ({
                id: e.id,
                description: e.description,
                name: e.badge,
                date: e.event_date,
                type: 'holiday'
            }))

            $('#calendar').evoCalendar({
                'sidebarDisplayDefault': false,
                'theme': 'Midnight Blue',
                'calendarEvents': parsed
            });
        },
        error: (error) => {
            toastr.error("Server Error")
            console.log(error)
        },
        complete: () => {
            $(".loading").css({
                display: "none"
            })
        }
    })

    $("#add").click(function () {
        $(".event-shadow").fadeToggle("fast")
    })

    //REMOVE EVENT
    $("#remove").click(function() {
        if(!event_index.val()) return toastr.warning("Select event to remove")

        $(".loading").css({
            display: "block"
        })

        $.ajax({
            url: `/api/event/delete?event_id=${event_index.val()}`,
            type: "DELETE",
            success: (res) => {
                if(!res.operation) return toastr.warning("Something went wrong")
                toastr.success(res.msg)
                $('#calendar').evoCalendar('removeCalendarEvent', event_index.val());
            },
            error: (err) => {
                toastr.error("Server Error")
                console.log(err)
            },
            complete: () => {
                $(".loading").css({
                    display: "none"
                })
            }
        })
    })

    //ADD EVENT
    $("#submit-add").click(function () {
        if (!badge.val() || !event_date.val() || !desc.val()) return toastr.warning("Complete all fields!")

        $(".loading").css({
            display: "block"
        })

        $.ajax({
            url: "/api/event/add",
            type: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                username: username,
                badge: badge.val(),
                event_date: event_date.val(),
                desc: desc.val()
            }),
            success: (res) => {
                toastr.success(res.msg)
                location.reload()
            },
            error: (err) => {
                toastr.success("Server Error")
                console.log(err)
            },
            complete: () => {
                $(".loading").css({
                    display: "none"
                })
            }
        })
    })

    $(".event-shadow").click(function () {
        $(this).fadeToggle("fast")
        clearInput()
    })

    $(".event-form").click(function (e) {
        e.stopPropagation()
    })

    //GET EVENT ID
    $("#calendar").on("click",".event-container", function(e) {
        toastr.success("Event selected!")
        event_index.val($(this)[0].dataset.eventIndex)
    })
})