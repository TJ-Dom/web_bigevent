$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor();
    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                };
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        });
    };

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为 选择封面 按钮添加点击上传文件行为
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    });

    //监听 coverFile 的change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        var files = e.target.files;
        if (files.length === 0) {
            return
        };
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    //定义文章的发布状态
    var art_state = '已发布';

    //为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    });

    //为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        //基于 form 表单，快速创建一个 formData对象
        var fd = new FormData($(this)[0]);
        //将文章的发布状态，存到fd中
        fd.append('state', art_state);
        //将裁剪后的图片，输出为文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象，存储到 fd中
                fd.append('cover_img', blob);
                //发起Ajax请求 发布文章
                publishArticle(fd);
            });
        fd.forEach(function(v, k) {
            console.log(k, v);
        })


    });

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意：如果向服务器提交的是FormData格式的数据
            //必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                };
                layer.msg('发布文章成功！');
                location.href = '/article/art_list.html';
            }
        });
    };
});