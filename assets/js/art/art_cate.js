$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                };
                // console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    };

    var indexAdd = null;
    //为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });

    //通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                };
                initArtCateList();
                layer.msg('添加文章分类成功');
                layer.close(indexAdd);
            }
        });
    });

    //通过代理的形式，为 编辑按钮 绑定 点击修改 事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id');
        // console.log(id);
        //发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        });
    });

    //通过代理方式 发起 submit 请求来更新数据
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg(res.message);
                };
                layer.msg('更新文章分类成功！');
                layer.close(indexEdit);
                initArtCateList();
            }
        });
    });

    //通过代理方式 为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        //提示用户是否确认删除
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    };
                    layer.msg('删除文章分类成功!');
                    initArtCateList();
                    layer.close(index);
                }
            });

        });

    });

});