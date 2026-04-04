import React, { useState } from "react";

import { Pencil, Trash2 } from "lucide-react";
import { apiService } from "../services/api";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

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

const AdminUserTablePage: React.FC = () => {
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
      <div className="flex gap-4 justify-center mb-8">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
          onClick={fetchAdmins}
        >
          Fetch All Admins
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
          onClick={fetchUsers}
        >
          Fetch All Users
        </button>
      </div>
      {loading && (
        <div className="flex justify-center my-8">
          <LoadingSpinner />
        </div>
      )}
      {error && (
        <div className="text-red-600 text-center mb-4">{error}</div>
      )}

      {/* Edit Modal (no external library) */}
      {editModalOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-10 relative">
            <div className="text-lg font-bold mb-4">Edit Student</div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">DOB</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={editForm.dob}
                  onChange={e => setEditForm(f => ({ ...f, dob: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => setEditModalOpen(false)} disabled={modalLoading}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={modalLoading}>{modalLoading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal (no external library) */}
      {deleteModalOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-10 relative">
            <div className="text-lg font-bold mb-4">Delete Student</div>
            <form onSubmit={handleDeleteConfirm} className="space-y-4">
              <p>Type <span className="font-mono bg-gray-100 px-2 py-1 rounded">delete</span> to confirm deletion of <b>{selectedStudent?.name}</b> ({selectedStudent?.regNo})</p>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                required
              />
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => setDeleteModalOpen(false)} disabled={modalLoading}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-red-600 text-white" disabled={deleteConfirm !== "delete" || modalLoading}>{modalLoading ? "Deleting..." : "Delete"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-2 border-b bg-gray-100 text-left text-sm font-semibold text-gray-700"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2 border-b text-sm">
                      {col.key === "actions" && type === "users" ? (
                        <div className="flex gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                            onClick={() => handleEdit(row)}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 p-1"
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
      {type && data.length === 0 && !loading && !error && (
        <div className="text-center text-gray-500 mt-8">No data found.</div>
      )}
    </div>
  );
};

export default AdminUserTablePage;
