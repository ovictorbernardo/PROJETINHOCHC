import { setCurrentView, setSelectedDay } from '../../store/slices/uiSlice';

export const createViewManager = ({ dispatch, isAdmin, navigate }) => ({
  changeTo: (view) => {
    if (view === 'admin' && !isAdmin) {
      if (navigate) navigate('/admin/login');
      else window.location.href = '/admin/login';
      return { ok: false, reason: 'not_logged' };
    }
    dispatch(setCurrentView(view));
    dispatch(setSelectedDay(null));
    return { ok: true };
  }
});
export default createViewManager;
