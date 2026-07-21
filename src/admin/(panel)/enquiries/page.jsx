"use client";

import { Eye, Mail, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteModal from "@/components/common/DeleteModal";
import {
  deleteEnquiry,
  getAllEnquiries } from

"@/services/contactService";

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}







function EnquiryModal({ enquiry, isOpen, onClose }) {
  if (!isOpen || !enquiry) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="group absolute right-6 top-4 cursor-pointer">
          
          <X className="text-gray-400 group-hover:text-gray-800" />
        </button>

        <div className="border-b border-gray-100 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
            Enquiry details
          </p>
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                {enquiry.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {enquiry.companyName} · {formatDate(enquiry.createdAt)}
              </p>
            </div>
            <a
              href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`Re: ${enquiry.reason}`)}`}
              className="inline-flex items-center gap-2 self-start rounded-2xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
              
              <Mail size={14} />
              Send message
            </a>
          </div>
        </div>

        <div className="max-h-[calc(90vh-132px)] overflow-y-auto px-6 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                Contact
              </p>
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-900">{enquiry.name}</p>
                <p>{enquiry.email}</p>
                <p>{enquiry.phone}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                Company
              </p>
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-900">
                  {enquiry.companyName}
                </p>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                  enquiry.existingCustomer ?
                  "bg-emerald-100 text-emerald-700" :
                  "bg-gray-100 text-gray-700"}`
                  }>
                  
                  {enquiry.existingCustomer ? "Existing customer" : "New enquiry"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Reason
            </p>
            <p className="mt-3 text-sm text-gray-700">{enquiry.reason}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Message
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {enquiry.message}
            </p>
          </div>
        </div>
      </div>
    </div>);

}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEnquiries = async (silent = false) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await getAllEnquiries();
      setEnquiries(response.contacts ?? []);
    } catch (loadError) {
      toast.error(
        loadError instanceof Error ?
        loadError.message :
        "Failed to load enquiries"
      );
    } finally {
      if (silent) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    void loadEnquiries();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget?._id) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteEnquiry(deleteTarget._id);
      toast.success("Enquiry deleted successfully");
      setDeleteTarget(null);
      await loadEnquiries(true);
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error ?
        deleteError.message :
        "Failed to delete enquiry"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Contact Inbox
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Enquiries</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Review contact requests submitted from the public contact page.
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {enquiries.length} enquiries
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">All enquiries</h2>
        </div>

        {isLoading ?
        <p className="px-5 py-6 text-sm text-gray-500">
            Loading enquiries...
          </p> :
        enquiries.length > 0 ?
        <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Contact</th>
                  <th className="px-5 py-4 font-medium">Company</th>
                  <th className="px-5 py-4 font-medium">Email</th>
                  <th className="px-5 py-4 font-medium">Mobile</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) =>
              <tr key={enquiry._id} className="border-t border-gray-100 align-top">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{enquiry.name}</p>
                      <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    enquiry.existingCustomer ?
                    "bg-emerald-100 text-emerald-700" :
                    "bg-gray-100 text-gray-700"}`
                    }>
                    
                        {enquiry.existingCustomer ? "Existing customer" : "New enquiry"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {enquiry.companyName}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{enquiry.email}</td>
                    <td className="px-5 py-4 text-gray-600">{enquiry.phone}</td>
                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(enquiry.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                      type="button"
                      onClick={() => setSelectedEnquiry(enquiry)}
                      className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-100">
                      
                          <Eye size={14} />
                        </button>
                        <button
                      type="button"
                      onClick={() => setDeleteTarget(enquiry)}
                      className="rounded-xl border border-gray-200 p-2 text-red-600 hover:bg-red-50">
                      
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div> :

        <div className="px-5 py-8 text-sm text-gray-500">
            No enquiries found yet.
          </div>
        }

        {isRefreshing ?
        <p className="px-5 pb-4 text-xs text-gray-400">Updating enquiries...</p> :
        null}
      </div>

      <DeleteModal
        isOpen={deleteTarget !== null}
        title="Delete enquiry"
        description={`This will permanently delete the enquiry from ${deleteTarget?.name ?? "the selected contact"}.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()} />
      

      <EnquiryModal
        isOpen={selectedEnquiry !== null}
        enquiry={selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)} />
      
    </section>);

}