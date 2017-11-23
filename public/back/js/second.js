$(function() {
    var currentPage = 1;
    var pageSize = 5;

    function render() {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function(info) {
                // console.log(info);
                // console.log(info.total);
                $("tbody").html(template("tpl", info));
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage,
                    totalPages: Math.ceil((info.total / pageSize)),
                    onPageClicked: function(a, b, c, page) {
                        currentPage = page;
                        render();
                    }
                });
            }
        });
    }
    render();

    // 添加分类
    $(".btn_add").on("click", function() {
        $("#addSecondModal").modal("show");

        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            success: function(info) {
                // console.log(info);
                $(".dropdown-menu").html(template("tpl2", info));

            }
        });
    });

    $(".dropdown-menu").on("click", "a", function() {
        $(".dropdown-text").text($(this).text());
        $("[name='categoryId']").val($(this).data("id"));

        // 校验
        $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
    });

    // 图片上传功能
    $("#fileupload").fileupload({
        dataType: "json",
        done: function(e, data) {
            console.log(data);
            console.log(data.result.picAddr);
            $(".img_box img").attr("src", data.result.picAddr);
            $("[name='brandLogo']").val(data.result.picAddr);
            $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
        }
    });

    /* 表单校验 */
    var $form = $("form");
    $form.bootstrapValidator({
        excluded: [],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入二级分类的名称"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传品牌图片"
                    }
                }
            }
        }
    });
    /* 表单校验成功事件 */
    $("#form").on("success.form.bv", function(e) {
        e.preventDefault();
        console.log($form.serialize());
        $.ajax({
            type: "post",
            url: "/category/addSecondCategory",
            data: $form.serialize(),
            success: function(info) {
                if (info.success) {
                    $("#addSecondModal").modal("hide");
                    currentPage = 1;
                    render();
                    /* 重置内容和样式 */
                    $form[0].reset();
                    $form.data("bootstrapValidator").resetForm();
                    /* 重置下拉列表和图片 */
                    $(".dropdown-text").text("请选择一级分类");
                    $("[name='categoryId']").val("");
                    $("img_box img").attr("src", "../images/none.png");
                    $("[name='brandName']").val("");
                }
            }
        });
    });
});