import Swal from 'sweetalert2';

export const showSuccess = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    background: '#262626',
    color: '#ffffff',
    confirmButtonColor: '#7828D9'
  });
};

export const showError = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    background: '#262626',
    color: '#ffffff',
    confirmButtonColor: '#7828D9'
  });
};

export const showConfirm = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    background: '#262626',
    color: '#ffffff',
    confirmButtonColor: '#7828D9',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  });
};