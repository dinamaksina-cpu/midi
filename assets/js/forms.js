
(function(){
  const form=document.querySelector('#enquiryForm'); if(!form) return;
  const status=document.querySelector('.form-status');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return;}
    if(status) status.textContent='Thanks — the form is ready for backend/email integration. No message has been sent yet.';
  });
})();
