$(function() {
    //为登录/注册盒子绑定点击事件
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    //校验规则
    // 从 layui 中获取 form 对象
    var form = layui.form;
    var layer = layui.layer;
    //通过 form.verify() 函数自定义校验规则
    form.verify({
        //自定义了一个叫做 pwd 密码校验规则
        pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ]
            //校验两次密码是否一致的规则
            ,
        repwd: function(value) {
            //通过形参拿到的是确认密码框中的内容
            //还需呀拿到密码框中的内容
            //然后进行一次等于的判断
            //如果判断失败，则 return 一个提示消息即可
            var pwd = $('.reg-box [name=password]').val();
            if (pwd != value) return '两次密码不一致，请重新输入！';
        }
    });

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        //阻止表单默认提交行为
        e.preventDefault();
        //发起Ajax的POST请求
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        $.post(
            '/api/reguser',
            data,
            function(res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('注册成功！请登录', { icon: 6 }, function() {
                    $('#link_login').click();
                });
            })

    });
    //监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg('登录失败' + res.message);
                layer.msg('登录成功', { icon: 6 }, function() {
                    //将登录成功得到的 token 字符串 ，保存到localstorage 中
                    // console.log(res.token);
                    localStorage.setItem('token', res.token);
                    // //跳转到后台主页
                    location.href = '/index.html';
                });
            }
        })
    });

});