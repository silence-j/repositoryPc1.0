/**
 * @author shaohuan
 * Date: 17/3/27
 */
// import api from '../../../../common/js/detail/detailApi'
// import Utils from '../../../../common/js/serveice'
import Validator from '../../../../common/js/verification.js'
let $ = window.$
let form = $('#form')
// 询盘验证
form.on('blur', '.empty-input', (e) => {
  let _this = $(e.target)
  if (!_this.val()) {
    _this.parents('.form-group').addClass('error')
  } else {
    if (_this.attr('name') === 'email' && !Validator.checkEmail(_this.val())) {
      _this.parents('.form-group').addClass('error')
    } else {
      _this.parents('.form-group').removeClass('error')
    }
  }
  let textnum = 0
  let inputs = form.find('.empty-input')
  for (let i = 0, len = inputs.length; i < len; i++) {
    if ($(inputs[i]).val()) {
      textnum++
    }
  }
  if (form.find('.error').length === 0 && textnum === 5) {
    form.find('.btn-send').prop('disabled', false)
  } else {
    form.find('.btn-send').prop('disabled', true)
  }
})
/**
 * 询盘表单
 */
form.on('click', '.form-group>label', function (e) {
  $(e.target).parents('.form-group').find('.empty-input').focus()
})
form.on('focus', '.empty-input', function (e) {
  $(e.target).parents('.form-group').addClass('form-group-focus')
})
form.on('blur', '.empty-input', function (e) {
  let group = $(e.target).parents('.form-group').removeClass('form-group-focus')
  if ($(e.target).val()) {
    group.addClass('form-group-min')
  }
})
