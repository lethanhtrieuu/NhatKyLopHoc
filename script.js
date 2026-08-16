function updateStamp() {}

// ===== Auto-grow textareas theo nội dung nhập =====
function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

function initAutoGrow() {
  document.querySelectorAll('.section-body textarea, .announce textarea').forEach(t => {
    autoGrow(t);
    t.addEventListener('input', () => autoGrow(t));
  });
}

function regrowAll() {
  document.querySelectorAll('.section-body textarea, .announce textarea').forEach(autoGrow);
}

window.addEventListener('load', () => {
  initAutoGrow();
  // Đảm bảo co giãn đúng sau khi web font load xong (tránh sai chiều cao)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(regrowAll);
  }
});

function selectBranch(el) {
  document.querySelectorAll('.branches .cbx').forEach(c => c.classList.remove('checked'));
  el.classList.add('checked');
}

function applyConditionalRows() {
  document.querySelectorAll('[data-conditional]').forEach(row => {
    const input = row.querySelector('input, textarea');
    const emptyValues = (row.dataset.emptyValues || '').split(',');
    const val = (input.value || '').trim().toLowerCase();
    if (val === '' || emptyValues.includes(val)) {
      row.classList.add('hide-on-export');
    } else {
      row.classList.remove('hide-on-export');
    }
  });
}

function clearConditionalRows() {
  document.querySelectorAll('[data-conditional]').forEach(row => row.classList.remove('hide-on-export'));
}

window.addEventListener('beforeprint', applyConditionalRows);
window.addEventListener('afterprint', clearConditionalRows);

// ===== Xuất ảnh chuẩn Desktop trên mọi thiết bị =====
async function exportImage() {
  const sheetNode = document.getElementById('sheet');
  if (!sheetNode) return;

  try {
    regrowAll();
    applyConditionalRows();

    // 1. Sao chép value vào DOM & tạm thời xóa placeholder
    const inputs = sheetNode.querySelectorAll('input, textarea');
    inputs.forEach(el => {
      if (el.tagName.toLowerCase() === 'textarea') {
        el.textContent = el.value;
      } else {
        el.setAttribute('value', el.value);
      }
      el.dataset.oldPlaceholder = el.getAttribute('placeholder') || '';
      el.removeAttribute('placeholder');
    });

    // 2. Ép giao diện về chuẩn Laptop 820px
    sheetNode.classList.add('exporting-desktop');

    await document.fonts.ready;

    // 3. Chụp ảnh với chiều rộng chuẩn
    const dataUrl = await htmlToImage.toPng(sheetNode, {
      quality: 0.95,
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: '#ffffff',
      width: 820
    });

    // 4. Khôi phục lại trạng thái giao diện điện thoại
    sheetNode.classList.remove('exporting-desktop');
    inputs.forEach(el => {
      if (el.dataset.oldPlaceholder) {
        el.setAttribute('placeholder', el.dataset.oldPlaceholder);
        delete el.dataset.oldPlaceholder;
      }
    });
    clearConditionalRows();

    // 5. Tải file về
    const lop = document.getElementById('lop')?.value.trim() || 'NhatKy';
    const ngay = document.getElementById('ngay')?.value.trim() || 'Ngay';
    const filename = `NhatKyLopHoc_${lop}_${ngay}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    sheetNode.classList.remove('exporting-desktop');
    clearConditionalRows();
    console.error('Lỗi khi xuất ảnh:', error);
    alert('Có lỗi xảy ra khi tạo ảnh!');
  }
}

function resetForm() {
  if (!confirm('Xoá toàn bộ nội dung đã nhập (trừ thông tin trung tâm và các cơ sở)?')) return;
  document.querySelectorAll('.info-box input, .section-body textarea, .line-field input, .announce textarea').forEach(i => i.value = '');
  regrowAll();
}

// Khởi tạo ngày hiện tại khi tải trang
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');

const ngayInput = document.getElementById('ngay');
if (ngayInput) {
  ngayInput.value = `${yyyy}-${mm}-${dd}`;
}
