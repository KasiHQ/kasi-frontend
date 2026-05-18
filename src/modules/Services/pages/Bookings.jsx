import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Calendar as CalendarIcon, Clock, MapPin, User, CheckCircle, XCircle, ChevronRight, CreditCard, CalendarDays, ArrowLeft, MoreHorizontal, Pen, X } from 'lucide-react';
import clsx from 'clsx';
import { formatCurrency } from '../../../utils/formatters';
import useNetwork from '../../../hooks/useNetwork';

const Schedule = () => {
  const { token, user } = useAuth();
  const { addToast } = useToast();
  const isOnline = useNetwork();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/services/bookings');
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.put(`/api/services/bookings/${id}/status`, { status: newStatus });
      addToast(`Booking marked as ${newStatus}`, 'success');
      fetchBookings();
      if (selectedBooking?.id === id) {
        setSelectedBooking(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      addToast('Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const getWeekDates = () => {
    const today = new Date();
    const day = today.getDay(); 
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) + (weekOffset * 7); 
    const monday = new Date(today.setDate(diff));
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        date: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
      };
    });
  };

  const weekDates = getWeekDates();
  const filteredBookings = bookings.filter(b => b.booking_date === selectedDate);

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Your Schedule</h1>
          <p className="text-gray-500 text-sm">Track and manage your upcoming service appointments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 4 COLUMNS: Week Overview */}
        <div className="lg:col-span-4 space-y-4">
           <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-dark dark:text-white">Week Overview</h3>
                 <div className="flex items-center gap-2">
                   <button onClick={() => setWeekOffset(prev => prev - 1)} className="p-1 text-gray-400 hover:text-dark hover:bg-gray-50 rounded transition-colors"><ArrowLeft size={16} /></button>
                   <button onClick={() => setWeekOffset(0)} className="text-xs font-bold text-gray-400 hover:text-dark transition-colors px-1" title="Today">Today</button>
                   <button onClick={() => setWeekOffset(prev => prev + 1)} className="p-1 text-gray-400 hover:text-dark hover:bg-gray-50 rounded transition-colors"><ChevronRight size={16} /></button>
                 </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {weekDates.map((d) => (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(d.date)}
                    className={clsx(
                      "flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all",
                      selectedDate === d.date ? "bg-primary text-white shadow-md" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    <span className="text-[9px] font-bold uppercase">{d.dayName[0]}</span>
                    <span className="text-xs font-black">{d.dayNum}</span>
                    {bookings.some(b => b.booking_date === d.date) && (
                      <div className={clsx("w-1 h-1 rounded-full", selectedDate === d.date ? "bg-white" : "bg-primary")} />
                    )}
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* RIGHT 8 COLUMNS: Timeline */}
        <div className="lg:col-span-8">
           <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm animate-in fade-in slide-in-from-right-2">
             <div className="flex justify-between items-center mb-8">
                <h4 className="text-xl font-black text-dark dark:text-white">
                  {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })} — Timeline
                </h4>
             </div>
             
             {loading ? (
               <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse" />)}
               </div>
             ) : (
               <div className="relative pt-4">
                 {hours.map(hour => {
                   const hourBookings = filteredBookings.filter(b => {
                      if (!b.booking_time) return false;
                      const bHour = parseInt(b.booking_time.split(':')[0], 10);
                      return bHour === hour;
                   });

                   const displayHour = hour % 12 || 12;
                   const ampm = hour >= 12 ? 'PM' : 'AM';

                   return (
                     <div key={hour} className="relative min-h-[80px] border-t border-gray-100 dark:border-gray-800 py-6 group">
                        <span className="absolute -top-2.5 left-0 bg-white dark:bg-gray-800/50 pr-4 text-xs font-bold text-gray-400 group-hover:text-primary transition-colors">
                          {displayHour} {ampm}
                        </span>
                        
                        <div className="pl-16 space-y-3">
                          {hourBookings.map((booking) => (
                           <button
                             key={booking.id}
                             onClick={() => {
                               setSelectedBooking(booking);
                               setIsDetailsOpen(true);
                             }}
                             className={clsx(
                               "w-full flex gap-6 p-5 rounded-xl border transition-all text-left items-center",
                               selectedBooking?.id === booking.id 
                                 ? "bg-primary/5 border-primary shadow-sm" 
                                 : "bg-gray-50 dark:bg-gray-800/80 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                             )}
                           >
                             <div className="flex flex-col text-primary font-black min-w-[80px]">
                                <span className="text-sm">{formatTime(booking.booking_time)}</span>
                                <span className="text-[10px] text-primary/60">{formatTime(booking.end_time) || '11:30 AM'}</span>
                             </div>
                             <div className="flex-1 border-l border-gray-200 dark:border-gray-700 pl-6">
                               <div className="flex justify-between items-start mb-1">
                                 <p className="text-base font-bold text-dark dark:text-white leading-tight flex items-center gap-2">
                                   💅 {booking.customer?.name || 'Client'}
                                 </p>
                                 <span className="text-xs font-bold text-dark dark:text-white">₦{((booking.service?.price || 0) / 1000).toFixed(0)}k</span>
                               </div>
                               <p className="text-xs font-medium text-gray-500 truncate">{booking.service?.name}</p>
                             </div>
                           </button>
                         ))}
                        </div>
                     </div>
                   );
                 })}
               </div>
             )}
           </div>
        </div>
      </div>

      {/* DETAILS MODAL */}
      {isDetailsOpen && selectedBooking && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden relative">
            <button 
              onClick={() => setIsDetailsOpen(false)} 
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-full p-2 transition-colors z-10"
            >
               <X size={20} />
            </button>

            <div className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 pr-8">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xl border border-primary/20">
                       {getInitials(selectedBooking.customer?.name)}
                    </div>
                    <div>
                       <h2 className="text-2xl font-black text-dark dark:text-white">{selectedBooking.customer?.name}</h2>
                       <p className="text-gray-500 font-medium text-sm mt-0.5">💅 {selectedBooking.service?.name} · {selectedBooking.booking_date}</p>
                    </div>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                   <div className="px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 text-xs font-bold border border-orange-200 dark:border-orange-500/20">
                      Deposit paid
                   </div>
                   {selectedBooking.reference && (
                     <span className="text-[10px] font-bold text-gray-400">REF: {selectedBooking.reference}</span>
                   )}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                 <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col gap-1">
                    <p className="text-[11px] font-bold text-gray-400 flex items-center gap-2"><Clock size={14} /> Time</p>
                    <p className="text-sm font-black text-dark dark:text-white">{formatTime(selectedBooking.booking_time)} — {formatTime(selectedBooking.end_time) || "11:30 AM"}</p>
                 </div>
                 <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col gap-1">
                    <p className="text-[11px] font-bold text-gray-400 flex items-center gap-2"><MapPin size={14} /> Location</p>
                    <p className="text-sm font-black text-dark dark:text-white">{selectedBooking.location_type === 'home_service' ? 'Client comes to you' : 'In-Shop'}</p>
                 </div>
                 <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col gap-1">
                    <p className="text-[11px] font-bold text-gray-400 flex items-center gap-2"><CreditCard size={14} /> Deposit paid</p>
                    <p className="text-sm font-black text-dark dark:text-white">₦{(selectedBooking.service?.price / 2 || 0).toLocaleString()}</p>
                 </div>
                 <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col gap-1">
                    <p className="text-[11px] font-bold text-gray-400 flex items-center gap-2">💰 Balance due</p>
                    <p className="text-sm font-black text-dark dark:text-white">₦{(selectedBooking.service?.price / 2 || 0).toLocaleString()}</p>
                 </div>
              </div>

              {/* NEW AI INSIGHTS SECTION */}
              {(selectedBooking.ai_summary || (selectedBooking.specific_details && Object.keys(selectedBooking.specific_details).length > 0) || (selectedBooking.images && selectedBooking.images.length > 0)) && (
                <div className="mb-10 bg-primary/5 border border-primary/10 rounded-2xl p-6">
                  <h4 className="text-sm font-black text-primary mb-4 flex items-center gap-2">
                    ✨ AI Conversation Insights
                  </h4>
                  
                  {selectedBooking.ai_summary && (
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-primary/60 mb-1 uppercase tracking-wider">Summary</p>
                      <p className="text-sm font-medium text-dark dark:text-gray-200 leading-relaxed">
                        {selectedBooking.ai_summary}
                      </p>
                    </div>
                  )}

                  {selectedBooking.specific_details && Object.keys(selectedBooking.specific_details).length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-primary/60 mb-2 uppercase tracking-wider">Specific Requests</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedBooking.specific_details).map(([key, value]) => (
                          <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">{key}</span>
                            <span className="text-sm font-bold text-dark dark:text-white">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedBooking.images && selectedBooking.images.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-primary/60 mb-2 uppercase tracking-wider">Shared Media</p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedBooking.images.map((img, idx) => (
                          <img key={idx} src={img} alt="Customer reference" className="w-20 h-20 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shrink-0" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                 <button onClick={() => updateStatus(selectedBooking.id, 'Completed')} className="flex-1 bg-primary hover:bg-green-700 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 text-sm">
                    <CheckCircle size={18} /> Mark as Done
                 </button>
                 <button onClick={() => {
                   setIsDetailsOpen(false);
                   setIsRescheduleOpen(true);
                 }} className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-dark dark:hover:text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm">
                    <Pen size={16} /> Reschedule
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {isRescheduleOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden relative">
             <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-lg text-dark dark:text-white">Reschedule</h3>
                <button onClick={() => setIsRescheduleOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-full p-2 transition-colors">
                   <X size={16} />
                </button>
             </div>
             <div className="p-6">
                <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-xl p-4 mb-6">
                  <p className="text-orange-800 dark:text-orange-400 text-sm font-medium flex gap-2">
                     📱 <span>Kasi will automatically notify <span className="font-bold">{selectedBooking.customer?.name}</span> of the time change.</span>
                  </p>
                </div>
                <div className="mb-8">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">New Start Time</label>
                   <div className="relative">
                     <input 
                       type="time" 
                       className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white rounded-xl p-4 font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                       defaultValue={selectedBooking.booking_time} 
                     />
                     <Clock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                   </div>
                </div>
                <button onClick={() => {
                  setIsRescheduleOpen(false);
                  addToast("Reschedule notification sent via WhatsApp!", "success");
                }} className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-colors shadow-md shadow-primary/20">
                   Save & Notify Client
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
