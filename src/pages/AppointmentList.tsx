import React, { useEffect, useState } from 'react';

interface Appointment {
    _id: string;
    name: string;
    service: string;
    date: string;
    time: string;
    phone: string;
    email: string;
    notes: string;
    amount?: number;
    createdAt: string;
}

const AppointmentList = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments`);
                const data = await response.json();
                setAppointments(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this appointment request?")) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setAppointments(prev => prev.filter(apt => apt._id !== id));
                    if (selectedAppointment?._id === id) setSelectedAppointment(null);
                }
            } catch (error) {
                console.error("Error deleting appointment:", error);
            }
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="animate-gentle-fade">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-serif text-primary mb-2">Appointment Requests</h1>
                    <p className="text-lg text-stone-500">Manage and view incoming booking requests.</p>
                </div>
                <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-stone-100 text-sm text-stone-500">
                    Total: <span className="font-semibold text-primary">{appointments.length}</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-luxury overflow-hidden border border-stone-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50/50 border-b border-stone-100">
                            <tr>
                                <th className="p-5 font-medium text-xs uppercase tracking-widest text-stone-500">Client Name</th>
                                <th className="p-5 font-medium text-xs uppercase tracking-widest text-stone-500">Service</th>
                                <th className="p-5 font-medium text-xs uppercase tracking-widest text-stone-500">Amount</th>
                                <th className="p-5 font-medium text-xs uppercase tracking-widest text-stone-500">Date & Time</th>
                                <th className="p-5 font-medium text-xs uppercase tracking-widest text-stone-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {appointments.map((apt) => (
                                <tr key={apt._id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="p-5">
                                        <div className="font-serif text-xl text-stone-800">{apt.name}</div>
                                        <div className="text-xs text-stone-400 mt-0.5">{apt.email}</div>
                                    </td>
                                    <td className="p-5">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800 border border-stone-200">
                                            {apt.service}
                                        </span>
                                    </td>
                                    <td className="p-5 font-medium text-stone-700">
                                        {apt.amount ? `$${apt.amount}` : <span className="text-stone-300 italic">-</span>}
                                    </td>
                                    <td className="p-5 text-stone-600">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-medium">{apt.date}</span>
                                            <span className="text-stone-400 text-sm">{apt.time}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button
                                            onClick={() => setSelectedAppointment(apt)}
                                            className="px-5 py-2 bg-white border border-stone-200 text-stone-600 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all text-sm font-medium shadow-sm"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(apt._id, e)}
                                            className="ml-2 px-3 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors text-sm font-medium shadow-sm border border-red-100"
                                            title="Delete Request"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-stone-400 italic">No appointments found yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Ultra Premium Modal */}
            {selectedAppointment && (
                <div
                    className="fixed inset-0 bg-gradient-to-br from-stone-900/70 via-stone-900/60 to-stone-900/70 backdrop-blur-xl flex items-center justify-center p-4 z-50 animate-gentle-fade"
                    onClick={() => setSelectedAppointment(null)}
                >
                    <div
                        className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_80px_rgba(0,0,0,0.25)] max-w-5xl w-full overflow-hidden animate-luxury-scale border border-white/50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Elegant Header with Quick Info Pills */}
                        <div className="relative bg-gradient-to-br from-primary/10 via-accent/8 to-white/50 p-12 pb-10 border-b border-stone-100/50">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMzYsMjMzLDIyOCwwLjUpIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"></div>

                            <div className="relative flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-4xl font-serif text-primary mb-2 tracking-tight">Appointment Details</h2>
                                    <div className="flex items-center gap-2 text-stone-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                                        <p className="text-xs uppercase tracking-[0.2em] font-semibold">Booking Request</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedAppointment(null)}
                                    className="group w-11 h-11 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-md hover:bg-white border border-stone-200/50 hover:border-primary/40 transition-all duration-300 hover:rotate-90 shadow-sm hover:shadow-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-500 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Quick Info Pills */}
                            <div className="relative flex flex-wrap gap-3">
                                <div className="group flex items-center gap-2.5 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/60 shadow-sm hover:shadow-md transition-all">
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-semibold text-stone-700">{selectedAppointment.date}</span>
                                </div>
                                <div className="group flex items-center gap-2.5 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/60 shadow-sm hover:shadow-md transition-all">
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-semibold text-stone-700">{selectedAppointment.time}</span>
                                </div>
                                {selectedAppointment.amount && (
                                    <div className="group flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-primary/15 to-accent/15 backdrop-blur-sm rounded-2xl border border-primary/25 shadow-sm hover:shadow-md transition-all">
                                        <div className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-bold text-primary">${selectedAppointment.amount}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="p-12 space-y-8 bg-gradient-to-br from-white to-stone-50/30">
                            {/* Client & Service - Side by Side Premium Cards */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Client Card */}
                                <div className="group relative overflow-hidden bg-gradient-to-br from-white to-stone-50/50 p-7 rounded-3xl border border-stone-200/80 hover:border-primary/30 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-all duration-500">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
                                    <div className="relative flex items-start gap-4">
                                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/25 to-primary/10 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-bold mb-2">Client Name</p>
                                            <p className="font-serif text-3xl text-stone-800 leading-tight">{selectedAppointment.name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Service Card */}
                                <div className="group relative overflow-hidden bg-gradient-to-br from-primary/12 via-primary/8 to-accent/8 p-7 rounded-3xl border border-primary/25 hover:border-primary/40 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-all duration-500">
                                    <div className="absolute -top-10 -right-10 w-36 h-36 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-500"></div>
                                    <div className="relative flex items-start gap-4">
                                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/35 to-accent/25 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-bold mb-2">Selected Service</p>
                                            <p className="font-semibold text-xl text-stone-800 leading-tight mb-1">{selectedAppointment.service}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-gradient-to-br from-white via-white to-stone-50/40 p-7 rounded-3xl border border-stone-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs uppercase tracking-[0.15em] text-stone-600 font-bold">Contact Information</p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-stone-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-1">Email</p>
                                            <p className="text-sm font-semibold text-stone-700 truncate">{selectedAppointment.email}</p>
                                        </div>
                                    </div>
                                    <div className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-stone-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-1">Phone</p>
                                            <p className="text-sm font-semibold text-stone-700 truncate">{selectedAppointment.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Special Notes */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-amber-50/90 via-amber-50/60 to-yellow-50/40 p-7 rounded-3xl border border-amber-200/50 shadow-[0_8px_30px_rgba(217,119,6,0.15)]">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-200/20 rounded-full blur-3xl"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-2xl bg-amber-100/80 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        <p className="text-xs uppercase tracking-[0.15em] text-amber-700/80 font-bold">Special Notes</p>
                                    </div>
                                    <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-amber-100/60 shadow-[0_4px_20px_rgba(217,119,6,0.1)]">
                                        <p className="text-stone-700 text-sm leading-relaxed">
                                            {selectedAppointment.notes ? (
                                                <span className="italic font-medium">"{selectedAppointment.notes}"</span>
                                            ) : (
                                                <span className="text-stone-400 italic">No special notes provided for this appointment.</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Timestamp Footer */}
                            <div className="flex items-center justify-center gap-2 pt-6 border-t border-stone-200/50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold">
                                    Requested {new Date(selectedAppointment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Premium Button Footer */}
                        <div className="px-10 py-7 bg-gradient-to-br from-stone-50/80 to-white border-t border-stone-200/50">
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="w-full py-4 bg-gradient-to-r from-primary via-primary to-primary/95 hover:from-primary/95 hover:via-primary/90 hover:to-primary/95 text-white rounded-2xl font-bold text-sm uppercase tracking-[0.15em] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentList;
