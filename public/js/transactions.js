$(function () {
    const recipient = $("#recipient")
    const quantity = $("#quantity")
    const unit_price = $("#unit_price")
    const transaction_date = $("#transaction_date")
    const id_handler = $("#handler")

    function clearInput() {
        recipient.val("")
        quantity.val("")
        unit_price.val("")
        transaction_date.val("")
    }

    $("#daterange").on("keypress keyup keydown",function(e) {
        e.preventDefault()
    })

    let table = $("#dataTable").DataTable({
        ajax: '/api/transactions',
        responsive: true,
        lengthMenu: [[10, 20, 30, 50, -1], [10, 20, 30, 50, "All"]],
        "headerCallback": function(thead) {
            $(thead).find("th").addClass("text-center")
        },
        ordering: false,
        columns: [
            {
                title: "RECIPIENT",
                data: "recipient",
                responsivePriority: 1
            },
            {
                title: "QUANTITY",
                data: "quantity",
                responsivePriority: 2
            },
            {
                title: "PRICE PER UNIT",
                data: "unit_price",
                render: (price) => {
                    return `₱ ${price}`
                },
                responsivePriority: 3
            },
            {
                title: "TOTAL PRICE",
                data: "total_price",
                render: (price) => {
                    return `₱ ${price}`
                },
                responsivePriority: 4
            },
            {
                title: "DATE",
                data: "transaction_date",
                responsivePriority: 5
            },
            {
                title: "ACTIONS",
                data: "transaction_id",
                render: (id) => {
                    return `
                    <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                        <button type="button" id="${id}" class="btn btn-warning border border-dark border-3 print">PRINT</button>
                        <button type="button" id="${id}" class="btn btn-danger border border-dark border-3 delete">DELETE</button>
                    </div>
                    `
                },
                responsivePriority: 6
            }
        ],
        "fnInitComplete": (settings, { data }) => {
            let total = 0
            data.forEach((expense, index) => {
                const { unit_price, quantity } = expense
                total += (quantity * unit_price)
            })

            $(".total").text(`Total Income: ₱ ${total}`)
        }
    })

    $("#add-expense").click(function () {
        if (!recipient.val() || !quantity.val() || !unit_price.val() || !transaction_date.val()) return toastr.warning("Complete all fields")

        $(".loading").css({
            display: "block"
        })

        $.ajax({
            url: "/api/transaction/add",
            type: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                recipient: recipient.val(),
                quantity: quantity.val(),
                unit_price: unit_price.val(),
                transaction_date: transaction_date.val()
            }),
            success: (res) => {
                table.ajax.reload(function ({ data }) {
                    let total = 0
                    data.forEach((expense, index) => {
                        const { unit_price, quantity } = expense
                        total += (quantity * unit_price)
                    })
                    $(".total").text(`Total Income: ₱ ${total}`)
                })
                clearInput()
                return toastr.success(res.msg)
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

    $("table").on("click", ".delete", function() {
        id_handler.val($(this).prop("id"))
        $(".c-warning").fadeToggle("fast")
    })

    $("#warning-yes").click(function() {
        const id = id_handler.val()
        $(".loading").css({
            display: "block"
        })

        $.ajax({
            url: `/api/transaction/${id}`,
            type: "DELETE",
            success: (res) => {
                table.ajax.reload(function ({ data }) {
                    let total = 0
                    data.forEach((expense, index) => {
                        const { unit_price, quantity } = expense
                        total += (quantity * unit_price)
                    })
                    $(".total").text(`Total Income: ₱ ${total}`)
                })
                $(".c-warning").fadeToggle("fast")
                return toastr.success(res.msg)
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

    $("#warning-no").click(function() {
        $(".c-warning").fadeToggle("fast")
    })

    $("#dataTable").on("click", ".print", function() {
        const id = $(this).prop("id")

        $(".loading").css({
            display: "block"
        })

        $.ajax({
            url: `/api/transaction/${id}`,
            type: "GET",
            success: (res) => {
                $("#p-date").text(`Transaction Date: ${moment(res.transaction_date).format("MMM D, YYYY")}`)
                $("#p-recipient").text(`Recipient: ${res.recipient}`)
                $("#p-quantity").text(`Quantity: ${res.quantity}`)
                $("#p-unit_price").text(`Unit Price: ${res.unit_price}`)
                $("#p-total_price").text(`Total Price: ${res.total_price}`)
                window.print();
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

    $("#daterange").daterangepicker();

    $("#daterange").change(function() {
        $(".loading").css({
            display: "block"
        })

        const range = $(this).val().split("-").map((val) => {
            return moment(val.trim()).format("YYYY-MM-DD")
        })

        let start = range[0]
        let end = range[1]


        table.ajax.url(`/api/transactions/range?start=${start}&end=${end}`).load($(".loading").css({
            display: "none"
        }))

    })

})