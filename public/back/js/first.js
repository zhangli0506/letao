$(function() {
    var currentPage = 1;
    var pageSize = 5;

    function render() {
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function(info) {
                console.log(info);
                $("tbody").html(template("tpl", info));
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
    render();

    /* 添加功能 */
    $(".btn_add").on("click", function() {
        // alert(1);
        $("#addModal").modal("show");
    });
    /* 表单验证功能 */
    var $form = $("#form");
    $form.bootstrapValidator({
        feedbackIcons: {
            valid: "glyphicon glyphicon-ok",
            invalid: "glyphicon glyphicon-remove",
            validating: "glyphicon glyphicon-refresh"
        },
        fields: {
            categoryName: {
                validators: {
                    notEmpty: {
                        message: "请输入一级分类的名称"
                    }
                }
            }
        }
    });
    /* 注册表单校验成功事件*/
    $form.on("success.form.bv", function(e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/category/addTopCategory",
            data: $form.serialize(),
            success: function(info) {
                console.log(info);
                if (info.success) {
                    /* 关闭模态框 */
                    $("#addModal").modal("hide");
                    // 重新渲染第一页
                    currentPage = 1;
                    render();
                    // 模态框数据重置
                    $form.data("bootstrapValidator").resetForm();
                    $form[0].reset();
                }
            }
        });
    });
});