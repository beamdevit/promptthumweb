(function () {
  var header = document.querySelector('.site-header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  });

  var menuToggle = document.getElementById('menu-toggle');
  var mainNav = document.getElementById('main-nav');
  menuToggle.addEventListener('click', function () {
    var open = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', open);
  });

  var dropdownParent = document.querySelector('.has-dropdown');
  var dropdownBtn = document.querySelector('.nav-dropdown-btn');
  dropdownBtn.addEventListener('click', function () {
    var open = dropdownParent.classList.toggle('is-open');
    dropdownBtn.setAttribute('aria-expanded', open);
  });

  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var budgetSelect = document.getElementById('cf-budget');

  document.querySelectorAll('.pkg-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pkg = btn.getAttribute('data-package');
      var amount = pkg.match(/\d[\d,]*/);
      if (amount) {
        var value = amount[0].replace(',', '');
        if (value === '20000') value = '20000+';
        for (var i = 0; i < budgetSelect.options.length; i++) {
          if (budgetSelect.options[i].value === value) budgetSelect.selectedIndex = i;
        }
      }
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      document.getElementById('cf-name').focus({ preventScroll: true });
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('cf-name').value.trim();
    var contact = document.getElementById('cf-contact').value.trim();
    if (!name || !contact) {
      status.textContent = 'กรุณากรอกชื่อและอีเมล/เบอร์โทรของคุณ';
      return;
    }
    status.textContent = 'ขอบคุณค่ะ! ทีมงานจะติดต่อกลับภายใน 24 ชม.';
    form.reset();
  });
})();
