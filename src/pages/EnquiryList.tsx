import React, { useEffect, useState } from 'react';

interface Enquiry {
    _id: string;
    name: string;
    email: string;
    phone: string;
    reason: string;
    message: string;
    status: 'Pending' | 'Contacted' | 'Resolved';
    createdAt: string;
}

const EnquiryList = () => {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Enquiry>>({});

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/enquiries`);
                const data = await response.json();
                setEnquiries(data);
            } catch (error) {
                console.error('Error fetching enquiries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnquiries();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this enquiry?")) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/enquiries/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setEnquiries(prev => prev.filter(enq => enq._id !== id));
                    if (selectedEnquiry?._id === id) {
                        setSelectedEnquiry(null);
                        setIsEditing(false);
                    }
                }
            } catch (error) {
                console.error("Error deleting enquiry:", error);
            }
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/enquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                const updatedEnquiry = await response.json();
                setEnquiries(prev => prev.map(enq => enq._id === id ? updatedEnquiry : enq));
                if (selectedEnquiry?._id === id) setSelectedEnquiry(updatedEnquiry);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleEditClick = () => {
        if (selectedEnquiry) {
            setEditForm(selectedEnquiry);
            setIsEditing(true);
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEnquiry) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/enquiries/${selectedEnquiry._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });

            if (response.ok) {
                const updatedEnquiry = await response.json();
                setEnquiries(prev => prev.map(enq => enq._id === updatedEnquiry._id ? updatedEnquiry : enq));
                setSelectedEnquiry(updatedEnquiry);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating enquiry:", error);
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
                    <h1 className="text-4xl font-serif text-primary mb-2">Enquiries</h1>
                    <p className="text-lg text-stone-500">Manage and view incoming contact enquiries.</p>
                </div>
                <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-stone-100 text-sm text-stone-500">
                    Total: <span className="font-semibold text-primary">{enquiries.length}</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-luxury overflow-hidden border border-stone-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50/50 border-b border-stone-100">
                            <tr>
                                <th className="p-5 font-medium text-xs uppercase tracking-widest text-stone-500">Client Name</th>
                                <th className="p-5 font-medium text-xs uppercase tracking-widest text-stone-500">Reason</th>
                                <th className="p-5 font-medium text-xs uppercase tracking-widest text-stone-500">Status</th>
                                <th className="p-5 font-medium text-xs uppercase tracking-widest text-stone-500">Date</th>
                                <th className="p-5 font-medium text-xs uppercase tracking-widest text-stone-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {enquiries.map((enq) => (
                                <tr key={enq._id} className="hover:bg-primary/5 transition-colors group cursor-pointer" onClick={() => { setSelectedEnquiry(enq); setIsEditing(false); }}>
                                    <td className="p-5">
                                        <div className="font-serif text-xl text-stone-800">{enq.name}</div>
                                        <div className="text-xs text-stone-400 mt-0.5">{enq.email}</div>
                                    </td>
                                    <td className="p-5">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800 border border-stone-200">
                                            {enq.reason}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${enq.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                                            enq.status === 'Contacted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                                            }`}>
                                            {enq.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-stone-600">
                                        <span className="font-medium">
                                            {new Date(enq.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedEnquiry(enq); setIsEditing(false); }}
                                            className="px-5 py-2 bg-white border border-stone-200 text-stone-600 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all text-sm font-medium shadow-sm"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(enq._id, e)}
                                            className="ml-2 px-3 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors text-sm font-medium shadow-sm border border-red-100"
                                            title="Delete Enquiry"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {enquiries.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-stone-400 italic">No enquiries found yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {selectedEnquiry && (
                <div
                    className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-gentle-fade"
                    onClick={() => { setSelectedEnquiry(null); setIsEditing(false); }}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {!isEditing ? (
                            // VIEW MODE
                            <>
                                <div className="p-10 border-b border-stone-100 bg-stone-50/30 flex justify-between items-start">
                                    <div>
                                        <h2 className="text-3xl font-serif text-primary mb-1">Enquiry Details</h2>
                                        <p className="text-stone-500 text-sm">
                                            Received on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleEditClick}
                                            className="px-4 py-1.5 bg-white border border-stone-200 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm"
                                        >
                                            Edit
                                        </button>
                                        <select
                                            value={selectedEnquiry.status}
                                            onChange={(e) => handleStatusUpdate(selectedEnquiry._id, e.target.value)}
                                            className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm bg-white focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="Resolved">Resolved</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="p-10 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Name</label>
                                            <p className="text-xl font-serif text-stone-800">{selectedEnquiry.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Reason</label>
                                            <p className="text-lg text-stone-800">{selectedEnquiry.reason}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Email</label>
                                            <p className="text-lg text-stone-800">{selectedEnquiry.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Phone</label>
                                            <p className="text-lg text-stone-800">{selectedEnquiry.phone}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs uppercase tracking-widest text-stone-400 font-semibold">Message</label>
                                        <div className="mt-2 p-4 bg-stone-50 rounded-xl border border-stone-100 text-stone-700 whitespace-pre-wrap">
                                            {selectedEnquiry.message || <span className="italic text-stone-400 text-lg">No message provided.</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-stone-50 border-t border-stone-100 flex justify-end">
                                    <button
                                        onClick={() => { setSelectedEnquiry(null); setIsEditing(false); }}
                                        className="px-6 py-2.5 bg-stone-800 text-white rounded-xl font-medium hover:bg-stone-900 transition-colors shadow-lg shadow-stone-900/10"
                                    >
                                        Close
                                    </button>
                                </div>
                            </>
                        ) : (
                            // EDIT MODE
                            <form onSubmit={handleEditSubmit}>
                                <div className="p-8 border-b border-stone-100 bg-stone-50/30 flex justify-between items-center">
                                    <h2 className="text-2xl font-serif text-primary mb-1">Edit Enquiry</h2>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="text-stone-400 hover:text-stone-600"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="p-8 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editForm.name || ''}
                                                onChange={handleEditChange}
                                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Phone</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={editForm.phone || ''}
                                                onChange={handleEditChange}
                                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={editForm.email || ''}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Reason</label>
                                            <select
                                                name="reason"
                                                value={editForm.reason || ''}
                                                onChange={handleEditChange}
                                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                                            >
                                                <option>Signature Massage</option>
                                                <option>Radiance Facial</option>
                                                <option>Body Journey</option>
                                                <option>Membership Inquiry</option>
                                                <option>Other / General</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Status</label>
                                            <select
                                                name="status"
                                                value={editForm.status || ''}
                                                onChange={handleEditChange}
                                                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Message</label>
                                        <textarea
                                            name="message"
                                            value={editForm.message || ''}
                                            onChange={handleEditChange}
                                            rows={4}
                                            className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="p-6 bg-stone-50 border-t border-stone-100 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2.5 bg-white border border-stone-200 text-stone-600 rounded-xl font-medium hover:bg-stone-50 transition-colors shadow-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnquiryList;
