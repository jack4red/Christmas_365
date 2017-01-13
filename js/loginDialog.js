(function ($) {
    $.fn.loginDialog = function(options) { //定义插件的名称，这里为userCp
        var def = {
            _callback: function() {},
            title: '关注该房源'
        };
        var ops = $.extend(def, options);
        var _this = this;
        $(this).find('.tittle_').find('span').html(ops.title);
        $(this).fadeIn(0);
        var method = {
            init: function() {
                var _self = this;
                //$(_this).find(".icon.star_").click(function(){
					$(".opacity-Cover, .form-Cover.pub-form-Cover").fadeIn(0);
                //});
                $(_this).find(".form-Cover.pub-form-Cover .closed").unbind().bind('click',function(){
                    $(".opacity-Cover, .form-Cover.pub-form-Cover").fadeOut(0);
                });
                $(_this).find(".cancel-but").unbind().bind('click',function(){
                    $(".opacity-Cover, .form-Cover.pub-form-Cover").fadeOut(0);
					//文字提示去除 //add by wkj 2016-12-13
					$('#telno_01').val('');
					$('#validcode_01').val('');
					$('#sendmessage_telno_01').text('');
                });
                $(_this).find('.send_code').unbind().bind('click', function() {
                    method.send_validcode();
                });
                $(_this).find('#fasong03').unbind().bind('click', function() {
                    method.submitBtn();
                });
            },
            send_validcode: function() {
                var self = $('#send_code');
                //var kind = 6;
                var kind = 11;
                var telno = $("#telno_01").val();
                var time = 0;
                if (time == 0) {
                    var partten = /^1\d{10}$/;
                    if(!partten.test(telno)){
                        $('#sendmessage_code_01').hide();
                        $('#sendmessage_telno_01').html('请正确输入手机号码。').show();
                        return false;
                    }else{
                        $('#sendmessage_telno_01').hide();
                        $.ajax({
                            type: 'post',
                            //url : '/rentlist/sendCode',
                            url : '/usercenter/sendCode',
                            data: {
                                telno: telno,
                                kind: kind
                            },
                            success:function(msg){
                                if (msg == '1') {
                                    self.unbind();
                                    time = 60;
                                    var oTime = null;
                                    self.val('重新获取('+time+')');
                                    self.css({"color":"#999"});
									$('.but_02 ').css({'border':'1px solid #ccc','background':'#ccc'})//
                                    oTime = setInterval(
                                        function() {
                                            if(time > 0) {
                                                time--;
                                                self.val('重新获取('+time+')');
                                            } else {
                                                self.bind('click', function() {
                                                    method.send_validcode();
                                                });
                                                clearInterval(oTime);
                                                self.val('获取验证码');
                                                self.css({"color":"#fff"});
												$('.but_02 ').css({'border':'1px solid #ec6c00','background':'#ec6c00'})
                                                $('#sendingnote').hide();
                                            }
                                        },1000);
                                }
                            }
                        });
                    }
                }
            },
            submitBtn: function() {
                var telno = $("#telno_01").val();
                var validcode = $("#validcode_01").val();
                var partten = /^1[34578]\d{9}$/;
				if(!partten.test(telno)){
					$('#sendmessage_code_01').hide();
					$('#sendmessage_telno_01').html('请正确输入手机号码。').show();
					return false;
				}
                if( validcode =='' || validcode.length != 4){
                    $('#sendmessage_telno_01').hide();
                    $('#sendmessage_code_01').html('请正确输入验证码。').show();
                    return false;
                }
                $.ajax({
                    type: 'post',
                    //url : '/rentlist/userLogin',
                    url : '/usercenter/yzmLogin',
                    data: {
                        telno: $("#telno_01").val(),
                        validcode: $("#validcode_01").val()
                    },
					async:false,
                    success: function(msg) {
                        if(msg==1) {//add by wkj 2016/11/28 登录样式添加
                            $(".opacity-Cover, .form-Cover.pub-form-Cover").fadeOut(0);
							
							location.reload();
							/*var passport_phone = $.cookie('passport_phone');
							if( typeof(passport_phone) == undefined ){
								passport_phone =  $("#telno_01").val();
							}else if( passport_phone == '' ){
								passport_phone =  $("#telno_01").val();
							}
							if( passport_phone == undefined || passport_phone ==''){
								passport_phone = '';
							}
							var user_html = '<a href="/usercenter/login"  target="_blank">你好！'+passport_phone+'</a>'
											+'<div class="userPanel">'
												+'<div class="conner"></div>'
												+'<a href="/usercenter/userinfo">个人资料</a>'
												+'<a href="/usercenter/changePassword">密码修改</a>'
												+'<a href="/usercenter/myCollectHouse">我的收藏</a>'
												+'<a href="/usercenter/publishHouse">发布房源</a>'
												+'<a href="/usercenter/myPublishHouse">我发布的房源</a>'
												+'<a href="/usercenter/logout">退出</a>'
											+'</div>'
							$('.logins .user').empty().append(user_html)
							*/
                            ops._callback();
                        } else if (msg==2) {
                            $('#sendmessage_telno_01').hide();
                            alert('请正确输入验证码.');
							$('#sendmessage_code_01').show();
                        } else if (msg == 0){
                            alert("登录失败");
                            setTimeout("location.reload()",3000);
                        }
                    }
                })
            }
        };

        method.init();
    }
})(jQuery);