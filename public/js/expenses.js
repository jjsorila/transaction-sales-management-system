$(function () {
    const item = $("#item")
    const quantity = $("#quantity")
    const unit_price = $("#unit_price")
    const expense_date = $("#expense_date")

    function clearInput() {
        item.val("")
        quantity.val("")
        unit_price.val("")
        expense_date.val("")
    }

    $("#daterange").on("keypress keyup keydown",function(e) {
        e.preventDefault()
    })

    $("#dataTable").DataTable({
        ajax: '/api/expenses',
        lengthMenu: [[10, 20, 30, 50, -1], [10, 20, 30, 50, "All"]],
        ordering: false,
        columns: [
            {
                data: "item"
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
                data: "expense_date"
            },
            {
                data: "id",
                render: (id) => {
                    return `
                    <button type="button" id="${id}" class="btn btn-danger border border-dark border-3 delete">DELETE</button>
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
                $("#dataTable").DataTable().ajax.reload(function ({ data }) {
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

    $("table").on("click", ".delete", function() {
        const id = $(this).prop("id")
        $(".loading").css({
            display: "block"
        })

        $.ajax({
            url: `/api/expense/delete?id=${id}`,
            type: "DELETE",
            success: (res) => {
                $("#dataTable").DataTable().ajax.reload(function ({ data }) {
                    let total = 0
                    data.forEach((expense, index) => {
                        const { unit_price, quantity } = expense
                        total += (quantity * unit_price)
                    })
                    $(".total").text(`Total Expense: ₱ ${total}`)
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
            ajax: `/api/expenses/range?start=${start}&end=${end}`,
            lengthMenu: [[10, 20, 30, 50, -1], [10, 20, 30, 50, "All"]],
            ordering: false,
            columns: [
                {
                    data: "item"
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
                    data: "expense_date"
                },
                {
                    data: "id",
                    render: (id) => {
                        return `
                        <button type="button" id="${id}" class="btn btn-danger border border-dark border-3 delete">DELETE</button>
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
                $(".total").text(`Total Expense: ₱ ${total}`)
                $(".loading").css({
                    display: "none"
                })
            },
            destroy: true
        })

    })

})