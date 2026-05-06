"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, X, Trash2, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import SpecialUserModal, {
  type SpecialUserFormValues,
} from "@/app/components/admin/special-users/SpecialUserModal";
import DeleteModal from "@/app/components/common/DeleteModal";
import {
  getAllSpecialUserRequests,
  updateSpecialUserRequestStatus,
  deleteSpecialUserRequest,
  type SpecialUserRequestRecord,
} from "@/app/services/specialUserService";
import {
  createSpecialUser,
  getAllSpecialUsers,
} from "@/app/services/specialUserService";
import { getAllUsers } from "@/app/services/userService";
import {
  getAllCategories,
  type Category,
} from "@/app/services/categoriesService";

const statusConfig: Record<
  SpecialUserRequestRecord["status"],
  { label: string; classes: string; icon: typeof Clock }
> = {
  pending: {
    label: "Pending",
    classes: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    classes: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
  },
  declined: {
    label: "Declined",
    classes: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function SpecialUserRequestsPage() {
  const [requests, setRequests] = useState<SpecialUserRequestRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | SpecialUserRequestRecord["status"]
  >("all");

  // Approve flow — opens SpecialUserModal with email pre-filled
  const [approveTarget, setApproveTarget] =
    useState<SpecialUserRequestRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Decline flow
  const [declineTarget, setDeclineTarget] =
    useState<SpecialUserRequestRecord | null>(null);
  const [isDeclining, setIsDeclining] = useState(false);

  // Delete flow
  const [deleteTarget, setDeleteTarget] =
    useState<SpecialUserRequestRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const [reqData, catData] = await Promise.all([
        getAllSpecialUserRequests(),
        getAllCategories(),
      ]);
      setRequests(reqData.requests ?? []);
      setCategories(catData.categories ?? []);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load requests",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredRequests = useMemo(
    () =>
      statusFilter === "all"
        ? requests
        : requests.filter((r) => r.status === statusFilter),
    [requests, statusFilter],
  );

  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === "pending").length,
    [requests],
  );

  // --- Approve handler ---
  const handleApprove = (request: SpecialUserRequestRecord) => {
    setApproveTarget(request);
  };

  const isEmailTaken = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const [usersData, specialUsersData] = await Promise.all([
      getAllUsers(),
      getAllSpecialUsers(),
    ]);
    const existsInUsers = (usersData.users ?? []).some(
      (user) => user.email.trim().toLowerCase() === normalizedEmail,
    );
    const existsInSpecialUsers = (specialUsersData.users ?? []).some(
      (user) => user.email.trim().toLowerCase() === normalizedEmail,
    );
    return existsInUsers || existsInSpecialUsers;
  };

  const handleCreateSpecialUser = async (values: SpecialUserFormValues) => {
    if (!approveTarget) return;
    setIsSubmitting(true);

    try {
      if (await isEmailTaken(values.email)) {
        throw new Error(
          "A user with this email already exists in users or special users.",
        );
      }

      await createSpecialUser(values);
      await updateSpecialUserRequestStatus(approveTarget._id, "approved");

      toast.success(
        `Special user created & request approved for ${approveTarget.email}`,
      );
      setApproveTarget(null);
      await loadData(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create special user",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Decline handler ---
  const handleDecline = async () => {
    if (!declineTarget) return;
    setIsDeclining(true);
    try {
      await updateSpecialUserRequestStatus(declineTarget._id, "declined");
      toast.success(`Request from ${declineTarget.email} declined`);
      setDeclineTarget(null);
      await loadData(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to decline request",
      );
    } finally {
      setIsDeclining(false);
    }
  };

  // --- Delete handler ---
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteSpecialUserRequest(deleteTarget._id);
      toast.success("Request deleted");
      setDeleteTarget(null);
      await loadData(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete request",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const approveModalInitialValues = useMemo(() => {
    if (!approveTarget) return undefined;
    return {
      name: approveTarget.name,
      email: approveTarget.email,
      status: true,
      allowedCategories: [] as string[],
    };
  }, [approveTarget]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Access Requests
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Special user requests
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Review trade access applications. Approve to create a special user
            account, or decline to reject the request.
          </p>
        </div>

        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <Clock size={13} />
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Status
        </span>
        {(["all", "pending", "approved", "declined"] as const).map((val) => (
          <button
            key={val}
            onClick={() => setStatusFilter(val)}
            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === val
                ? val === "all"
                  ? "bg-gray-900 text-white"
                  : statusConfig[val].classes
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {val === "all"
              ? "All"
              : val.charAt(0).toUpperCase() + val.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">
            All requests
          </h2>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {filteredRequests.length} items
          </span>
        </div>

        {isLoading ? (
          <p className="px-5 py-6 text-sm text-gray-500">
            Loading requests...
          </p>
        ) : filteredRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Applicant</th>
                  <th className="px-5 py-4 font-medium">Company</th>
                  <th className="px-5 py-4 font-medium">Email</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => {
                  const cfg = statusConfig[request.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <tr
                      key={request._id}
                      className="border-t border-gray-100"
                    >
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {request.name}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {request.companyName}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {request.email}
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.classes}`}
                        >
                          <StatusIcon size={12} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {request.status === "pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(request)}
                                title="Approve & create special user"
                                className="cursor-pointer rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-emerald-600 transition-colors hover:bg-emerald-100"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeclineTarget(request)}
                                title="Decline request"
                                className="cursor-pointer rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                              >
                                <X size={14} />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(request)}
                            title="Delete request"
                            className="cursor-pointer rounded-xl border border-gray-200 p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-8 text-sm text-gray-500">
            {statusFilter === "all"
              ? "No special user requests yet."
              : `No ${statusFilter} requests.`}
          </div>
        )}
      </div>

      {/* Approve → opens SpecialUserModal with email pre-filled */}
      <SpecialUserModal
        isOpen={approveTarget !== null}
        mode="create"
        initialValues={approveModalInitialValues}
        categories={categories}
        isLoading={isSubmitting}
        onClose={() => setApproveTarget(null)}
        onSubmit={handleCreateSpecialUser}
      />

      {/* Decline confirmation */}
      <DeleteModal
        isOpen={declineTarget !== null}
        title="Decline request"
        description={`This will decline the access request from ${declineTarget?.name ?? "this applicant"} (${declineTarget?.email ?? ""}).`}
        confirmLabel="Decline"
        isLoading={isDeclining}
        onClose={() => setDeclineTarget(null)}
        onConfirm={() => void handleDecline()}
      />

      {/* Delete confirmation */}
      <DeleteModal
        isOpen={deleteTarget !== null}
        title="Delete request"
        description={`This will permanently delete the request from ${deleteTarget?.name ?? "this applicant"}.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </section>
  );
}
