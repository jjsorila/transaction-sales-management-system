$(function () {
    const recipient = $("#recipient")
    const quantity = $("#quantity")
    const unit_price = $("#unit_price")
    const transaction_date = $("#transaction_date")

    function clearInput() {
        recipient.val("")
        quantity.val("")
        unit_price.val("")
        transaction_date.val("")
    }

    $("#daterange").on("keypress keyup keydown",function(e) {
        e.preventDefault()
    })

    $("#dataTable").DataTable({
        ajax: '/api/transactions',
        lengthMenu: [[10, 20, 30, 50, -1], [10, 20, 30, 50, "All"]],
        ordering: false,
        columns: [
            {
                data: "recipient"
            },
            {
                data: "quantity"
            },
            {
                data: "unit_price",
                render: (price) => {
                    return `₱ ${price}`
                }
            },
            {
                data: "total_price",
                render: (price) => {
                    return `₱ ${price}`
                }
            },
            {
                data: "transaction_date"
            },
            {
                data: "transaction_id",
                render: (id) => {
                    return `
                    <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                        <button type="button" id="${id}" class="btn btn-warning border border-dark border-3 print">PRINT</button>
                        <button type="button" id="${id}" class="btn btn-danger border border-dark border-3 delete">DELETE</button>
                    </div>
                    `
                }
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
                $("#dataTable").DataTable().ajax.reload(function ({ data }) {
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
        const id = $(this).prop("id")
        $(".loading").css({
            display: "block"
        })

        $.ajax({
            url: `/api/transaction/${id}`,
            type: "DELETE",
            success: (res) => {
                $("#dataTable").DataTable().ajax.reload(function ({ data }) {
                    let total = 0
                    data.forEach((expense, index) => {
                        const { unit_price, quantity } = expense
                        total += (quantity * unit_price)
                    })
                    $(".total").text(`Total Income: ₱ ${total}`)
                })
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


        $("#dataTable").DataTable({
            ajax: `/api/transactions/range?start=${start}&end=${end}`,
            lengthMenu: [[10, 20, 30, 50, -1], [10, 20, 30, 50, "All"]],
            ordering: false,
            columns: [
                {
                    data: "recipient"
                },
                {
                    data: "quantity"
                },
                {
                    data: "unit_price",
                    render: (price) => {
                        return `₱ ${price}`
                    }
                },
                {
                    data: "total_price",
                    render: (price) => {
                        return `₱ ${price}`
                    }
                },
                {
                    data: "transaction_date"
                },
                {
                    data: "transaction_id",
                    render: (id) => {
                        return `
                        <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                            <button type="button" id="${id}" class="btn btn-warning border border-dark border-3 print">PRINT</button>
                            <button type="button" id="${id}" class="btn btn-danger border border-dark border-3 delete">DELETE</button>
                        </div>
                        `
                    }
                }
            ],
            "fnInitComplete": (settings, { data }) => {
                let total = 0
                data.forEach((expense, index) => {
                    const { unit_price, quantity } = expense
                    total += (quantity * unit_price)
                })

                $(".total").text(`Total Income: ₱ ${total}`)

                $(".loading").css({
                    display: "none"
                })
            },
            destroy: true
        })

    })

})