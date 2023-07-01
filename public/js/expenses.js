$(function () {
    const item = $("#item")
    const quantity = $("#quantity")
    const unit_price = $("#unit_price")
    const expense_date = $("#expense_date")
    const id_handler = $("#handler")

    function clearInput() {
        item.val("")
        quantity.val("")
        unit_price.val("")
        expense_date.val("")
    }

    $("#daterange").on("keypress keyup keydown",function(e) {
        e.preventDefault()
    })

    let table = $("#dataTable").DataTable({
        ajax: '/api/expenses',
        lengthMenu: [[10, 20, 30, 50, -1], [10, 20, 30, 50, "All"]],
        "headerCallback": function(thead) {
            $(thead).find("th").addClass("text-center")
        },
        responsive: true,
        ordering: false,
        columns: [
            {
                title: "ITEM",
                data: "item",
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
                data: "expense_date",
                responsivePriority: 5
            },
            {
                title: "ACTIONS",
                data: "id",
                render: (id) => {
                    return `
                    <button type="button" id="${id}" class="btn btn-danger border border-dark border-3 delete">DELETE</button>
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

            $(".total").text(`Total Expense: ₱ ${total}`)
        }
    })

    $("#add-expense").click(function () {
        if (!item.val() || !quantity.val() || !unit_price.val() || !expense_date.val()) return toastr.warning("Complete all fields")

        $(".loading").css({
            display: "block"
        })

        $.ajax({
            url: "/api/expense/add",
            type: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                item: item.val(),
                quantity: quantity.val(),
                unit_price: unit_price.val(),
                expense_date: expense_date.val()
            }),
            success: (res) => {
                table.ajax.reload(function ({ data }) {
                    let total = 0
                    data.forEach((expense, index) => {
                        const { unit_price, quantity } = expense
                        total += (quantity * unit_price)
                    })
                    $(".total").text(`Total Expense: ₱ ${total}`)
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

    $("#dataTable").on("click", ".delete", function() {
        $(".c-warning").fadeToggle("fast")
        id_handler.val($(this).prop("id"))
    })

    $("#warning-yes").click(function() {
        const id = id_handler.val()
        $(".loading").css({
            display: "block"
        })

        $.ajax({
            url: `/api/expense/delete?id=${id}`,
            type: "DELETE",
            success: (res) => {
                table.ajax.reload(function ({ data }) {
                    let total = 0
                    data.forEach((expense, index) => {
                        const { unit_price, quantity } = expense
                        total += (quantity * unit_price)
                    })
                    $(".total").text(`Total Expense: ₱ ${total}`)
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


        table.ajax.url(`/api/expenses/range?start=${start}&end=${end}`).load()

    })

})