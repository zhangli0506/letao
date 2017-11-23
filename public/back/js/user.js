$(function() {
    var currentPage = 1;
    var pageSize = 5;

    function render() {
        $.ajax({
            type: "get",
            url: "/user/queryUser",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function(info) {
                console.log(info);
                /* 数据渲染到tbody中 */
                var html = template("tpl", info);
                $("tbody").html(html);
                /* 渲染分页 */

                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage,
                    totalPages: Math.ceil(info.total / pageSize),
                    onPageClicked: function(a, b, c, page) {
                        currentPage = page;
                        render();
                    }
                });
            }
        });
    }

    /* 页面一加载就要渲染一次 */
    render();

    /* 启用禁用功能 */
    // 委托事件
    $("tbody").on("click", ".btn", function() {
        $("#userModal").modal("show");
        var id = $(this).parent().data("id");
        var isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
        /* 确定按钮注册事件 */
        $(".btn_confirm").off().on("click", function() {
            $.ajax({
                type: "post",
                url: "/user/updateUser",
                data: {
                    id: id,
                    isDelete: isDelete
                },
                success: function(info) {
                    if (info.success) {
                        $("#userModal").modal("hide");
                        render();
                    }
                }
            });
        });
    });
});