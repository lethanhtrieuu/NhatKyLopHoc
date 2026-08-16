// Chọn chi nhánh ở footer
function selectBranch(element) {
  const allCheckboxes = document.querySelectorAll('.cbx');
  allCheckboxes.forEach(cb => cb.classList.remove('checked'));
  element.classList.add('checked');
}

// Xoá tất cả dữ liệu đã nhập
function resetForm() {
  if (confirm("Bạn có chắc chắn muốn xoá toàn bộ thông tin đã điền?")) {
    document.querySelectorAll('input:not(.school-name):not(.company-name):not(.branch-row input):not(.footer-phone input)').forEach(input => input.value = '');
    document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');
  }
}

// Xuất file ảnh PNG chất lượng cao
function exportImage() {
  const node = document.getElementById('sheet');
  
  // Tạm thời bỏ hiệu ứng scale để chụp ảnh nét nhất ở kích thước gốc
  const wrapper = document.getElementById('pageWrapper');
  const currentTransform = wrapper.style.transform;
  const currentMarginBottom = wrapper.style.marginBottom;
  
  wrapper.style.transform = 'none';
  wrapper.style.marginBottom = '0px';

  htmlToImage.toPng(node, { quality: 0.95, pixelRatio: 2 })
    .then(function (dataUrl) {
      const link = document.createElement('a');
      link.download = 'nhat-ky-lop-hoc.png';
      link.href = dataUrl;
      link.click();
      
      // Khôi phục lại trạng thái scale ban đầu
      wrapper.style.transform = currentTransform;
      wrapper.style.marginBottom = currentMarginBottom;
    })
    .catch(function (error) {
      console.error('Lỗi khi xuất ảnh:', error);
      wrapper.style.transform = currentTransform;
      wrapper.style.marginBottom = currentMarginBottom;
    });
}
