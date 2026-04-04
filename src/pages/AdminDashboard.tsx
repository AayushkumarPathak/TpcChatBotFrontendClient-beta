import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, ArrowLeft, Users, Shield, XCircle } from "lucide-react";
import { apiService } from "../services/api";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Button } from "../components/ui/Button";
import lpuLogo from "../assets/lpuLogo.svg";

const TABLE_CONFIG = {
  admins: [
    { key: "email", label: "Email" },
    { key: "createdAt", label: "Created At" },
  ],
  users: [
    { key: "regNo", label: "Reg No" },
    { key: "name", label: "Name" },
    { key: "dob", label: "DOB" },
    { key: "role", label: "Role" },
    { key: "actions", label: "Actions" },
  ],
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const adminEmail = localStorage.getItem("adminEmail");

  const [data, setData] = useState<any[]>([]);
  const [type, setType] = useState<"admins" | "users" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ name: "", dob: "" });
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const admins = await apiService.fetchAllAdmins();
      setData(admins);
      setType("admins");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await apiService.fetchAllUsers();
      setData(users);
      setType("users");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const columns = type ? TABLE_CONFIG[type] : [];

  // Placeholder handlers for edit/delete
  const handleEdit = (row: any) => {
    setSelectedStudent(row);
    setEditForm({ name: row.name, dob: row.dob });
    setEditModalOpen(true);
  };

  const handleDelete = (row: any) => {
    setSelectedStudent(row);
    setDeleteConfirm("");
    setDeleteModalOpen(true);
  };

  // Update student API call
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setModalLoading(true);
    setError(null);
    try {
      await apiService.updateStudent(selectedStudent.regNo, editForm);
      setEditModalOpen(false);
      fetchUsers(); // Refresh
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update student");
    } finally {
      setModalLoading(false);
    }
  };

  // Delete student API call
  const handleDeleteConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    if (deleteConfirm !== "delete") return;
    setModalLoading(true);
    setError(null);
    try {
      await apiService.deleteStudent(selectedStudent.regNo);
      setDeleteModalOpen(false);
      fetchUsers(); // Refresh
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete student");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF1F1] p-4">
      {/* Header Bar */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={lpuLogo} alt="LPU Logo" className="w-12 h-12" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
              <p className="text-sm text-gray-600">{adminEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/adminPortal")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portal
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">Training & Placement Cell</p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 relative">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Data Viewer
            </h2>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              variant={type === "admins" ? "primary" : "secondary"}
              onClick={fetchAdmins}
              className="flex items-center gap-2"
            >
              <Shield className="h-5 w-5" />
              Fetch All Admins
            </Button>
            <Button
              variant={type === "users" ? "primary" : "secondary"}
              onClick={fetchUsers}
              className="flex items-center gap-2"
            >
              <Users className="h-5 w-5" />
              Fetch All Users
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2 mb-6">
              <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center my-12">
              <LoadingSpinner />
            </div>
          )}

          {/* Table */}
          {!loading && data.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      {columns.map((col) => (
                        <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {col.key === "actions" && type === "users" ? (
                            <div className="flex gap-3">
                              <button
                                className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                                title="Edit"
                                onClick={() => handleEdit(row)}
                              >
                                <Pencil size={18} />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                                title="Delete"
                                onClick={() => handleDelete(row)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ) : (
                            row[col.key]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!loading && type && data.length === 0 && !error && (
            <div className="text-center text-gray-500 my-8 bg-gray-50 rounded-lg p-8 border border-gray-200">
              No data found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2026 Lovely Professional University</p>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md z-10 relative">
            <div className="flex items-center gap-2 mb-6">
              <Pencil className="h-5 w-5 text-orange-500" />
              <h3 className="text-xl font-bold text-gray-900">Edit Student</h3>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-shadow"
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DOB</label>
                <input
                  type="date"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-shadow"
                  value={editForm.dob}
                  onChange={e => setEditForm(f => ({ ...f, dob: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={() => setEditModalOpen(false)} disabled={modalLoading}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={modalLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md z-10 relative">
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
              <h3 className="text-xl font-bold text-gray-900">Delete Student</h3>
            </div>
            <form onSubmit={handleDeleteConfirm} className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Type <span className="font-mono bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100">delete</span> to confirm deletion of <b className="text-gray-900">{selectedStudent?.name}</b> ({selectedStudent?.regNo}). This action cannot be undone.
              </p>
              <input
                type="text"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm transition-shadow"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                required
              />
              <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={() => setDeleteModalOpen(false)} disabled={modalLoading}>
                  Cancel
                </Button>
                <button
                  type="submit"
                  disabled={deleteConfirm !== "delete" || modalLoading}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  {modalLoading ? "Deleting..." : "Delete Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
