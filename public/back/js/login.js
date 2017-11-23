$(function() {
    var $form = $("form");
    $form.bootstrapValidator({
        //配置校验时的图标
        feedbackIcons: {
            valid: "glyphicon glyphicon-ok",
            invalid: "glyphicon glyphicon-remove",
            validating: "glyphicon glyphicon-refresh"
        },
        //指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            username: {
                validators: {
                    notEmpty: {
                        message: "用户名不能为空"
                    },
                    callback: {
                        message: "用户名不存在"
                    },
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: "用户密码不能为空"
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: "密码长度是6-12位"
                    },
                    callback: {
                        message: "密码错误"
                    }　　　　　　　　　
                }
            }
        }
    });
    $form.on("success.form.bv", function(e) {
        e.preventDefault();
        console.log("哈哈哈");
        $.ajax({
            type: "post",
            url: "/employee/employeeLogin",
            data: $form.serialize(),
            success: function(data) {
                console.log(data);
                if (data.success) {
                    location.href = "index.html";
                }
                if (data.error === 1000) {
                    $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
                }
                if (data.error === 1001) {
                    $form.data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
                }
            }
        });
    });
    //重置功能，重置样式
    $("[type='reset']").on("click", function() {
        $form.data("bootstrapValidator").resetForm();
    });
});